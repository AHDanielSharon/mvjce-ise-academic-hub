import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Timetable from '../models/Timetable.js';
import Setting from '../models/Setting.js';
import Announcement from '../models/Announcement.js';
import Resource from '../models/Resource.js';
import ForumPost from '../models/ForumPost.js';
import Notification from '../models/Notification.js';

dotenv.config();

const subjectsData = [
  { name: 'Analysis & Design of Algorithms', code: 'MVJ22IS41', facultyName: 'Dr. Kumar R', designation: 'Professor' },
  { name: 'Advanced Java', code: 'MVJ22IS42', facultyName: 'Prof. Kavitha C S', designation: 'Associate Professor' },
  { name: 'Database Management Systems', code: 'MVJ22IS43', facultyName: 'Dr. Sinsha P S', designation: 'Associate Professor' },
  { name: 'Discrete Mathematical Structures', code: 'MVJ22IS451', facultyName: 'Prof. Kucheruva Madhu', designation: 'Professor' },
  { name: 'Biology for Engineers', code: 'MVJ22BI47', facultyName: 'Prof. Nandana R', designation: 'Assistant Professor' },
  { name: 'Universal Human Values', code: 'MVJ22UHV48', facultyName: 'Prof. Nandana R', designation: 'Assistant Professor' },
  { name: 'AEC Vertical Level II', code: 'MVJ22AXYYL', facultyName: 'Dr. Shreevarsha', designation: 'Professor' },
  { name: 'Analysis & Design of Algorithms Lab', code: 'MVJ22ISL44', facultyName: 'Prof. Anu K M', designation: 'Professor', hasLab: true }
];

const commonBreaks = {
  shortMorning: { subject: 'Break', startTime: '09:40', endTime: '10:10', type: 'break' },
  shortNoon: { subject: 'Break', startTime: '11:50', endTime: '12:00', type: 'break' },
  lunch: { subject: 'Lunch Break', startTime: '12:50', endTime: '13:40', type: 'lunch' }
};

const cloneEntries = (entries) => entries.map((entry) => ({ ...entry }));

