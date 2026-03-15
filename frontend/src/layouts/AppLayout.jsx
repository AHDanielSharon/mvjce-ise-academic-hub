import { Bell, BookOpen, LayoutDashboard, LogOut, Moon, Search, Sun } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/assignments', label: 'Assignments', icon: BookOpen },
  { to: '/resources', label: 'Notes Library', icon: BookOpen },
  { to: '/adalab', label: 'ADA Lab', icon: BookOpen },
  { to: '/faculty', label: 'Faculty', icon: BookOpen },
  { to: '/announcements', label: 'Announcements', icon: Bell },
  { to: '/search', label: 'Search', icon: Search }
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="text-lg font-bold text-brand-600">MVJCE ISE Academic Hub</Link>
          <div className="flex items-center gap-2">
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
      <div className="mx-auto grid max-w-7xl gap-6 p-4 md:grid-cols-[220px_1fr]">
        <aside className="card h-fit">
          <p className="mb-4 text-sm text-slate-500">{user?.name} ({user?.role})</p>
          <nav className="space-y-1">
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-brand-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <item.icon size={16} /> {item.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && <NavLink to="/admin" className="flex rounded-xl px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">Admin Panel</NavLink>}
            {user?.role === 'student' && <NavLink to="/marks" className="flex rounded-xl px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">Internal Marks</NavLink>}
          </nav>
        </aside>
        <main className="space-y-4">{children}</main>
      </div>
    </div>
  );
}
