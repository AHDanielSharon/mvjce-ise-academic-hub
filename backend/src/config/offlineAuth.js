import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DEMO_PASSWORD = process.env.OFFLINE_DEMO_PASSWORD || 'password123';

const roleAllowList = ['student', 'teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];
const sectionAllowList = ['ISE 4A', 'ISE 4B'];

const sanitizeRole = (role) => (roleAllowList.includes(role) ? role : 'student');
const sanitizeSection = (section) => (sectionAllowList.includes(section) ? section : 'ISE 4A');
const normalizeEmail = (email = '') => email.trim().toLowerCase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const offlineUsersPath = path.join(__dirname, '../data/offline-users.json');

let offlineSequence = 100;
const makeOfflineId = () => {
  offlineSequence += 1;
  return offlineSequence.toString(16).padStart(24, '0');
};

const offlineUsers = new Map();

const persistOfflineUsers = () => {
  const allUsers = [...offlineUsers.values()];
  fs.writeFileSync(offlineUsersPath, JSON.stringify(allUsers, null, 2), 'utf-8');
};

const addOfflineUser = ({ _id, name, email, password, role = 'student', section = 'ISE 4A', designation = '' }, persist = true) => {
  const normalizedEmail = normalizeEmail(email);
  const user = {
    _id,
    name: (name || '').trim(),
    email: normalizedEmail,
    password,
    role: sanitizeRole(role),
    section: sanitizeSection(section),
    designation: designation || ''
  };
  offlineUsers.set(normalizedEmail, user);

  if (/^[0-9a-f]{24}$/i.test(_id || '')) {
    const val = parseInt(_id, 16);
    if (Number.isFinite(val) && val > offlineSequence) offlineSequence = val;
  }

  if (persist) persistOfflineUsers();
  return user;
};

const defaultOfflineUsers = [
  { _id: '0000000000000000000000a1', name: 'ISE Department Admin', email: 'admin.ise@mvjce.edu.in', role: 'department_admin', section: 'ISE 4A', designation: 'Department Administrator' },
  { _id: '0000000000000000000000a2', name: 'Dr. HOD ISE', email: 'hod.ise@mvjce.edu.in', role: 'hod', section: 'ISE 4A', designation: 'Head of Department' },
  { _id: '0000000000000000000000a6', name: 'Principal MVJCE', email: 'principal@mvjce.edu.in', role: 'principal', section: 'ISE 4A', designation: 'Principal' },
  { _id: '0000000000000000000000a3', name: 'Prof. Anupama P', email: 'anupama.p@mvjce.edu.in', role: 'teacher', section: 'ISE 4A', designation: 'Associate Professor' },
  { _id: '0000000000000000000000a4', name: 'Prof. Anu K M', email: 'anu.km@mvjce.edu.in', role: 'lab_instructor', section: 'ISE 4B', designation: 'Lab Instructor' },
  { _id: '0000000000000000000000a5', name: 'ISE Student Representative', email: 'student.ise@mvjce.edu.in', role: 'student', section: 'ISE 4A', designation: 'Student' }
].map((user) => ({ ...user, password: DEMO_PASSWORD }));

const loadOfflineUsers = () => {
  try {
    if (!fs.existsSync(offlineUsersPath)) {
      defaultOfflineUsers.forEach((user) => addOfflineUser(user, false));
      persistOfflineUsers();
      return;
    }

    const raw = fs.readFileSync(offlineUsersPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('offline user store invalid');
    parsed.forEach((user) => addOfflineUser(user, false));
  } catch (_error) {
    offlineUsers.clear();
    defaultOfflineUsers.forEach((user) => addOfflineUser(user, false));
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
  designation: user.designation
});

export const findOfflineUserByEmail = (email) => offlineUsers.get(normalizeEmail(email));

export const findOfflineUserById = (id) => {
  for (const user of offlineUsers.values()) {
    if (user._id === id) return user;
  }
  return null;
};

export const createOfflineUser = ({ name, email, password, role, section, designation }) => {
  const normalizedEmail = normalizeEmail(email);
  if (offlineUsers.has(normalizedEmail)) {
    throw new Error('Account already exists with this email.');
  }

  return addOfflineUser({
    _id: makeOfflineId(),
    name,
    email: normalizedEmail,
    password,
    role,
    section,
    designation
  });
};

export const verifyOfflineCredentials = ({ email, password }) => {
  const user = findOfflineUserByEmail(email);
  if (!user || user.password !== password) return null;
  return user;
};


export const listOfflineUsers = () => [...offlineUsers.values()].map(toOfflineSafeUser);
