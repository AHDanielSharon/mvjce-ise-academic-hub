import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { isDatabaseReady } from '../config/db.js';
import { createOfflineUser, toOfflineSafeUser, upsertOfflineStudent, verifyOfflineCredentials } from '../config/offlineAuth.js';
import { getApprovedStudent, makeStudentSignature } from '../config/studentRegistry.js';

const router = express.Router();

const signToken = ({ id, user }) => jwt.sign(
  user ? { user } : { id },
  process.env.JWT_SECRET || 'dev_secret',
  { expiresIn: '7d' }
);

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const normalizeUsn = (usn = '') => usn.trim().toUpperCase();

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

const roleMatchesPortal = (role, portal) => {
  if (!portal || portal === 'any') return true;
  if (portal === 'student') return role === 'student';
  if (portal === 'teacher') return ['teacher', 'lab_instructor'].includes(role);
  if (portal === 'management') return ['department_admin', 'hod', 'admin', 'principal'].includes(role);
  return true;
};

const authenticateApprovedStudent = async ({ name, usn }) => {
  const approved = getApprovedStudent({ name, usn });
  if (!approved) return null;

  const signature = makeStudentSignature(approved.name);

  if (!isDatabaseReady()) {
    const offlineUser = upsertOfflineStudent({
      name: approved.name,
      usn: approved.usn,
      section: approved.section,
      signature
    });
    return { mode: 'offline', user: toOfflineSafeUser(offlineUser) };
  }

  const existing = await User.findOne({ usn: normalizeUsn(approved.usn), role: 'student' });
  if (existing) {
    existing.name = approved.name;
    existing.section = approved.section;
    existing.signature = signature;
    await existing.save();
    return { mode: 'db', user: sanitize(existing) };
  }

  const syntheticEmail = `${approved.usn.toLowerCase()}@mvjce.student`;
  const created = await User.create({
    name: approved.name,
    usn: approved.usn,
    signature,
    role: 'student',
    section: approved.section,
    designation: 'Student',
    email: syntheticEmail,
    password: `${approved.usn.toLowerCase()}@2026`
  });
  return { mode: 'db', user: sanitize(created) };
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student', section = 'ISE 4A', designation = '', usn = '' } = req.body;

    if (role === 'student') {
      if (!name || !usn) return res.status(400).json({ message: 'Student name and USN are required.' });
      const result = await authenticateApprovedStudent({ name, usn });
      if (!result) return res.status(400).json({ message: 'Student not found in approved ISE 4A list. Please enter exact Name and USN.' });
      return res.status(201).json({ token: signToken({ user: result.user }), user: result.user, mode: result.mode, autoLogin: true });
    }

    const normalizedEmail = normalizeEmail(email);
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const payload = { name, email: normalizedEmail, password, role, section, designation };

    if (!isDatabaseReady()) {
      const offlineUser = createOfflineUser(payload);
      const publicUser = toOfflineSafeUser(offlineUser);
      return res.status(201).json({ token: signToken({ user: publicUser }), user: publicUser, mode: 'offline' });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ message: 'Account already exists with this email.' });

    const user = await User.create(payload);
    return res.status(201).json({ token: signToken({ id: user._id }), user: sanitize(user) });
  } catch (error) {
    if (error.message === 'Account already exists with this email.') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { portal = 'any', name = '', usn = '' } = req.body;

    if (portal === 'student' || usn) {
      const result = await authenticateApprovedStudent({ name, usn });
      if (!result) return res.status(400).json({ message: 'Invalid student Name/USN. Enter exactly as approved list.' });
      return res.json({ token: signToken({ user: result.user }), user: result.user, mode: result.mode, autoLogin: true });
    }

    const normalizedEmail = normalizeEmail(req.body.email);
    const { password } = req.body;
    if (!normalizedEmail || !password) return res.status(400).json({ message: 'Email and password are required.' });

    if (!isDatabaseReady()) {
      const offlineUser = verifyOfflineCredentials({ email: normalizedEmail, password });
      if (!offlineUser) return res.status(400).json({ message: 'Invalid email or password.' });
      if (!roleMatchesPortal(offlineUser.role, portal)) return res.status(403).json({ message: `This account is not allowed in the ${portal} portal.` });

      const publicUser = toOfflineSafeUser(offlineUser);
      return res.json({ token: signToken({ user: publicUser }), user: publicUser, mode: 'offline' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.comparePassword(password))) return res.status(400).json({ message: 'Invalid email or password.' });
    if (!roleMatchesPortal(user.role, portal)) return res.status(403).json({ message: `This account is not allowed in the ${portal} portal.` });

    return res.json({ token: signToken({ id: user._id }), user: sanitize(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

export default router;