const timetableA = {
  Monday: cloneEntries([
    { subject: 'Analysis & Design of Algorithms', subjectCode: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: 'R049', startTime: '08:00', endTime: '08:50' },
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R049', startTime: '08:50', endTime: '09:40' },
    commonBreaks.shortMorning,
    { subject: 'Analysis & Design of Algorithms Lab (B2)', subjectCode: 'MVJ22ISL44', faculty: 'Prof. Anu K M', roomNumber: 'JAVA-226', startTime: '10:10', endTime: '11:00', type: 'lab' },
    { subject: 'Database Management Systems Lab (B1)', subjectCode: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: 'DBMS-228', startTime: '11:00', endTime: '11:50', type: 'lab' },
    commonBreaks.shortNoon,
    { subject: 'Discrete Mathematical Structures (R)', subjectCode: 'MVJ22IS451', faculty: 'Prof. Kucheruva Madhu', roomNumber: 'R049', startTime: '12:00', endTime: '12:50' },
    commonBreaks.lunch,
    { subject: 'Library', roomNumber: 'Library', startTime: '13:40', endTime: '14:30', type: 'library' },
    { subject: 'AEC Vertical Level II', subjectCode: 'MVJ22AXYYL', faculty: 'Dr. Shreevarsha', roomNumber: 'R049', startTime: '14:30', endTime: '15:20' }
  ]),
  Tuesday: cloneEntries([
    { subject: 'Database Management Systems', subjectCode: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: 'R049', startTime: '08:00', endTime: '08:50' },
    { subject: 'Universal Human Values', subjectCode: 'MVJ22UHV48', faculty: 'Prof. Nandana R', roomNumber: 'R049', startTime: '08:50', endTime: '09:40' },
    commonBreaks.shortMorning,
    { subject: 'Advanced Java (B2)', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R049', startTime: '10:10', endTime: '11:00' },
    { subject: 'Analysis & Design of Algorithms Lab (B1)', subjectCode: 'MVJ22ISL44', faculty: 'Prof. Anu K M', roomNumber: 'ADA-227', startTime: '11:00', endTime: '11:50', type: 'lab' },
    commonBreaks.shortNoon,
    { subject: 'Discrete Mathematical Structures', subjectCode: 'MVJ22IS451', faculty: 'Prof. Kucheruva Madhu', roomNumber: 'R049', startTime: '12:00', endTime: '12:50' },
    commonBreaks.lunch,
    { subject: 'AEC Vertical Level II', subjectCode: 'MVJ22AXYYL', faculty: 'Dr. Shreevarsha', roomNumber: 'R049', startTime: '13:40', endTime: '14:30' },
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R049', startTime: '14:30', endTime: '15:20' }
  ]),
  Wednesday: cloneEntries([
    { subject: 'Analysis & Design of Algorithms', subjectCode: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: 'R049', startTime: '08:00', endTime: '08:50' },
    { subject: 'Database Management Systems (R)', subjectCode: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: 'R049', startTime: '08:50', endTime: '09:40' },
    commonBreaks.shortMorning,
    { subject: 'Database Management Systems', subjectCode: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: 'R049', startTime: '10:10', endTime: '11:00' },
    { subject: 'Discrete Mathematical Structures', subjectCode: 'MVJ22IS451', faculty: 'Prof. Kucheruva Madhu', roomNumber: 'R049', startTime: '11:00', endTime: '11:50' },
    commonBreaks.shortNoon,
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R049', startTime: '12:00', endTime: '12:50' },
    commonBreaks.lunch,
    { subject: 'Library', roomNumber: 'Library', startTime: '13:40', endTime: '14:30', type: 'library' },
    { subject: 'Biology for Engineers', subjectCode: 'MVJ22BI47', faculty: 'Prof. Nandana R', roomNumber: 'R049', startTime: '14:30', endTime: '15:20' }
  ]),
  Thursday: cloneEntries([
    { subject: 'Discrete Mathematical Structures', subjectCode: 'MVJ22IS451', faculty: 'Prof. Kucheruva Madhu', roomNumber: 'R049', startTime: '08:00', endTime: '08:50' },
    { subject: 'Database Management Systems', subjectCode: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: 'R049', startTime: '08:50', endTime: '09:40' },
    commonBreaks.shortMorning,
    { subject: 'Database Management Systems Lab (B1)', subjectCode: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: 'DBMS-228', startTime: '10:10', endTime: '11:00', type: 'lab' },
    { subject: 'Advanced Java (B2)', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R049', startTime: '11:00', endTime: '11:50' },
    commonBreaks.shortNoon,
    { subject: 'Advanced Java (R)', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R049', startTime: '12:00', endTime: '12:50' },
    commonBreaks.lunch,
    { subject: 'Database Management Systems', subjectCode: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: 'R049', startTime: '13:40', endTime: '14:30' },
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R049', startTime: '14:30', endTime: '15:20' }
  ]),
  Friday: cloneEntries([
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R049', startTime: '08:00', endTime: '08:50' },
    { subject: 'Analysis & Design of Algorithms (R)', subjectCode: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: 'R049', startTime: '08:50', endTime: '09:40' },
    commonBreaks.shortMorning,
    { subject: 'Database Management Systems', subjectCode: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: 'R049', startTime: '10:10', endTime: '11:00' },
    { subject: 'Counselling', roomNumber: 'R049', startTime: '11:00', endTime: '11:50', type: 'counselling' },
    commonBreaks.shortNoon,
    { subject: 'Counselling', roomNumber: 'R049', startTime: '12:00', endTime: '12:50', type: 'counselling' },
    commonBreaks.lunch,
    { subject: 'Biology for Engineers', subjectCode: 'MVJ22BI47', faculty: 'Prof. Nandana R', roomNumber: 'R049', startTime: '13:40', endTime: '14:30' },
    { subject: 'Analysis & Design of Algorithms', subjectCode: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: 'R049', startTime: '14:30', endTime: '15:20' }
  ])
};

const timetableB = {
  Monday: cloneEntries([
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Kavitha C S', roomNumber: 'R048', startTime: '08:00', endTime: '08:50' },
    { subject: 'Discrete Mathematical Structures', subjectCode: 'MVJ22IS451', faculty: 'Prof. Shreevarsha', roomNumber: 'R048', startTime: '08:50', endTime: '09:40' },
    commonBreaks.shortMorning,
    { subject: 'Analysis & Design of Algorithms', subjectCode: 'MVJ22IS41', faculty: 'Dr. Kumar R', roomNumber: 'R048', startTime: '10:10', endTime: '11:00' },
    { subject: 'Database Management Systems', subjectCode: 'MVJ22IS43', faculty: 'Dr. Sinsha P S', roomNumber: 'R048', startTime: '11:00', endTime: '11:50' },
    commonBreaks.shortNoon,
    { subject: 'Discrete Mathematical Structures (R)', subjectCode: 'MVJ22IS451', faculty: 'Prof. Shreevarsha', roomNumber: 'R048', startTime: '12:00', endTime: '12:50' },
    commonBreaks.lunch,
    { subject: 'Library', roomNumber: 'Library', startTime: '13:40', endTime: '14:30', type: 'library' },
    { subject: 'Skill Development Hour', roomNumber: 'R048', startTime: '14:30', endTime: '15:20', type: 'activity' }
  ]),
  Tuesday: cloneEntries([
    { subject: 'Database Management Systems', subjectCode: 'MVJ22IS43', faculty: 'Dr. Sinsha P S', roomNumber: 'R048', startTime: '08:00', endTime: '08:50' },
    { subject: 'Discrete Mathematical Structures', subjectCode: 'MVJ22IS451', faculty: 'Prof. Shreevarsha', roomNumber: 'R048', startTime: '08:50', endTime: '09:40' },
    commonBreaks.shortMorning,
    { subject: 'Analysis & Design of Algorithms', subjectCode: 'MVJ22IS41', faculty: 'Dr. Kumar R', roomNumber: 'R048', startTime: '10:10', endTime: '11:00' },
    { subject: 'AEC Vertical Level II', subjectCode: 'MVJ22AXYYL', faculty: 'Dr. Shreevarsha', roomNumber: 'R048', startTime: '11:00', endTime: '11:50' },
    commonBreaks.shortNoon,
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Kavitha C S', roomNumber: 'R048', startTime: '12:00', endTime: '12:50' },
    commonBreaks.lunch,
    { subject: 'AEC Vertical Level II', subjectCode: 'MVJ22AXYYL', faculty: 'Dr. Shreevarsha', roomNumber: 'R048', startTime: '13:40', endTime: '14:30' },
    { subject: 'Biology for Engineers', subjectCode: 'MVJ22BI47', faculty: 'Prof. Shagina P K', roomNumber: 'R048', startTime: '14:30', endTime: '15:20' }
  ]),
  Wednesday: cloneEntries([
    { subject: 'Universal Human Values', subjectCode: 'MVJ22UHV48', faculty: 'Prof. Nandana R', roomNumber: 'R048', startTime: '08:00', endTime: '08:50' },
    { subject: 'Database Management Systems (R)', subjectCode: 'MVJ22IS43', faculty: 'Dr. Sinsha P S', roomNumber: 'R048', startTime: '08:50', endTime: '09:40' },
    commonBreaks.shortMorning,
    { subject: 'Advanced Java (B1)', subjectCode: 'MVJ22IS42', faculty: 'Prof. Kavitha C S', roomNumber: 'R048', startTime: '10:10', endTime: '11:00' },
    { subject: 'Analysis & Design of Algorithms Lab (B2)', subjectCode: 'MVJ22ISL44', faculty: 'Prof. Anu K M', roomNumber: 'ADA-227', startTime: '11:00', endTime: '11:50', type: 'lab' },
    commonBreaks.shortNoon,
    { subject: 'Analysis & Design of Algorithms', subjectCode: 'MVJ22IS41', faculty: 'Dr. Kumar R', roomNumber: 'R048', startTime: '12:00', endTime: '12:50' },
    commonBreaks.lunch,
    { subject: 'Library', roomNumber: 'Library', startTime: '13:40', endTime: '14:30', type: 'library' },
    { subject: 'Biology for Engineers', subjectCode: 'MVJ22BI47', faculty: 'Prof. Shagina P K', roomNumber: 'R048', startTime: '14:30', endTime: '15:20' }
  ]),
  Thursday: cloneEntries([
    { subject: 'Database Management Systems Lab (B2)', subjectCode: 'MVJ22IS43', faculty: 'Dr. Sinsha P S', roomNumber: 'DBMS-228', startTime: '08:00', endTime: '08:50', type: 'lab' },
    { subject: 'Analysis & Design of Algorithms Lab (B1)', subjectCode: 'MVJ22ISL44', faculty: 'Prof. Anu K M', roomNumber: 'ADA-227', startTime: '08:50', endTime: '09:40', type: 'lab' },
    commonBreaks.shortMorning,
    { subject: 'Discrete Mathematical Structures', subjectCode: 'MVJ22IS451', faculty: 'Prof. Shreevarsha', roomNumber: 'R048', startTime: '10:10', endTime: '11:00' },
    { subject: 'Counselling', roomNumber: 'R048', startTime: '11:00', endTime: '11:50', type: 'counselling' },
    commonBreaks.shortNoon,
    { subject: 'Advanced Java (R)', subjectCode: 'MVJ22IS42', faculty: 'Prof. Kavitha C S', roomNumber: 'R048', startTime: '12:00', endTime: '12:50' },
    commonBreaks.lunch,
    { subject: 'Database Management Systems', subjectCode: 'MVJ22IS43', faculty: 'Dr. Sinsha P S', roomNumber: 'R048', startTime: '13:40', endTime: '14:30' },
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Kavitha C S', roomNumber: 'R048', startTime: '14:30', endTime: '15:20' }
  ]),
  Friday: cloneEntries([
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Kavitha C S', roomNumber: 'R048', startTime: '08:00', endTime: '08:50' },
    { subject: 'Analysis & Design of Algorithms (R)', subjectCode: 'MVJ22IS41', faculty: 'Dr. Kumar R', roomNumber: 'R048', startTime: '08:50', endTime: '09:40' },
    commonBreaks.shortMorning,
    { subject: 'Advanced Java (B2)', subjectCode: 'MVJ22IS42', faculty: 'Prof. Kavitha C S', roomNumber: 'R048', startTime: '10:10', endTime: '11:00' },
    { subject: 'Database Management Systems (B1)', subjectCode: 'MVJ22IS43', faculty: 'Dr. Sinsha P S', roomNumber: 'R048', startTime: '11:00', endTime: '11:50' },
    commonBreaks.shortNoon,
    { subject: 'Biology for Engineers', subjectCode: 'MVJ22BI47', faculty: 'Prof. Shagina P K', roomNumber: 'R048', startTime: '12:00', endTime: '12:50' },
    commonBreaks.lunch,
    { subject: 'Project Hour', roomNumber: 'R048', startTime: '13:40', endTime: '14:30', type: 'activity' },
    { subject: 'Database Management Systems', subjectCode: 'MVJ22IS43', faculty: 'Dr. Sinsha P S', roomNumber: 'R048', startTime: '14:30', endTime: '15:20' }
  ])
};

const runSeed = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is required for seeding');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([
    User.deleteMany({}), Subject.deleteMany({}), Timetable.deleteMany({}),
    Announcement.deleteMany({}), Resource.deleteMany({}), Setting.deleteMany({}),
    ForumPost.deleteMany({}), Notification.deleteMany({})
  ]);

  const [admin, hod, teacher, labInstructor, studentA, studentB] = await User.create([
    { name: 'ISE Department Admin', email: 'admin.ise@mvjce.edu.in', password: 'password123', role: 'department_admin', section: 'ISE 4A', designation: 'Department Administrator' },
    { name: 'Dr. HOD ISE', email: 'hod.ise@mvjce.edu.in', password: 'password123', role: 'hod', section: 'ISE 4A', designation: 'Head of Department' },
    { name: 'Prof. Anupama P', email: 'anupama.p@mvjce.edu.in', password: 'password123', role: 'teacher', section: 'ISE 4A', designation: 'Associate Professor' },
    { name: 'Prof. Anu K M', email: 'anu.km@mvjce.edu.in', password: 'password123', role: 'lab_instructor', section: 'ISE 4B', designation: 'Lab Instructor' },
    { name: 'ISE Student Representative 4A', email: 'student.ise4a@mvjce.edu.in', password: 'password123', role: 'student', section: 'ISE 4A', designation: 'Student' },
    { name: 'ISE Student Representative 4B', email: 'student.ise4b@mvjce.edu.in', password: 'password123', role: 'student', section: 'ISE 4B', designation: 'Student' }
  ]);

  const subjects = await Subject.insertMany(
    subjectsData.map((subject) => ({ ...subject, section: ['ISE 4A', 'ISE 4B'], department: 'Information Science & Engineering' }))
  );

  const docs = [];
  for (const [day, entries] of Object.entries(timetableA)) docs.push({ section: 'ISE 4A', day, entries });
  for (const [day, entries] of Object.entries(timetableB)) docs.push({ section: 'ISE 4B', day, entries });
  await Timetable.insertMany(docs);

  await Setting.create({ key: 'saturdayFollowDay', value: 'Friday' });

  await Announcement.create({
    title: 'ISE Nexus Operational',
    content: 'Welcome to ISE Nexus, the official academic operating system for the department.',
    createdBy: admin._id,
    audience: 'all'
  });

  await Resource.create({
    subject: subjects[0]._id,
    type: 'notes',
    title: 'ADA Asymptotic Analysis Notes',
    description: 'Official module notes curated by ISE faculty.',
    linkUrl: 'https://example.com/ise-nexus/ada-notes',
    uploadedBy: teacher._id
  });

  await ForumPost.create({
    title: 'How to optimize Dijkstra using priority queue?',
    question: 'Can someone explain complexity improvement with adjacency list + heap?',
    tags: ['ADA', 'graphs', 'complexity'],
    createdBy: studentA._id,
    answers: [{ content: 'Use min-heap and adjacency list for O((V+E) log V).', answeredBy: teacher._id, isHelpful: true }]
  });

  await Notification.insertMany([
    { title: 'New Department Platform', message: 'ISE Nexus is now live for all users.', type: 'system', recipientRole: 'all', recipientSection: 'all' },
    { title: 'ADA Resource Uploaded', message: 'New notes added in ADA knowledge hub.', type: 'resource', recipientRole: 'all', recipientSection: 'all' },
    { title: '4B Timetable Published', message: 'ISE 4B week schedule has been synced for this semester.', type: 'announcement', recipientRole: 'all', recipientSection: 'ISE 4B' }
  ]);

  console.log('Seed completed with official sample users:');
  console.log({
    departmentAdmin: admin.email,
    hod: hod.email,
    teacher: teacher.email,
    labInstructor: labInstructor.email,
    student4A: studentA.email,
    student4B: studentB.email,
    password: 'password123'
  });

  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
