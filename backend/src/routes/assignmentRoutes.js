import express from 'express';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const query = req.user.role === 'student' ? { section: req.user.section } : {};
  const assignments = await Assignment.find(query).populate('subject createdBy', 'name');
  res.json(assignments);
});

router.post('/', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin'), async (req, res) => {
  const assignment = await Assignment.create({ ...req.body, createdBy: req.user._id });
  await Notification.create({
    title: 'New Assignment Published',
    message: `${assignment.title} has been posted for ${assignment.section}.`,
    type: 'assignment',
    recipientRole: 'student',
    recipientSection: assignment.section
  });
  res.status(201).json(assignment);
});

router.post('/:id/submit', protect, authorize('student'), async (req, res) => {
  const submission = await Submission.findOneAndUpdate(
    { assignment: req.params.id, student: req.user._id },
    { fileUrl: req.body.fileUrl, status: 'submitted' },
    { upsert: true, new: true }
  );
  res.json(submission);
});

router.patch('/submissions/:id/review', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin'), async (req, res) => {
  const updated = await Submission.findByIdAndUpdate(
    req.params.id,
    { status: 'reviewed', feedback: req.body.feedback || '' },
    { new: true }
  );
  res.json(updated);
});

router.get('/:id/submissions', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin'), async (req, res) => {
  const submissions = await Submission.find({ assignment: req.params.id }).populate('student', 'name email section');
  res.json(submissions);
});

export default router;
