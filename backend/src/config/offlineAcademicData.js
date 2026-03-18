import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCurrentAndNextClass, getEffectiveDay } from '../utils/timetable.js';
import { approvedStudents, normalizeUsn } from './studentRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storePath = path.join(__dirname, '../data/offline-academic.json');

const makeId = (() => {
  let n = 200;
  return () => {
    n += 1;
    return n.toString(16).padStart(24, '0');
  };
})();

const baseSubjects = [
  { _id: '000000000000000000000201', name: 'Analysis & Design of Algorithms', code: 'MVJ22IS41', facultyName: 'Dr. Kumar R', designation: 'Professor', department: 'ISE', section: ['ISE 4A', 'ISE 4B'] },
  { _id: '000000000000000000000202', name: 'Advanced Java', code: 'MVJ22IS42', facultyName: 'Prof. Kavitha C S', designation: 'Associate Professor', department: 'ISE', section: ['ISE 4A', 'ISE 4B'] },
  { _id: '000000000000000000000203', name: 'Database Management Systems', code: 'MVJ22IS43', facultyName: 'Dr. Sinsha P S', designation: 'Associate Professor', department: 'ISE', section: ['ISE 4A', 'ISE 4B'] },
  { _id: '000000000000000000000204', name: 'Discrete Mathematical Structures', code: 'MVJ22IS451', facultyName: 'Prof. Kucheruva Madhu', designation: 'Professor', department: 'Maths', section: ['ISE 4A', 'ISE 4B'] },
  { _id: '000000000000000000000205', name: 'Biology for Engineers', code: 'MVJ22BI47', facultyName: 'Prof. Nandana R', designation: 'Assistant Professor', department: 'ISE', section: ['ISE 4A', 'ISE 4B'] },
  { _id: '000000000000000000000206', name: 'Universal Human Values', code: 'MVJ22UHV48', facultyName: 'Prof. Nandana R', designation: 'Assistant Professor', department: 'ISE', section: ['ISE 4A', 'ISE 4B'] },
  { _id: '000000000000000000000207', name: 'AEC Vertical Level II', code: 'MVJ22AXYYL', facultyName: 'Dr. Shreevarsha', designation: 'Professor', department: 'ISE', section: ['ISE 4A', 'ISE 4B'] },
  { _id: '000000000000000000000208', name: 'Analysis & Design of Algorithms Lab', code: 'MVJ22ISL44', facultyName: 'Prof. Anu K M', designation: 'Professor', department: 'ISE', section: ['ISE 4A', 'ISE 4B'] }
];

const defaultEntries = [
  { subject: 'Analysis & Design of Algorithms', startTime: '08:00', endTime: '08:50', roomNumber: 'R049' },
  { subject: 'Advanced Java', startTime: '08:50', endTime: '09:40', roomNumber: 'R049' },
  { subject: 'Break', startTime: '09:40', endTime: '10:10', type: 'break' },
  { subject: 'Database Management Systems', startTime: '10:10', endTime: '11:00', roomNumber: 'R049' },
  { subject: 'Discrete Mathematical Structures', startTime: '11:00', endTime: '11:50', roomNumber: 'R049' }
];

const buildDefaultStore = () => ({
  settings: { saturdayFollowDay: 'Friday' },
  subjects: baseSubjects,
  timetable: {
    'ISE 4A': {
      Monday: defaultEntries,
      Tuesday: defaultEntries,
      Wednesday: defaultEntries,
      Thursday: defaultEntries,
      Friday: defaultEntries
    },
    'ISE 4B': {
      Monday: defaultEntries,
      Tuesday: defaultEntries,
      Wednesday: defaultEntries,
      Thursday: defaultEntries,
      Friday: defaultEntries
    }
  },
  timetableImages: { 'ISE 4A': '', 'ISE 4B': '' },
  resources: [],
  announcements: [
    {
      _id: '000000000000000000000401',
      title: 'Welcome to ISE Nexus',
      content: 'Platform is active for students and faculty.',
      audience: 'all',
      createdAt: new Date().toISOString(),
      createdBy: { name: 'Department Admin', role: 'department_admin' }
    }
  ],
  assignments: [],
  submissions: [],
  marks: [],
  notifications: [],
  attendance: []
});

