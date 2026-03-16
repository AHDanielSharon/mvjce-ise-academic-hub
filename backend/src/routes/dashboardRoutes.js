import express from 'express';
import Assignment from '../models/Assignment.js';
import Announcement from '../models/Announcement.js';
import Mark from '../models/Mark.js';
import Subject from '../models/Subject.js';
import Submission from '../models/Submission.js';
import Resource from '../models/Resource.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { isDatabaseReady } from '../config/db.js';

const router = express.Router();

router.get('/overview', protect, async (req, res) => {
  if (!isDatabaseReady()) {
    if (req.user.role === 'student') {
      return res.json({ role: 'student', announcements: [], notifications: [], assignments: [], marks: [], mode: 'offline' });
    }
    if (['teacher', 'lab_instructor'].includes(req.user.role)) {
      return res.json({ role: req.user.role, announcements: [], notifications: [], assignments: [], pendingSubmissions: [], mode: 'offline' });
    }
    return res.json({
      role: req.user.role,
      announcements: [],
      notifications: [],
      analytics: { studentCount: 0, teacherCount: 0, assignmentStats: 0, subjectCount: 0, resourceCount: 0 },
      mode: 'offline'
    });
  }

  const sectionFilter = req.user.section;
  const [announcements, notifications] = await Promise.all([
    Announcement.find({ audience: { $in: ['all', sectionFilter] } }).sort({ createdAt: -1 }).limit(5),
    Notification.find({ recipientSection: { $in: ['all', sectionFilter] } }).sort({ createdAt: -1 }).limit(8)
  ]);

  if (req.user.role === 'student') {
    const [assignments, marks] = await Promise.all([
      Assignment.find({ section: sectionFilter }).sort({ deadline: 1 }).limit(6),
      Mark.find({ student: req.user._id }).populate('subject', 'name')
    ]);
    return res.json({ role: 'student', announcements, notifications, assignments, marks });
  }

  if (['teacher', 'lab_instructor'].includes(req.user.role)) {
    const [assignments, pendingSubmissions] = await Promise.all([
      Assignment.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).limit(6),
      Submission.find({ status: 'submitted' }).sort({ createdAt: -1 }).limit(8).populate('student assignment', 'name title')
    ]);
    return res.json({ role: req.user.role, announcements, notifications, assignments, pendingSubmissions });
  }

  const [studentCount, teacherCount, assignmentStats, subjectCount, resourceCount] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: { $in: ['teacher', 'lab_instructor'] } }),
    Assignment.countDocuments({}),
    Subject.countDocuments({}),
    Resource.countDocuments({})
  ]);

  return res.json({
    role: req.user.role,
    announcements,
    notifications,
    analytics: { studentCount, teacherCount, assignmentStats, subjectCount, resourceCount }
  });
});

export default router;
