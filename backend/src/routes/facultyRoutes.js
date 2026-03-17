import express from 'express';
import Subject from '../models/Subject.js';
import Timetable from '../models/Timetable.js';
import { isDatabaseReady } from '../config/db.js';
import { offlineData } from '../config/offlineAcademicData.js';

const router = express.Router();

const classCoordinators = {
  'ISE 4A': 'Prof. Anupama P',
  'ISE 4B': 'Prof. Anu K M'
};

router.get('/', async (req, res) => {
  const { section } = req.query;
  if (!isDatabaseReady()) return res.json(offlineData.getFaculty(section));

  const subjectQuery = section ? { section } : {};
  const subjects = await Subject.find(subjectQuery).select('name facultyName designation department section');
  const timetableQuery = section ? { section } : { section: { $in: ['ISE 4A', 'ISE 4B'] } };
  const timetables = await Timetable.find(timetableQuery).select('section entries');

  const subjectMapByFaculty = new Map();
  for (const s of subjects) {
    const sections = Array.isArray(s.section) ? s.section : [s.section];
    for (const sec of sections) {
      const key = `${s.facultyName}-${sec}`;
      if (!subjectMapByFaculty.has(key)) {
        subjectMapByFaculty.set(key, {
          _id: key,
          facultyName: s.facultyName,
          name: s.facultyName,
          designation: s.designation,
          department: s.department,
          section: sec,
          subjects: new Set()
        });
      }
      subjectMapByFaculty.get(key).subjects.add(s.name);
    }
  }

  for (const dayRow of timetables) {
    for (const entry of dayRow.entries || []) {
      if (!entry.faculty || entry.type === 'break' || entry.type === 'lunch') continue;
      const key = `${entry.faculty}-${dayRow.section}`;
      if (!subjectMapByFaculty.has(key)) {
        subjectMapByFaculty.set(key, {
          _id: key,
          facultyName: entry.faculty,
          name: entry.faculty,
          designation: 'Faculty',
          department: 'Information Science & Engineering',
          section: dayRow.section,
          subjects: new Set()
        });
      }
      subjectMapByFaculty.get(key).subjects.add(entry.subject);
    }
  }

  const list = [...subjectMapByFaculty.values()].map((item) => ({
    ...item,
    subjects: [...item.subjects],
    isClassCoordinator: classCoordinators[item.section] === item.facultyName
  })).sort((a, b) => a.facultyName.localeCompare(b.facultyName));

  return res.json(list);
});

export default router;
