import express from 'express';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';
import { isDatabaseReady } from '../config/db.js';
import { offlineData } from '../config/offlineAcademicData.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  if (!isDatabaseReady()) return res.json(offlineData.getAssignments(req.user));
  const query = req.user.role === 'student' ? { section: req.user.section } : {};
  const assignments = await Assignment.find(query).populate('subject createdBy', 'name');
  return res.json(assignments);
});

router.post('/', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'), async (req, res) => {
  if (!isDatabaseReady()) return res.status(201).json(offlineData.addAssignment(req.body, req.user));
  const assignment = await Assignment.create({ ...req.body, createdBy: req.user._id });
  await Notification.create({
    title: 'New Assignment Published',
    message: `${assignment.title} has been posted for ${assignment.section}.`,
    type: 'assignment',
    recipientRole: 'student',
    recipientSection: assignment.section
  });
  return res.status(201).json(assignment);
});

router.post('/:id/submit', protect, authorize('student'), async (req, res) => {
  if (!isDatabaseReady()) return res.json(offlineData.submitAssignment(req.params.id, req.user, req.body.fileUrl));
  const submission = await Submission.findOneAndUpdate(
    { assignment: req.params.id, student: req.user._id },
    { fileUrl: req.body.fileUrl, status: 'submitted' },
    { upsert: true, new: true }
  );
  return res.json(submission);
});

router.patch('/submissions/:id/review', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'), async (req, res) => {
  if (!isDatabaseReady()) {
    const updated = offlineData.reviewSubmission(req.params.id, req.body.feedback || '');
    if (!updated) return res.status(404).json({ message: 'Submission not found.' });
    return res.json(updated);
  }
  const updated = await Submission.findByIdAndUpdate(
    req.params.id,
    { status: 'reviewed', feedback: req.body.feedback || '' },
    { new: true }
  );
  return res.json(updated);
});

router.get('/:id/submissions', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'), async (req, res) => {
  if (!isDatabaseReady()) return res.json(offlineData.getAssignmentSubmissions(req.params.id));
  const submissions = await Submission.find({ assignment: req.params.id }).populate('student', 'name email section');
  return res.json(submissions);
});

export default router;
