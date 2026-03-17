import express from 'express';
import Subject from '../models/Subject.js';
import { isDatabaseReady } from '../config/db.js';
import { offlineData } from '../config/offlineAcademicData.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  if (!isDatabaseReady()) return res.json(offlineData.getFaculty());
  const faculty = await Subject.find().select('name facultyName designation department section');
  return res.json(faculty);
});

export default router;
