import express from 'express';
import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';
import { isDatabaseReady } from '../config/db.js';
import { offlineData } from '../config/offlineAcademicData.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  if (!isDatabaseReady()) return res.json(offlineData.getAnnouncements(req.user.section));
  const audience = req.user.section;
  const announcements = await Announcement.find({ audience: { $in: ['all', audience] } })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name role');
  return res.json(announcements);
});

router.post('/', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'), async (req, res) => {
  if (!isDatabaseReady()) return res.status(201).json(offlineData.addAnnouncement(req.body, req.user));
  const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });
  await Notification.create({
    title: announcement.title,
    message: announcement.content,
    type: 'announcement',
    recipientRole: 'all',
    recipientSection: announcement.audience === 'all' ? 'all' : announcement.audience
  });
  return res.status(201).json(announcement);
});

export default router;
