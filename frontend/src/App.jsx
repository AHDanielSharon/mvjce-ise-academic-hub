import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import SearchPage from './pages/SearchPage';
import MarksPage from './pages/MarksPage';
import AdminPage from './pages/AdminPage';
import AssignmentsPage from './pages/AssignmentsPage';
import ResourcesPage from './pages/ResourcesPage';
import FacultyPage from './pages/FacultyPage';
import AdaLabPage from './pages/AdaLabPage';
import TimetablePage from './pages/TimetablePage';
import ForumPage from './pages/ForumPage';
import NotificationsPage from './pages/NotificationsPage';
import PeoplePage from './pages/PeoplePage';
import AttendancePage from './pages/AttendancePage';
import StudentsPage from './pages/StudentsPage';

function PL({ children, roles }) {
  return <ProtectedRoute roles={roles}><AppLayout>{children}</AppLayout></ProtectedRoute>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PL><DashboardPage /></PL>} />
        <Route path="/timetable" element={<PL><TimetablePage /></PL>} />
        <Route path="/subjects" element={<PL><SubjectsPage /></PL>} />
        <Route path="/subjects/:id" element={<PL><SubjectDetailPage /></PL>} />
        <Route path="/students" element={<PL><StudentsPage /></PL>} />
        <Route path="/announcements" element={<PL><AnnouncementsPage /></PL>} />
        <Route path="/search" element={<PL><SearchPage /></PL>} />
        <Route path="/assignments" element={<PL><AssignmentsPage /></PL>} />
        <Route path="/attendance" element={<PL><AttendancePage /></PL>} />
        <Route path="/resources" element={<PL><ResourcesPage /></PL>} />
        <Route path="/faculty" element={<PL><FacultyPage /></PL>} />
        <Route path="/adalab" element={<PL><AdaLabPage /></PL>} />
        <Route path="/forum" element={<PL><ForumPage /></PL>} />
        <Route path="/notifications" element={<PL><NotificationsPage /></PL>} />
        <Route path="/people" element={<PL roles={['department_admin','hod','admin','principal']}><PeoplePage /></PL>} />
        <Route path="/marks" element={<PL><MarksPage /></PL>} />
        <Route path="/admin" element={<PL roles={['teacher','lab_instructor','department_admin','hod','admin','principal']}><AdminPage /></PL>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
