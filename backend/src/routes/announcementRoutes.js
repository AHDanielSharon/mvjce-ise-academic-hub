import express from 'express';
import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const audience = req.user.section;
  const announcements = await Announcement.find({ audience: { $in: ['all', audience] } })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name role');
  res.json(announcements);
});

router.post('/', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin'), async (req, res) => {
  const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });
  await Notification.create({
    title: announcement.title,
    message: announcement.content,
    type: 'announcement',
    recipientRole: 'all',
    recipientSection: announcement.audience === 'all' ? 'all' : announcement.audience
  });
  res.status(201).json(announcement);
});

export default router;