let store = buildDefaultStore();

const save = () => fs.writeFileSync(storePath, JSON.stringify(store, null, 2));

const load = () => {
  try {
    if (!fs.existsSync(storePath)) {
      save();
      return;
    }
    const parsed = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
    store = { ...buildDefaultStore(), ...parsed };
  } catch {
    store = buildDefaultStore();
    save();
  }
};

load();

const addNotification = ({ title, message, type = 'system', recipientRole = 'all', recipientSection = 'all' }) => {
  const item = {
    _id: makeId(),
    title,
    message,
    type,
    recipientRole,
    recipientSection,
    createdAt: new Date().toISOString()
  };
  if (!store.notifications) store.notifications = [];
  store.notifications.unshift(item);
  save();
  return item;
};

export const offlineData = {
  getSubjects: (section) => section ? store.subjects.filter((s) => (Array.isArray(s.section) ? s.section.includes(section) : s.section === section)) : store.subjects,
  getFaculty: (section) => {
    const cc = { 'ISE 4A': 'Prof. Anupama P', 'ISE 4B': 'Prof. Anu K M' };
    const rows = (section ? store.subjects.filter((s) => (Array.isArray(s.section) ? s.section.includes(section) : s.section === section)) : store.subjects)
      .map((s) => ({ _id: s._id, name: s.facultyName, facultyName: s.facultyName, designation: s.designation, department: s.department, section: Array.isArray(s.section) ? s.section[0] : s.section, subjects: [s.name] }));
    return rows.map((r) => ({ ...r, isClassCoordinator: cc[r.section] === r.facultyName }));
  },
  getSubjectDashboard: (subjectId) => {
    const grouped = {};
    for (const r of store.resources.filter((x) => x.subject === subjectId)) {
      grouped[r.type] = grouped[r.type] || [];
      grouped[r.type].push(r);
    }
    return grouped;
  },
  getWeeklyTimetable: (section) => {
    const days = store.timetable[section] || {};
    return Object.keys(days).map((day) => ({ _id: `${section}-${day}`, section, day, entries: days[day] }));
  },
  getTodayTimetable: (section) => {
    const day = getEffectiveDay(new Date(), store.settings.saturdayFollowDay || 'Friday');
    if (day === 'Holiday') return { day, holiday: true, entries: [], currentClass: null, nextClass: null };
    const entries = (store.timetable[section] && store.timetable[section][day]) || [];
    const { currentClass, nextClass } = getCurrentAndNextClass(entries);
    return { day, holiday: false, entries, currentClass, nextClass, saturdayFollowDay: store.settings.saturdayFollowDay || 'Friday', mode: 'offline' };
  },
  setDayTimetable: (section, day, entries) => {
    if (!store.timetable[section]) store.timetable[section] = {};
    store.timetable[section][day] = entries;
    save();
    addNotification({ title: 'Timetable Updated', message: `Timetable updated for ${section} on ${day}.`, type: 'timetable', recipientRole: 'student', recipientSection: section });
    return { section, day, entries };
  },
  getTimetableImage: (section) => (store.timetableImages || {})[section] || '',
  setTimetableImage: (section, imageUrl) => {
    if (!store.timetableImages) store.timetableImages = {};
    store.timetableImages[section] = imageUrl;
    save();
    return imageUrl;
  },
  getSaturdayFollowDay: () => store.settings.saturdayFollowDay || 'Friday',
  setSaturdayFollowDay: (value) => {
    store.settings.saturdayFollowDay = value;
    save();
    return { key: 'saturdayFollowDay', value };
  },
  getResources: (subject) => {
    const list = subject ? store.resources.filter((r) => r.subject === subject) : store.resources;
    const subjectMap = new Map(store.subjects.map((s) => [s._id, s]));
    return list.map((r) => ({ ...r, subject: subjectMap.get(r.subject) || { _id: r.subject, name: 'Unknown Subject' } }));
  },
  addResource: (payload, user) => {
    const item = { _id: makeId(), ...payload, uploadedBy: user._id, createdAt: new Date().toISOString() };
    store.resources.unshift(item);
    save();
    addNotification({ title: 'New Learning Resource', message: `${item.title} has been uploaded.`, type: 'resource', recipientRole: 'student', recipientSection: 'all' });
    return item;
  },
  getAllMarks: (section) => {
    const subjectMap = new Map(store.subjects.map((s) => [s._id, s]));
    const marks = store.marks || [];
    return marks
      .filter((m) => !section || m.studentSection === section)
      .map((m) => ({ ...m, subject: subjectMap.get(m.subject) || { _id: m.subject, name: 'Unknown Subject' }, student: { _id: m.student, name: m.studentName, section: m.studentSection } }));
  },
  getMyMarks: (user) => {
    const subjectMap = new Map(store.subjects.map((s) => [s._id, s]));
    return (store.marks || [])
      .filter((m) => m.student === user._id && m.published)
      .map((m) => ({ ...m, subject: subjectMap.get(m.subject) || { _id: m.subject, name: 'Unknown Subject' } }));
  },
  upsertMark: (payload) => {
    if (!store.marks) store.marks = [];
    const idx = store.marks.findIndex((m) => m.student === payload.student && m.subject === payload.subject);
    const base = idx >= 0 ? store.marks[idx] : { _id: makeId(), student: payload.student, subject: payload.subject, studentName: payload.studentName, studentSection: payload.studentSection };
    const item = {
      ...base,
      ia1: Number(payload.ia1 || 0),
      ia2: Number(payload.ia2 || 0),
      ia3: Number(payload.ia3 || 0),
      sem: Number(payload.sem || 0),
      published: Boolean(payload.published),
      total: Number(payload.ia1 || 0) + Number(payload.ia2 || 0) + Number(payload.ia3 || 0) + Number(payload.sem || 0),
      updatedAt: new Date().toISOString()
    };
    if (idx >= 0) store.marks[idx] = item; else store.marks.unshift(item);
    save();
    if (item.published) addNotification({ title: 'Exam Result Published', message: 'Your latest internal/semester result has been published.', type: 'result', recipientRole: 'student', recipientSection: item.studentSection || 'all' });
    return item;
  },
  getNotifications: (user) => (store.notifications || []).filter((n) => (n.recipientRole === 'all' || n.recipientRole === user.role) && (n.recipientSection === 'all' || n.recipientSection === user.section)),

  getAttendanceRoster: (section) => {
    if (section === 'ISE 4A') return approvedStudents.map((s) => ({ usn: normalizeUsn(s.usn), name: s.name }));
    const fromMarks = (store.marks || []).filter((m) => m.studentSection === section).map((m) => ({ usn: normalizeUsn(m.student), name: m.studentName }));
    const uniq = new Map(fromMarks.map((s) => [s.usn, s]));
    return [...uniq.values()];
  },
  markAttendance: ({ section, subject, date, entries }, user) => {
    if (!store.attendance) store.attendance = [];
    const idx = store.attendance.findIndex((a) => a.section === section && a.subject === subject && a.date === date);
    const item = {
      _id: idx >= 0 ? store.attendance[idx]._id : makeId(),
      section,
      subject,
      date,
      takenBy: user._id,
      entries: (entries || []).map((e) => ({ studentUsn: normalizeUsn(e.studentUsn), studentName: e.studentName, present: Boolean(e.present) }))
    };
    if (idx >= 0) store.attendance[idx] = item; else store.attendance.unshift(item);
    save();
    addNotification({ title: 'Attendance Updated', message: `${subject} attendance added for ${section} (${date}).`, type: 'attendance', recipientRole: 'student', recipientSection: section });
    return item;
  },
  getAttendanceBySection: (section, subject = '') => (store.attendance || []).filter((a) => a.section === section && (!subject || a.subject === subject)),
  getStudentAttendanceSummary: (user) => {
    const usn = normalizeUsn(user.usn || '');
    if (!usn) return { overall: { present: 0, total: 0, percentage: 0 }, subjects: [] };
    const rows = (store.attendance || []).filter((a) => a.section === user.section);
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
    return { overall: { present, total, percentage: total ? Math.round((present / total) * 100) : 0 }, subjects };
  },
  getAssignments: (user) => {
    const list = user.role === 'student' ? store.assignments.filter((a) => a.section === user.section) : store.assignments;
    const subjectMap = new Map(store.subjects.map((s) => [s._id, s]));
    return list.map((a) => ({ ...a, subject: subjectMap.get(a.subject) || { _id: a.subject, name: 'Unknown Subject' } }));
  },
  addAssignment: (payload, user) => {
    const item = { _id: makeId(), ...payload, createdBy: user._id, createdAt: new Date().toISOString() };
    store.assignments.unshift(item);
    save();
    addNotification({ title: 'New Assignment Published', message: `${item.title} has been posted for ${item.section}.`, type: 'assignment', recipientRole: 'student', recipientSection: item.section || 'all' });
    return item;
  },
  submitAssignment: (assignmentId, user, fileUrl) => {
    const idx = store.submissions.findIndex((s) => s.assignment === assignmentId && s.student === user._id);
    const item = {
      _id: idx >= 0 ? store.submissions[idx]._id : makeId(),
      assignment: assignmentId,
      student: user._id,
      studentName: user.name,
      studentEmail: user.email,
      section: user.section,
      fileUrl,
      status: 'submitted',
      feedback: ''
    };
    if (idx >= 0) store.submissions[idx] = item; else store.submissions.push(item);
    save();
    return item;
  },
  getAssignmentSubmissions: (assignmentId) => store.submissions.filter((s) => s.assignment === assignmentId),
  reviewSubmission: (submissionId, feedback = '') => {
    const idx = store.submissions.findIndex((s) => s._id === submissionId);
    if (idx < 0) return null;
    store.submissions[idx] = { ...store.submissions[idx], status: 'reviewed', feedback };
    save();
    return store.submissions[idx];
  },
  getAnnouncements: (section) => store.announcements.filter((a) => a.audience === 'all' || a.audience === section),
  addAnnouncement: (payload, user) => {
    const item = { _id: makeId(), ...payload, createdAt: new Date().toISOString(), createdBy: { _id: user._id, name: user.name, role: user.role } };
    store.announcements.unshift(item);
    save();
    return item;
  },
  search: (q) => {
    const regex = new RegExp(q || '', 'i');
    const subjects = store.subjects.filter((s) => regex.test(s.name));
    const notes = store.resources.filter((r) => regex.test(r.title));
    const assignments = store.assignments.filter((a) => regex.test(a.title));
    const faculty = store.subjects.filter((s) => regex.test(s.facultyName)).map((s) => ({ facultyName: s.facultyName, designation: s.designation, department: s.department, name: s.name }));
    return { subjects, notes, assignments, faculty };
  },
  getOverview: (user) => {
    const notifications = (store.notifications || []).slice(0, 10);
    if (user.role === 'student') {
      const announcements = store.announcements.filter((a) => a.audience === 'all' || a.audience === user.section);
      return { role: 'student', announcements, notifications, assignments: store.assignments.filter((a) => a.section === user.section), marks: offlineData.getMyMarks(user), attendance: offlineData.getStudentAttendanceSummary(user), mode: 'offline' };
    }
    if (['teacher', 'lab_instructor'].includes(user.role)) {
      const announcements = store.announcements.filter((a) => a.audience === 'all' || a.audience === user.section);
      return { role: user.role, announcements, notifications, assignments: store.assignments.filter((a) => a.createdBy === user._id), pendingSubmissions: store.submissions.filter((s) => s.status === 'submitted').map((s) => ({ ...s, student: { name: s.studentName }, assignment: { title: (store.assignments.find((a) => a._id === s.assignment) || {}).title || 'Assignment' } })), mode: 'offline' };
    }
    const announcements = store.announcements.filter((a) => a.audience === 'all' || a.audience === user.section);
    return { role: user.role, announcements, notifications, analytics: { studentCount: 0, teacherCount: 0, assignmentStats: store.assignments.length, subjectCount: store.subjects.length, resourceCount: store.resources.length }, mode: 'offline' };
  }
};
