import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { isDatabaseReady } from '../config/db.js';
import { listOfflineUsers } from '../config/offlineAuth.js';

const router = express.Router();

router.get('/', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'), async (_req, res) => {
  if (!isDatabaseReady()) {
    const users = listOfflineUsers().sort((a, b) => a.role.localeCompare(b.role) || a.name.localeCompare(b.name));
    const grouped = {
      students: users.filter((u) => u.role === 'student'),
      teachers: users.filter((u) => ['teacher', 'lab_instructor'].includes(u.role)),
      management: users.filter((u) => ['department_admin', 'hod', 'admin', 'principal'].includes(u.role))
    };
    return res.json({ grouped, users, mode: 'offline' });
  }

  const users = await User.find({}).select('name email role section designation createdAt').sort({ role: 1, name: 1 });

  const grouped = {
    students: users.filter((u) => u.role === 'student'),
    teachers: users.filter((u) => ['teacher', 'lab_instructor'].includes(u.role)),
    management: users.filter((u) => ['department_admin', 'hod', 'admin', 'principal'].includes(u.role))
  };

  return res.json({ grouped, users });
});

export default router;
