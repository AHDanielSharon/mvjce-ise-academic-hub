import express from 'express';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const query = req.user.role === 'student' ? { section: req.user.section } : {};
  const assignments = await Assignment.find(query).populate('subject createdBy', 'name');
  res.json(assignments);
});

router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  const assignment = await Assignment.create({ ...req.body, createdBy: req.user._id });
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

router.get('/:id/submissions', protect, authorize('teacher', 'admin'), async (req, res) => {
  const submissions = await Submission.find({ assignment: req.params.id }).populate('student', 'name email');
  res.json(submissions);
});

export default router;
