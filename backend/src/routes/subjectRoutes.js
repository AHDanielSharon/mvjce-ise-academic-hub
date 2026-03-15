import express from 'express';
import Subject from '../models/Subject.js';
import Resource from '../models/Resource.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const subjects = await Subject.find().sort({ name: 1 });
  res.json(subjects);
});

router.get('/:id/dashboard', async (req, res) => {
  const resources = await Resource.find({ subject: req.params.id }).sort({ createdAt: -1 });
  const grouped = resources.reduce((acc, item) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push(item);
    return acc;
  }, {});
  res.json(grouped);
});

export default router;
