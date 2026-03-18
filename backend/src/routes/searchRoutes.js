import express from 'express';
import Subject from '../models/Subject.js';
import Resource from '../models/Resource.js';
import Assignment from '../models/Assignment.js';
import { isDatabaseReady } from '../config/db.js';
import { offlineData } from '../config/offlineAcademicData.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const q = req.query.q || '';

  if (!isDatabaseReady()) return res.json(offlineData.search(q));

  const regex = new RegExp(q, 'i');
  const [subjects, notes, assignments, faculty] = await Promise.all([
    Subject.find({ name: regex }),
    Resource.find({ title: regex }),
    Assignment.find({ title: regex }),
    Subject.find({ facultyName: regex }).select('facultyName designation department name')
  ]);

  return res.json({ subjects, notes, assignments, faculty });
});

export default router;
