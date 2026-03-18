import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { isDatabaseReady } from '../config/db.js';
import { offlineData } from '../config/offlineAcademicData.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  if (!isDatabaseReady()) return res.json(offlineData.getNotifications(req.user));

  const section = req.user.section;
  const notifications = await Notification.find({
    recipientSection: { $in: ['all', section] },
    recipientRole: { $in: ['all', req.user.role] }
  }).sort({ createdAt: -1 });
  return res.json(notifications);
});

export default router;
