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

function ProtectedLayout({ children, roles }) {
  return (
    <ProtectedRoute roles={roles}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
        <Route path="/timetable" element={<ProtectedLayout><TimetablePage /></ProtectedLayout>} />
        <Route path="/subjects" element={<ProtectedLayout><SubjectsPage /></ProtectedLayout>} />
        <Route path="/subjects/:id" element={<ProtectedLayout><SubjectDetailPage /></ProtectedLayout>} />
        <Route path="/announcements" element={<ProtectedLayout><AnnouncementsPage /></ProtectedLayout>} />
        <Route path="/search" element={<ProtectedLayout><SearchPage /></ProtectedLayout>} />
        <Route path="/assignments" element={<ProtectedLayout><AssignmentsPage /></ProtectedLayout>} />
        <Route path="/resources" element={<ProtectedLayout><ResourcesPage /></ProtectedLayout>} />
        <Route path="/faculty" element={<ProtectedLayout><FacultyPage /></ProtectedLayout>} />
        <Route path="/adalab" element={<ProtectedLayout><AdaLabPage /></ProtectedLayout>} />
        <Route path="/forum" element={<ProtectedLayout><ForumPage /></ProtectedLayout>} />
        <Route path="/notifications" element={<ProtectedLayout><NotificationsPage /></ProtectedLayout>} />
        <Route path="/people" element={<ProtectedLayout roles={['department_admin', 'hod', 'admin', 'principal']}><PeoplePage /></ProtectedLayout>} />
        <Route path="/marks" element={<ProtectedLayout><MarksPage /></ProtectedLayout>} />
        <Route path="/admin" element={<ProtectedLayout roles={['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal']}><AdminPage /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
