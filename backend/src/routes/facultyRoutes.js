import express from 'express';
import Subject from '../models/Subject.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const faculty = await Subject.find().select('name facultyName designation department section');
  res.json(faculty);
});

export default router;
