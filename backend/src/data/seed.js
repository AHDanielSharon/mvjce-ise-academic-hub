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

const makeDay = (entries) => entries.map((entry) => ({ ...entry }));

const commonBreaks = [
  { subject: 'Break', startTime: '09:40', endTime: '10:10', type: 'break' },
  { subject: 'Break', startTime: '11:50', endTime: '12:00', type: 'break' },
  { subject: 'Lunch Break', startTime: '12:50', endTime: '13:40', type: 'lunch' }
];

const timetableA = {
  Monday: makeDay([
    { subject: 'Analysis & Design of Algorithms', subjectCode: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: 'R048', startTime: '08:00', endTime: '08:50' },
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R048', startTime: '08:50', endTime: '09:40' },
    commonBreaks[0],
    { subject: 'Analysis & Design of Algorithms Lab', subjectCode: 'MVJ22ISL44', faculty: 'Prof. Anu K M', roomNumber: 'JAVA-226', startTime: '10:10', endTime: '11:00' },
    { subject: 'Analysis & Design of Algorithms Lab', subjectCode: 'MVJ22ISL44', faculty: 'Prof. Anu K M', roomNumber: 'JAVA-226', startTime: '11:00', endTime: '11:50' },
    commonBreaks[1],
    { subject: 'Discrete Mathematical Structures', subjectCode: 'MVJ22IS451', faculty: 'Prof. Kucheruva Madhu', roomNumber: 'R048', startTime: '12:00', endTime: '12:50' },
    commonBreaks[2],
    { subject: 'AEC Vertical Level II', subjectCode: 'MVJ22AXYYL', faculty: 'Dr. Shreevarsha', roomNumber: 'R048', startTime: '13:40', endTime: '14:30' },
    { subject: 'Biology for Engineers', subjectCode: 'MVJ22BI47', faculty: 'Prof. Nandana R', roomNumber: 'R048', startTime: '14:30', endTime: '15:20' }
  ]),
  Tuesday: makeDay([
    { subject: 'Database Management Systems', subjectCode: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: 'R048', startTime: '08:00', endTime: '08:50' },
    { subject: 'AEC Vertical Level II', subjectCode: 'MVJ22AXYYL', faculty: 'Dr. Shreevarsha', roomNumber: 'R048', startTime: '08:50', endTime: '09:40' },
    commonBreaks[0],
    { subject: 'Analysis & Design of Algorithms Lab', subjectCode: 'MVJ22ISL44', faculty: 'Prof. Anu K M', roomNumber: 'ADA-227', startTime: '10:10', endTime: '11:00' },
    { subject: 'Analysis & Design of Algorithms Lab', subjectCode: 'MVJ22ISL44', faculty: 'Prof. Anu K M', roomNumber: 'ADA-227', startTime: '11:00', endTime: '11:50' },
    commonBreaks[1],
    { subject: 'Discrete Mathematical Structures', subjectCode: 'MVJ22IS451', faculty: 'Prof. Kucheruva Madhu', roomNumber: 'R048', startTime: '12:00', endTime: '12:50' },
    commonBreaks[2],
    { subject: 'AEC Vertical Level II', subjectCode: 'MVJ22AXYYL', faculty: 'Dr. Shreevarsha', roomNumber: 'R048', startTime: '13:40', endTime: '14:30' },
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R048', startTime: '14:30', endTime: '15:20' }
  ]),
  Wednesday: makeDay([
    { subject: 'Analysis & Design of Algorithms', subjectCode: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: 'R048', startTime: '08:00', endTime: '08:50' },
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R048', startTime: '08:50', endTime: '09:40' },
    commonBreaks[0],
    { subject: 'Database Management Systems', subjectCode: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: 'R048', startTime: '10:10', endTime: '11:00' },
    { subject: 'Discrete Mathematical Structures', subjectCode: 'MVJ22IS451', faculty: 'Prof. Kucheruva Madhu', roomNumber: 'R048', startTime: '11:00', endTime: '11:50' },
    commonBreaks[1],
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R048', startTime: '12:00', endTime: '12:50' },
    commonBreaks[2],
    { subject: 'Library', roomNumber: 'Library', startTime: '13:40', endTime: '14:30', type: 'library' },
    { subject: 'Biology for Engineers', subjectCode: 'MVJ22BI47', faculty: 'Prof. Nandana R', roomNumber: 'R048', startTime: '14:30', endTime: '15:20' }
  ]),
  Thursday: makeDay([
    { subject: 'Discrete Mathematical Structures', subjectCode: 'MVJ22IS451', faculty: 'Prof. Kucheruva Madhu', roomNumber: 'R048', startTime: '08:00', endTime: '08:50' },
    { subject: 'Database Management Systems', subjectCode: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: 'R048', startTime: '08:50', endTime: '09:40' },
    commonBreaks[0],
    { subject: 'Analysis & Design of Algorithms Lab', subjectCode: 'MVJ22ISL44', faculty: 'Prof. Anu K M', roomNumber: 'DBMS-228', startTime: '10:10', endTime: '11:00' },
    { subject: 'Analysis & Design of Algorithms Lab', subjectCode: 'MVJ22ISL44', faculty: 'Prof. Anu K M', roomNumber: 'DBMS-228', startTime: '11:00', endTime: '11:50' },
    commonBreaks[1],
    { subject: 'Discrete Mathematical Structures', subjectCode: 'MVJ22IS451', faculty: 'Prof. Kucheruva Madhu', roomNumber: 'R048', startTime: '12:00', endTime: '12:50' },
    commonBreaks[2],
    { subject: 'Database Management Systems', subjectCode: 'MVJ22IS43', faculty: 'Prof. Anupama P', roomNumber: 'R048', startTime: '13:40', endTime: '14:30' },
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R048', startTime: '14:30', endTime: '15:20' }
  ]),
  Friday: makeDay([
    { subject: 'Advanced Java', subjectCode: 'MVJ22IS42', faculty: 'Prof. Venkatesh G', roomNumber: 'R048', startTime: '08:00', endTime: '08:50' },
    { subject: 'Discrete Mathematical Structures', subjectCode: 'MVJ22IS451', faculty: 'Prof. Kucheruva Madhu', roomNumber: 'R048', startTime: '08:50', endTime: '09:40' },
    commonBreaks[0],
    { subject: 'Analysis & Design of Algorithms', subjectCode: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: 'R048', startTime: '10:10', endTime: '11:00' },
    { subject: 'Counselling', roomNumber: 'R048', startTime: '11:00', endTime: '11:50', type: 'counselling' },
    commonBreaks[1],
    { subject: 'Counselling', roomNumber: 'R048', startTime: '12:00', endTime: '12:50', type: 'counselling' },
    commonBreaks[2],
    { subject: 'Biology for Engineers', subjectCode: 'MVJ22BI47', faculty: 'Prof. Nandana R', roomNumber: 'R048', startTime: '13:40', endTime: '14:30' },
    { subject: 'Analysis & Design of Algorithms', subjectCode: 'MVJ22IS41', faculty: 'Prof. Anu K M', roomNumber: 'R048', startTime: '14:30', endTime: '15:20' }
  ])
};

