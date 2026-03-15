import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Timetable from '../models/Timetable.js';
import Setting from '../models/Setting.js';
import Announcement from '../models/Announcement.js';
import Resource from '../models/Resource.js';

dotenv.config();

const subjectsData = [
  'Analysis & Design of Algorithms',
  'Advanced Java',
  'Database Management Systems',
  'Discrete Mathematical Structures',
  'Biology for Engineers',
  'Universal Human Values',
  'AEC Vertical Level II',
  'Analysis & Design of Algorithms Lab'
];

const runSeed = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is required for seeding');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([
    User.deleteMany({}),
    Subject.deleteMany({}),
    Timetable.deleteMany({}),
    Announcement.deleteMany({}),
    Resource.deleteMany({}),
    Setting.deleteMany({})
  ]);

  const [admin, teacher, student] = await User.create([
    { name: 'Admin User', email: 'admin@mvjce.edu.in', password: 'password123', role: 'admin', section: 'ISE 4A' },
    { name: 'Teacher User', email: 'teacher@mvjce.edu.in', password: 'password123', role: 'teacher', section: 'ISE 4A' },
    { name: 'Student User', email: 'student@mvjce.edu.in', password: 'password123', role: 'student', section: 'ISE 4A' }
  ]);

  const subjects = await Promise.all(
    subjectsData.map((name, idx) =>
      Subject.create({
        name,
        code: `ISE40${idx + 1}`,
        section: ['ISE 4A', 'ISE 4B'],
        facultyName: `Faculty ${idx + 1}`,
        designation: idx % 2 === 0 ? 'Assistant Professor' : 'Associate Professor',
        hasLab: name.includes('Lab')
      })
    )
  );

  const sampleEntries = [
    { subject: subjects[0].name, faculty: subjects[0].facultyName, startTime: '09:00', endTime: '09:50', type: 'class' },
    { subject: 'Break', startTime: '09:50', endTime: '10:00', type: 'break' },
    { subject: subjects[1].name, faculty: subjects[1].facultyName, startTime: '10:00', endTime: '10:50', type: 'class' },
    { subject: 'Lunch Break', startTime: '12:30', endTime: '13:15', type: 'lunch' }
  ];

  await Timetable.create([
    { section: 'ISE 4A', day: 'Monday', entries: sampleEntries },
    { section: 'ISE 4B', day: 'Monday', entries: sampleEntries },
    { section: 'ISE 4A', day: 'Friday', entries: sampleEntries },
    { section: 'ISE 4B', day: 'Friday', entries: sampleEntries }
  ]);

  await Setting.create({ key: 'saturdayFollowDay', value: 'Friday' });

  await Announcement.create({
    title: 'Welcome to Academic Hub',
    content: 'Internal Test 1 starts next week. Prepare well.',
    createdBy: teacher._id,
    audience: 'all'
  });

  await Resource.create({
    subject: subjects[0]._id,
    type: 'notes',
    title: 'ADA Module 1 Notes',
    description: 'Introduction and asymptotic notation.',
    linkUrl: 'https://example.com/ada-notes',
    uploadedBy: teacher._id
  });

  console.log('Seed completed');
  console.log({ admin: admin.email, teacher: teacher.email, student: student.email, password: 'password123' });
  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
