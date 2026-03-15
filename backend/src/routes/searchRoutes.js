import express from 'express';
import Subject from '../models/Subject.js';
import Resource from '../models/Resource.js';
import Assignment from '../models/Assignment.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const q = req.query.q || '';
  const regex = new RegExp(q, 'i');
  const [subjects, notes, assignments, faculty] = await Promise.all([
    Subject.find({ name: regex }),
    Resource.find({ title: regex }),
    Assignment.find({ title: regex }),
    Subject.find({ facultyName: regex }).select('facultyName designation department name')
  ]);

  res.json({ subjects, notes, assignments, faculty });
});

export default router;
