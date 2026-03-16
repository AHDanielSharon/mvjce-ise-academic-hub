import express from 'express';
import Timetable from '../models/Timetable.js';
import Setting from '../models/Setting.js';
import { protect, authorize } from '../middleware/auth.js';
import { getCurrentAndNextClass, getEffectiveDay } from '../utils/timetable.js';
import { isDatabaseReady } from '../config/db.js';

const router = express.Router();

router.get('/today/:section', async (req, res) => {
  if (!isDatabaseReady()) {
    return res.json({
      day: getEffectiveDay(new Date(), 'Friday'),
      holiday: false,
      entries: [],
      currentClass: null,
      nextClass: null,
      saturdayFollowDay: 'Friday',
      mode: 'offline'
    });
  }

  const section = req.params.section;
  const config = await Setting.findOne({ key: 'saturdayFollowDay' });
  const day = getEffectiveDay(new Date(), config?.value || 'Friday');

  if (day === 'Holiday') {
    return res.json({ day, holiday: true, entries: [], currentClass: null, nextClass: null });
  }

  const timetable = await Timetable.findOne({ section, day });
  const entries = timetable?.entries || [];
  const { currentClass, nextClass } = getCurrentAndNextClass(entries);
  return res.json({ day, holiday: false, entries, currentClass, nextClass, saturdayFollowDay: config?.value || 'Friday' });
});

router.get('/:section', async (req, res) => {
  if (!isDatabaseReady()) return res.json([]);
  const records = await Timetable.find({ section: req.params.section }).sort({ day: 1 });
  return res.json(records);
});

router.put('/:section/:day', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'), async (req, res) => {
  if (!isDatabaseReady()) return res.status(503).json({ message: 'Timetable updates require database connection.' });
  const { entries } = req.body;
  const doc = await Timetable.findOneAndUpdate(
    { section: req.params.section, day: req.params.day },
    { entries },
    { upsert: true, new: true }
  );
  return res.json(doc);
});

router.put('/settings/saturday', protect, authorize('department_admin', 'hod', 'admin', 'principal'), async (req, res) => {
  if (!isDatabaseReady()) return res.status(503).json({ message: 'Settings update requires database connection.' });
  const { saturdayFollowDay } = req.body;
  const setting = await Setting.findOneAndUpdate(
    { key: 'saturdayFollowDay' },
    { value: saturdayFollowDay },
    { upsert: true, new: true }
  );
  return res.json(setting);
});

router.get('/settings/saturday/value', async (_req, res) => {
  if (!isDatabaseReady()) return res.json({ saturdayFollowDay: 'Friday', mode: 'offline' });
  const setting = await Setting.findOne({ key: 'saturdayFollowDay' });
  return res.json({ saturdayFollowDay: setting?.value || 'Friday' });
});

export default router;
