import express from 'express';
import Timetable from '../models/Timetable.js';
import Setting from '../models/Setting.js';
import { protect, authorize } from '../middleware/auth.js';
import { getCurrentAndNextClass, getEffectiveDay } from '../utils/timetable.js';

const router = express.Router();

router.get('/today/:section', async (req, res) => {
  const section = req.params.section;
  const config = await Setting.findOne({ key: 'saturdayFollowDay' });
  const day = getEffectiveDay(new Date(), config?.value || 'Friday');

  if (day === 'Holiday') {
    return res.json({ day, holiday: true, entries: [], currentClass: null, nextClass: null });
  }

  const timetable = await Timetable.findOne({ section, day });
  const entries = timetable?.entries || [];
  const { currentClass, nextClass } = getCurrentAndNextClass(entries);
  res.json({ day, holiday: false, entries, currentClass, nextClass, saturdayFollowDay: config?.value || 'Friday' });
});

router.get('/:section', async (req, res) => {
  const records = await Timetable.find({ section: req.params.section }).sort({ day: 1 });
  res.json(records);
});

router.put('/:section/:day', protect, authorize('admin'), async (req, res) => {
  const { entries } = req.body;
  const doc = await Timetable.findOneAndUpdate(
    { section: req.params.section, day: req.params.day },
    { entries },
    { upsert: true, new: true }
  );
  res.json(doc);
});

router.put('/settings/saturday', protect, authorize('admin'), async (req, res) => {
  const { saturdayFollowDay } = req.body;
  const setting = await Setting.findOneAndUpdate(
    { key: 'saturdayFollowDay' },
    { value: saturdayFollowDay },
    { upsert: true, new: true }
  );
  res.json(setting);
});

router.get('/settings/saturday/value', async (_req, res) => {
  const setting = await Setting.findOne({ key: 'saturdayFollowDay' });
  res.json({ saturdayFollowDay: setting?.value || 'Friday' });
});

export default router;
