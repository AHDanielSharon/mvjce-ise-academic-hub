import express from 'express';
import Mark from '../models/Mark.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';
import { isDatabaseReady } from '../config/db.js';
import { offlineData } from '../config/offlineAcademicData.js';

const router = express.Router();

router.get('/mine', protect, authorize('student'), async (req, res) => {
  if (!isDatabaseReady()) return res.json(offlineData.getMyMarks(req.user));
  const marks = await Mark.find({ student: req.user._id, published: true }).populate('subject', 'name');
  return res.json(marks);
});

router.get('/', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'), async (req, res) => {
  if (!isDatabaseReady()) return res.json(offlineData.getAllMarks(req.query.section));
  const marks = await Mark.find({}).populate('subject', 'name').populate('student', 'name section');
  const filtered = req.query.section ? marks.filter((m) => m.student?.section === req.query.section) : marks;
  return res.json(filtered);
});

router.post('/', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'), async (req, res) => {
  if (!isDatabaseReady()) return res.json(offlineData.upsertMark(req.body, req.user));

  const mark = await Mark.findOneAndUpdate(
    { student: req.body.student, subject: req.body.subject },
    req.body,
    { upsert: true, new: true, runValidators: true }
  );
  await mark.save();

  if (mark.published) {
    await Notification.create({
      title: 'Exam Result Published',
      message: 'Your latest internal/semester result has been published.',
      type: 'result',
      recipientRole: 'student',
      recipientSection: 'all'
    });
  }

  return res.json(mark);
});

export default router;
