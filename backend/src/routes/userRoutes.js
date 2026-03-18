import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { isDatabaseReady } from '../config/db.js';
import { listApprovedStaffAccounts, listOfflineUsers } from '../config/offlineAuth.js';
import { approvedStaffAccounts } from '../config/staffRegistry.js';

const router = express.Router();

const managementRoles = ['department_admin', 'hod', 'admin', 'principal'];
const teachingRoles = ['teacher', 'lab_instructor'];

const isManagementUser = (user) => managementRoles.includes(user?.role);

const groupUsers = (users) => ({
  students: users.filter((u) => u.role === 'student'),
  teachers: users.filter((u) => teachingRoles.includes(u.role)),
  management: users.filter((u) => managementRoles.includes(u.role))
});

const toVisibleUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  section: user.section,
  designation: user.designation,
  createdAt: user.createdAt || null
});

const toStudentDirectoryUser = (user) => ({
  _id: user._id,
  name: user.name,
  section: user.section,
  designation: user.designation,
  usn: user.usn || ''
});

const buildOfficialAccountAudit = (users) => {
  const normalizedUsers = users.map((user) => ({
    ...user,
    email: (user.email || '').trim().toLowerCase()
  }));

  const audit = approvedStaffAccounts.map((account) => {
    const matchingUsers = normalizedUsers.filter((user) => user.email === account.email);
    const exactRoleMatch = matchingUsers.find((user) => user.role === account.role);
    const matchedUser = exactRoleMatch || matchingUsers[0] || null;

    return {
      email: account.email,
      expectedName: account.name,
      expectedRole: account.role,
      expectedSection: account.section,
      expectedDesignation: account.designation,
      provisioned: Boolean(exactRoleMatch),
      hasEmailMatch: matchingUsers.length > 0,
      roleMismatch: Boolean(matchedUser) && matchedUser.role !== account.role,
      matchedUser: matchedUser
        ? {
            _id: matchedUser._id,
            name: matchedUser.name,
            role: matchedUser.role,
            section: matchedUser.section,
            designation: matchedUser.designation,
            createdAt: matchedUser.createdAt || null
          }
        : null
    };
  });

  return {
    totals: {
      approved: audit.length,
      provisioned: audit.filter((entry) => entry.provisioned).length,
      missing: audit.filter((entry) => !entry.hasEmailMatch).length,
      mismatched: audit.filter((entry) => entry.roleMismatch).length
    },
    accounts: audit
  };
};

router.get('/', protect, authorize('teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'), async (req, res) => {
  const managementView = isManagementUser(req.user);

  if (!isDatabaseReady()) {
    const users = listOfflineUsers()
      .map(toVisibleUser)
      .sort((a, b) => a.role.localeCompare(b.role) || a.name.localeCompare(b.name));

    const grouped = groupUsers(users);

    if (!managementView) {
      return res.json({
        grouped: { students: grouped.students.map(toStudentDirectoryUser), teachers: [], management: [] },
        users: grouped.students.map(toStudentDirectoryUser),
        mode: 'offline',
        visibility: 'students_only'
      });
    }

    return res.json({
      grouped,
      users,
      mode: 'offline',
      visibility: 'full_directory',
      officialAccountAudit: buildOfficialAccountAudit(users),
      approvedStaffAccounts: listApprovedStaffAccounts()
    });
  }

  const users = (await User.find({}).select('name email role section designation usn createdAt').sort({ role: 1, name: 1 }))
    .map((user) => toVisibleUser(user.toObject ? user.toObject() : user));

  const grouped = groupUsers(users);

  if (!managementView) {
    return res.json({
      grouped: { students: grouped.students.map(toStudentDirectoryUser), teachers: [], management: [] },
      users: grouped.students.map(toStudentDirectoryUser),
      visibility: 'students_only'
    });
  }

  return res.json({
    grouped,
    users,
    visibility: 'full_directory',
    officialAccountAudit: buildOfficialAccountAudit(users),
    approvedStaffAccounts
  });
});

export default router;
