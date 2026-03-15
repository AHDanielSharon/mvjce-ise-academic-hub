import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { isDatabaseReady } from '../config/db.js';

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

const ensureDatabase = (res) => {
  if (!isDatabaseReady()) {
    res.status(503).json({
      message: 'Database is not connected. Please configure a valid MONGO_URI and restart the server.'
    });
    return false;
  }
  return true;
};

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  section: user.section,
  designation: user.designation
});

router.post('/register', async (req, res) => {
  if (!ensureDatabase(res)) return;
  try {
    const { name, email, password, role = 'student', section = 'ISE 4A', designation = '' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Account already exists with this email.' });

    const user = await User.create({ name, email, password, role, section, designation });
    return res.status(201).json({ token: signToken(user._id), user: sanitize(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  if (!ensureDatabase(res)) return;
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    return res.json({ token: signToken(user._id), user: sanitize(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

export default router;