const timetableB = {
  Monday: [...timetableA.Monday],
  Tuesday: [...timetableA.Tuesday],
  Wednesday: [...timetableA.Wednesday],
  Thursday: [...timetableA.Thursday],
  Friday: [...timetableA.Friday]
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

  const [admin, hod, teacher, labInstructor, student] = await User.create([
    { name: 'ISE Department Admin', email: 'admin.ise@mvjce.edu.in', password: 'password123', role: 'department_admin', section: 'ISE 4A', designation: 'Department Administrator' },
    { name: 'Dr. HOD ISE', email: 'hod.ise@mvjce.edu.in', password: 'password123', role: 'hod', section: 'ISE 4A', designation: 'Head of Department' },
    { name: 'Prof. Anupama P', email: 'anupama.p@mvjce.edu.in', password: 'password123', role: 'teacher', section: 'ISE 4A', designation: 'Associate Professor' },
    { name: 'Prof. Anu K M', email: 'anu.km@mvjce.edu.in', password: 'password123', role: 'lab_instructor', section: 'ISE 4B', designation: 'Lab Instructor' },
    { name: 'ISE Student Representative', email: 'student.ise@mvjce.edu.in', password: 'password123', role: 'student', section: 'ISE 4A', designation: 'Student' }
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
    createdBy: student._id,
    answers: [{ content: 'Use min-heap and adjacency list for O((V+E) log V).', answeredBy: teacher._id, isHelpful: true }]
  });

  await Notification.insertMany([
    { title: 'New Department Platform', message: 'ISE Nexus is now live for all users.', type: 'system', recipientRole: 'all', recipientSection: 'all' },
    { title: 'ADA Resource Uploaded', message: 'New notes added in ADA knowledge hub.', type: 'resource', recipientRole: 'all', recipientSection: 'all' }
  ]);

  console.log('Seed completed with official sample users:');
  console.log({
    departmentAdmin: admin.email,
    hod: hod.email,
    teacher: teacher.email,
    labInstructor: labInstructor.email,
    student: student.email,
    password: 'password123'
  });

  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
