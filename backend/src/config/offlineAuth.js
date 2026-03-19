import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeUsn } from './studentRegistry.js';
import { approvedStaffAccounts, normalizeStaffEmail, staffCodes } from './staffRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const offlineUsersPath = path.join(__dirname, '../data/offline-users.json');

const roleAllowList = ['student', 'teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];
const sectionAllowList = ['ISE 4A', 'ISE 4B'];
const sanitizeRole = (role) => (roleAllowList.includes(role) ? role : 'student');
const sanitizeSection = (section) => (sectionAllowList.includes(section) ? section : 'ISE 4A');
const normalizeEmail = (email = '') => normalizeStaffEmail(email);

let offlineSequence = 200;
const makeOfflineId = () => { offlineSequence += 1; return offlineSequence.toString(16).padStart(24, '0'); };
const offlineUsers = new Map();

const persistOfflineUsers = () => {
  const allUsers = [...offlineUsers.values()];
  fs.writeFileSync(offlineUsersPath, JSON.stringify(allUsers, null, 2), 'utf-8');
};

const addOfflineUser = ({ _id, name, email, password, role = 'student', section = 'ISE 4A', designation = '', usn = '', signature = '' }, persist = true) => {
  const normalizedEmail = normalizeEmail(email);
  const user = {
    _id,
    name: (name || '').trim(),
    email: normalizedEmail,
    password,
    role: sanitizeRole(role),
    section: sanitizeSection(section),
    designation: designation || '',
    usn: normalizeUsn(usn),
    signature
  };
  offlineUsers.set(normalizedEmail, user);
  if (/^[0-9a-f]{24}$/i.test(_id || '')) {
    const val = parseInt(_id, 16);
    if (Number.isFinite(val) && val > offlineSequence) offlineSequence = val;
  }
  if (persist) persistOfflineUsers();
  return user;
};

// Pre-seed all teachers from staffCodes so they can login immediately with code
const defaultOfflineUsers = [
  ...staffCodes.map((s, i) => ({
    _id: `0000000000000000000000${(i + 10).toString(16).padStart(2,'0')}`,
    name: s.name,
    email: s.email,
    role: s.role,
    section: s.section,
    designation: s.designation,
    password: s.code, // their login password IS their secret code
    usn: '',
    signature: ''
  })),
];

const loadOfflineUsers = () => {
  try {
    if (!fs.existsSync(offlineUsersPath)) {
      defaultOfflineUsers.forEach((u) => addOfflineUser(u, false));
      persistOfflineUsers();
      return;
    }
    const raw = fs.readFileSync(offlineUsersPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('invalid');
    // Merge: always ensure all default staff accounts exist
    const emailsInFile = new Set(parsed.map(u => normalizeEmail(u.email)));
    defaultOfflineUsers.forEach((u) => {
      if (!emailsInFile.has(normalizeEmail(u.email))) {
        addOfflineUser(u, false);
      }
    });
    parsed.forEach((u) => addOfflineUser(u, false));
  } catch (_e) {
    offlineUsers.clear();
    defaultOfflineUsers.forEach((u) => addOfflineUser(u, false));
    persistOfflineUsers();
  }
};

loadOfflineUsers();

export const toOfflineSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  section: user.section,
  designation: user.designation,
  usn: user.usn,
  signature: user.signature
});

export const findOfflineUserByEmail = (email) => offlineUsers.get(normalizeEmail(email));
export const findOfflineUserByUsn = (usn) => {
  const needle = normalizeUsn(usn);
  for (const user of offlineUsers.values()) {
    if ((user.usn || '') === needle) return user;
  }
  return null;
};
export const findOfflineUserById = (id) => {
  for (const user of offlineUsers.values()) {
    if (user._id === id) return user;
  }
  return null;
};

export const createOfflineUser = ({ name, email, password, role, section, designation, usn = '', signature = '' }) => {
  const normalizedEmail = normalizeEmail(email);
  if (offlineUsers.has(normalizedEmail)) throw new Error('Account already exists with this email.');
  return addOfflineUser({ _id: makeOfflineId(), name, email: normalizedEmail, password, role, section, designation, usn, signature });
};

export const listOfflineUsers = () => [...offlineUsers.values()].map(toOfflineSafeUser);
export const listApprovedStaffAccounts = () => approvedStaffAccounts.map((a) => ({ ...a }));

export const verifyOfflineCredentials = ({ email, password }) => {
  const user = findOfflineUserByEmail(email);
  if (!user || user.password !== password) return null;
  return user;
};

export const verifyOfflineStudentCredentials = ({ usn, password }) => {
  const user = findOfflineUserByUsn(usn);
  if (!user || user.role !== 'student' || user.password !== password) return null;
  return user;
};

// NEW: verify staff by name + code
export const verifyStaffByNameAndCode = ({ name, code }) => {
  const norm = (s = '') => s.trim().toUpperCase().replace(/\s+/g, ' ');
  for (const user of offlineUsers.values()) {
    if (norm(user.name) === norm(name) && user.password === code.trim() && user.role !== 'student') {
      return user;
    }
  }
  return null;
};
