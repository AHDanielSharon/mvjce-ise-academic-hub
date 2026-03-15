import express from 'express';
import Mark from '../models/Mark.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/mine', protect, authorize('student'), async (req, res) => {
  const marks = await Mark.find({ student: req.user._id }).populate('subject', 'name');
  res.json(marks);
});

router.post('/', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin'), async (req, res) => {
  const mark = await Mark.findOneAndUpdate(
    { student: req.body.student, subject: req.body.subject },
    req.body,
    { upsert: true, new: true, runValidators: true }
  );
  await mark.save();
  res.json(mark);
});

export default router;
