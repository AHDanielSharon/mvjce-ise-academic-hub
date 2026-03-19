import express from 'express';
import Subject from '../models/Subject.js';
import Resource from '../models/Resource.js';
import { isDatabaseReady } from '../config/db.js';
import { offlineData } from '../config/offlineAcademicData.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { section } = req.query;
  if (!isDatabaseReady()) return res.json(offlineData.getSubjects(section));

  const query = section ? { section } : {};
  const subjects = await Subject.find(query).sort({ name: 1 });
  return res.json(subjects);
});

router.get('/:id/dashboard', async (req, res) => {
  if (!isDatabaseReady()) return res.json(offlineData.getSubjectDashboard(req.params.id));
  const resources = await Resource.find({ subject: req.params.id }).sort({ createdAt: -1 });
  const grouped = resources.reduce((acc, item) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push(item);
    return acc;
  }, {});
  return res.json(grouped);
});

export default router;
