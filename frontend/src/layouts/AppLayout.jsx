import { Bell, BookOpen, LayoutDashboard, LogOut, Moon, Search, Sun, Users, CalendarDays, MessageSquare, BellRing } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import InstallButton from '../components/InstallButton';

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('ise-dark') === '1');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('ise-dark', darkMode ? '1' : '0');
  }, [darkMode]);

  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/timetable', label: 'Smart Timetable', icon: CalendarDays },
    { to: '/subjects', label: 'Subject Hub', icon: BookOpen },
    { to: '/assignments', label: 'Assignments', icon: BookOpen },
    { to: '/resources', label: 'Resource Library', icon: BookOpen },
    { to: '/faculty', label: 'Faculty Directory', icon: Users },
    { to: '/forum', label: 'Doubt Forum', icon: MessageSquare },
    { to: '/notifications', label: 'Notifications', icon: BellRing },
    { to: '/announcements', label: 'Announcements', icon: Bell },
    { to: '/search', label: 'Smart Search', icon: Search },
    ...(['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'].includes(user?.role) ? [{ to: '/people', label: 'People Directory', icon: Users }] : [])
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <Link to="/" className="text-lg font-bold text-brand-600">ISE Nexus • MVJCE</Link>
          <div className="flex items-center gap-2">
            <InstallButton />
            <button type="button" onClick={() => setDarkMode((s) => !s)} className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-sm text-white dark:bg-slate-100 dark:text-slate-900"
              >
                <LogOut size={14} /> Logout
              </button>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 p-4 md:grid-cols-[260px_1fr]">
        <aside className="card h-fit">
          <p className="text-xs uppercase tracking-wide text-slate-500">Signed in as</p>
          <p className="mb-4 text-sm font-semibold">{user?.name} ({user?.role?.replace('_', ' ')})</p>
          <nav className="space-y-1">
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-brand-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <item.icon size={16} /> {item.label}
              </NavLink>
            ))}
            {(user?.role === 'teacher' || user?.role === 'lab_instructor' || user?.role === 'department_admin' || user?.role === 'hod' || user?.role === 'admin' || user?.role === 'principal') && (
              <NavLink to="/admin" className="flex rounded-xl px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">Academic Controls</NavLink>
            )}
            {user?.role === 'student' && <NavLink to="/marks" className="flex rounded-xl px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">Performance Tracker</NavLink>}
          </nav>
        </aside>
        <main className="space-y-4">{children}</main>
      </div>
    </div>
  );
}
