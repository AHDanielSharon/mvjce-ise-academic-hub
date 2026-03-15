import express from 'express';
import multer from 'multer';
import Resource from '../models/Resource.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'backend/uploads/' });

router.get('/', async (req, res) => {
  const filter = req.query.subject ? { subject: req.query.subject } : {};
  const resources = await Resource.find(filter).populate('subject', 'name').sort({ createdAt: -1 });
  res.json(resources);
});

router.post('/', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin'), upload.single('file'), async (req, res) => {
  const payload = {
    ...req.body,
    fileUrl: req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl,
    uploadedBy: req.user._id
  };
  const created = await Resource.create(payload);
  await Notification.create({
    title: 'New Learning Resource',
    message: `${created.title} has been uploaded.`,
    type: 'resource',
    recipientRole: 'all',
    recipientSection: 'all'
  });
  res.status(201).json(created);
});

export default router;
