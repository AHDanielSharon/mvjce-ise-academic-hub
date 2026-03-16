import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { isDatabaseReady } from '../config/db.js';
import { createOfflineUser, toOfflineSafeUser, verifyOfflineCredentials } from '../config/offlineAuth.js';

const router = express.Router();

const signToken = ({ id, user }) => jwt.sign(
  user ? { user } : { id },
  process.env.JWT_SECRET || 'dev_secret',
  { expiresIn: '7d' }
);

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  section: user.section,
  designation: user.designation
});

const roleMatchesPortal = (role, portal) => {
  if (!portal || portal === 'any') return true;
  if (portal === 'student') return role === 'student';
  if (portal === 'teacher') return ['teacher', 'lab_instructor'].includes(role);
  if (portal === 'management') return ['department_admin', 'hod', 'admin', 'principal'].includes(role);
  return true;
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student', section = 'ISE 4A', designation = '' } = req.body;
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
    const normalizedEmail = normalizeEmail(req.body.email);
    const { password, portal = 'any' } = req.body;
    if (!normalizedEmail || !password) return res.status(400).json({ message: 'Email and password are required.' });

    if (!isDatabaseReady()) {
      const offlineUser = verifyOfflineCredentials({ email: normalizedEmail, password });
      if (!offlineUser) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
      if (!roleMatchesPortal(offlineUser.role, portal)) {
        return res.status(403).json({ message: `This account is not allowed in the ${portal} portal.` });
      }

      const publicUser = toOfflineSafeUser(offlineUser);
      return res.json({ token: signToken({ user: publicUser }), user: publicUser, mode: 'offline' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    if (!roleMatchesPortal(user.role, portal)) {
      return res.status(403).json({ message: `This account is not allowed in the ${portal} portal.` });
    }

    return res.json({ token: signToken({ id: user._id }), user: sanitize(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

export default router;
