import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCurrentAndNextClass, getEffectiveDay } from '../utils/timetable.js';

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
  resources: [
    {
      _id: '000000000000000000000301',
      subject: '000000000000000000000201',
      type: 'notes',
      title: 'ADA Unit 1 Notes',
      description: 'Asymptotic analysis and complexity.',
      linkUrl: 'https://example.com/ada-unit-1'
    }
  ],
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
  submissions: []
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

export const offlineData = {
  getSubjects: () => store.subjects,
  getFaculty: () => store.subjects.map((s) => ({ _id: s._id, name: s.name, facultyName: s.facultyName, designation: s.designation, department: s.department, section: s.section })),
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
    return { section, day, entries };
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
    return item;
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
    const notifications = store.announcements.slice(0, 5).map((a) => ({ _id: a._id, title: a.title }));
    if (user.role === 'student') {
      const announcements = store.announcements.filter((a) => a.audience === 'all' || a.audience === user.section);
      return { role: 'student', announcements, notifications, assignments: store.assignments.filter((a) => a.section === user.section), marks: [], mode: 'offline' };
    }
    if (['teacher', 'lab_instructor'].includes(user.role)) {
      const announcements = store.announcements.filter((a) => a.audience === 'all' || a.audience === user.section);
      return { role: user.role, announcements, notifications, assignments: store.assignments.filter((a) => a.createdBy === user._id), pendingSubmissions: store.submissions.filter((s) => s.status === 'submitted').map((s) => ({ ...s, student: { name: s.studentName }, assignment: { title: (store.assignments.find((a) => a._id === s.assignment) || {}).title || 'Assignment' } })), mode: 'offline' };
    }
    const announcements = store.announcements.filter((a) => a.audience === 'all' || a.audience === user.section);
    return { role: user.role, announcements, notifications, analytics: { studentCount: 0, teacherCount: 0, assignmentStats: store.assignments.length, subjectCount: store.subjects.length, resourceCount: store.resources.length }, mode: 'offline' };
  }
};
