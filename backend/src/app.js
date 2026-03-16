import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import marksRoutes from './routes/marksRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  return res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

export default app;
