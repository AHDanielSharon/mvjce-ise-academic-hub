import express from 'express';
import Attendance from '../models/Attendance.js';
import { protect, authorize } from '../middleware/auth.js';
import { isDatabaseReady } from '../config/db.js';
import { offlineData } from '../config/offlineAcademicData.js';
import { approvedStudents, normalizeUsn } from '../config/studentRegistry.js';

const router = express.Router();

const rosterForSection = (section) => {
  if (section === 'ISE 4A') return approvedStudents.map((s) => ({ usn: normalizeUsn(s.usn), name: s.name }));
  return [];
};

router.get('/roster/:section', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'), async (req, res) => {
  const section = req.params.section;
  if (!isDatabaseReady()) return res.json(offlineData.getAttendanceRoster(section));
  return res.json(rosterForSection(section));
});

router.post('/mark', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'), async (req, res) => {
  const { section, subject, date, entries } = req.body;
  if (!section || !subject || !date) return res.status(400).json({ message: 'section, subject and date are required.' });

  if (!isDatabaseReady()) return res.json(offlineData.markAttendance({ section, subject, date, entries }, req.user));

  const updated = await Attendance.findOneAndUpdate(
    { section, subject, date },
    {
      section,
      subject,
      date,
      takenBy: req.user._id,
      entries: (entries || []).map((e) => ({ studentUsn: normalizeUsn(e.studentUsn), studentName: e.studentName, present: Boolean(e.present) }))
    },
    { upsert: true, new: true, runValidators: true }
  );

  return res.json(updated);
});

router.get('/section/:section', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'), async (req, res) => {
  const { section } = req.params;
  const { subject = '' } = req.query;
  if (!isDatabaseReady()) return res.json(offlineData.getAttendanceBySection(section, subject));
  const filter = { section, ...(subject ? { subject } : {}) };
  const rows = await Attendance.find(filter).sort({ date: -1 });
  return res.json(rows);
});

router.get('/mine', protect, authorize('student'), async (req, res) => {
  if (!isDatabaseReady()) return res.json(offlineData.getStudentAttendanceSummary(req.user));

  const usn = normalizeUsn(req.user.usn || '');
  if (!usn) return res.json({ overall: { present: 0, total: 0, percentage: 0 }, subjects: [] });

  const rows = await Attendance.find({ section: req.user.section }).sort({ date: 1 });
  const totals = new Map();
  let total = 0;
  let present = 0;

  for (const row of rows) {
    const found = (row.entries || []).find((e) => normalizeUsn(e.studentUsn) === usn);
    if (!found) continue;
    total += 1;
    if (found.present) present += 1;
    if (!totals.has(row.subject)) totals.set(row.subject, { subject: row.subject, present: 0, total: 0 });
    const bucket = totals.get(row.subject);
    bucket.total += 1;
    if (found.present) bucket.present += 1;
  }

  const subjects = [...totals.values()].map((s) => ({ ...s, percentage: s.total ? Math.round((s.present / s.total) * 100) : 0 }));
  return res.json({ overall: { present, total, percentage: total ? Math.round((present / total) * 100) : 0 }, subjects });
});

export default router;
