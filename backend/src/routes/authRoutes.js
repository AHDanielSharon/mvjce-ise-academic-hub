import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { isDatabaseReady } from '../config/db.js';
import {
  createOfflineUser, findOfflineUserByUsn, toOfflineSafeUser,
  verifyOfflineCredentials, verifyOfflineStudentCredentials, verifyStaffByNameAndCode
} from '../config/offlineAuth.js';
import { getApprovedStudent, getApprovedStudentByUsn, makeStudentSignature, normalizeUsn } from '../config/studentRegistry.js';
import { getApprovedStaffAccount, isApprovedStaffEmail, getStaffByNameAndCode, staffCodes } from '../config/staffRegistry.js';

const router = express.Router();

const signToken = ({ id, user }) => jwt.sign(
  user ? { user } : { id },
  process.env.JWT_SECRET || 'ise4a_nexus_secret_2026',
  { expiresIn: '7d' }
);

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  section: user.section,
  designation: user.designation,
  usn: user.usn,
  signature: user.signature
});

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, password, role = 'student', usn = '' } = req.body;

    // Student registration: name + USN + password
    if (role === 'student') {
      if (!name || !usn || !password) return res.status(400).json({ message: 'Full name, USN and password are required.' });
      if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });

      const approved = getApprovedStudent({ name, usn });
      if (!approved) return res.status(400).json({
        message: 'Name or USN not found in ISE 4A official records. Please enter your exact name and USN as per college records.'
      });

      const canonicalUsn = normalizeUsn(approved.usn);
      const signature = makeStudentSignature(approved.name);
      const syntheticEmail = `${canonicalUsn.toLowerCase()}@ise4a.mvjce`;

      if (!isDatabaseReady()) {
        const existing = findOfflineUserByUsn(canonicalUsn);
        if (existing) return res.status(400).json({ message: 'Account already exists. Please login with your USN and password.' });
        const offlineUser = createOfflineUser({ name: approved.name, email: syntheticEmail, password, role: 'student', section: 'ISE 4A', designation: 'Student', usn: canonicalUsn, signature });
        const publicUser = toOfflineSafeUser(offlineUser);
        return res.status(201).json({ token: signToken({ user: publicUser }), user: publicUser, mode: 'offline', autoLogin: true });
      }

      const exists = await User.findOne({ usn: canonicalUsn, role: 'student' });
      if (exists) return res.status(400).json({ message: 'Account already exists. Please login with your USN and password.' });

      const user = await User.create({ name: approved.name, usn: canonicalUsn, signature, role: 'student', section: 'ISE 4A', designation: 'Student', email: syntheticEmail, password });
      return res.status(201).json({ token: signToken({ id: user._id }), user: sanitize(user), autoLogin: true });
    }

    return res.status(403).json({ message: 'Staff accounts are pre-configured. Please use Teacher/HOD portal with your name and secret code.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { portal = 'any', usn = '', password = '', name = '', code = '' } = req.body;

    // ── STUDENT login: USN + password
    if (portal === 'student' || (usn && !code)) {
      if (!usn || !password) return res.status(400).json({ message: 'USN and password are required.' });
      const approvedByUsn = getApprovedStudentByUsn(usn);
      if (!approvedByUsn) return res.status(400).json({ message: 'USN not found in ISE 4A records.' });
      const canonicalUsn = normalizeUsn(approvedByUsn.usn);

      if (!isDatabaseReady()) {
        const offlineUser = verifyOfflineStudentCredentials({ usn: canonicalUsn, password });
        if (!offlineUser) return res.status(400).json({ message: 'Invalid USN or password. Have you created your account yet?' });
        return res.json({ token: signToken({ user: toOfflineSafeUser(offlineUser) }), user: toOfflineSafeUser(offlineUser), mode: 'offline' });
      }
      const user = await User.findOne({ usn: canonicalUsn, role: 'student' });
      if (!user) return res.status(400).json({ message: 'Student account not found. Please register first.' });
      if (!(await user.comparePassword(password))) return res.status(400).json({ message: 'Incorrect password.' });
      return res.json({ token: signToken({ id: user._id }), user: sanitize(user) });
    }

    // ── TEACHER/HOD/ADMIN login: name + secret code
    if (portal === 'teacher' || portal === 'management' || code) {
      if (!name || !code) return res.status(400).json({ message: 'Please select your name and enter your secret code.' });

      // Offline mode
      if (!isDatabaseReady()) {
        const offlineUser = verifyStaffByNameAndCode({ name, code });
        if (!offlineUser) return res.status(403).json({ message: 'Invalid name or secret code. Contact HOD if you need your code.' });
        return res.json({ token: signToken({ user: toOfflineSafeUser(offlineUser) }), user: toOfflineSafeUser(offlineUser), mode: 'offline' });
      }

      // DB mode — check staffCodes registry
      const staffEntry = getStaffByNameAndCode(name, code);
      if (!staffEntry) return res.status(403).json({ message: 'Invalid name or secret code. Contact HOD if you need your code.' });

      const user = await User.findOne({ email: staffEntry.email });
      if (!user) {
        // Auto-create staff user on first login with valid code
        const newUser = await User.create({
          name: staffEntry.name, email: staffEntry.email, password: staffEntry.code,
          role: staffEntry.role, section: staffEntry.section, designation: staffEntry.designation,
        });
        return res.json({ token: signToken({ id: newUser._id }), user: sanitize(newUser) });
      }
      return res.json({ token: signToken({ id: user._id }), user: sanitize(user) });
    }

    return res.status(400).json({ message: 'Invalid login portal specified.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET list of teacher names (for dropdown — no codes exposed)
router.get('/staff-names', (_req, res) => {
  const teachers = staffCodes
    .filter(s => ['teacher', 'hod', 'department_admin'].includes(s.role))
    .map(s => ({ name: s.name, role: s.role, designation: s.designation }));
  res.json(teachers);
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

export default router;
