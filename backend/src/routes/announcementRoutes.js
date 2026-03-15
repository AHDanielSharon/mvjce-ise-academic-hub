import express from 'express';
import Announcement from '../models/Announcement.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const audience = req.user.section;
  const announcements = await Announcement.find({ audience: { $in: ['all', audience] } }).sort({ createdAt: -1 }).populate('createdBy', 'name role');
  res.json(announcements);
});

router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(announcement);
});

export default router;
