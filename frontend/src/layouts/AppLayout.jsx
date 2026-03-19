import {
  Bell, BookOpen, LayoutDashboard, LogOut, Moon, Search, Sun, Users,
  CalendarDays, MessageSquare, BellRing, GraduationCap, ClipboardList,
  FolderOpen, FlaskConical, BarChart3, Megaphone, Settings, X, Menu,
  Sparkles, UserCheck, ListOrdered, Building2
} from 'lucide-react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import InstallButton from '../components/InstallButton';
import api from '../api/client';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { to: '/timetable', label: 'Class Timetable', icon: CalendarDays },
      { to: '/notifications', label: 'Notifications', icon: BellRing },
    ]
  },
  {
    label: 'Academics',
    items: [
      { to: '/subjects', label: 'Subjects', icon: BookOpen },
      { to: '/assignments', label: 'Assignments', icon: ClipboardList },
      { to: '/attendance', label: 'Attendance', icon: UserCheck },
      { to: '/marks', label: 'Exam Results', icon: BarChart3, staffLabel: 'Results Management' },
      { to: '/resources', label: 'Resource Library', icon: FolderOpen },
    ]
  },
  {
    label: 'ISE 4A Community',
    items: [
      { to: '/students', label: 'Class Roll List', icon: ListOrdered },
      { to: '/faculty', label: 'Faculty Directory', icon: GraduationCap },
      { to: '/forum', label: 'Doubt Forum', icon: MessageSquare },
      { to: '/announcements', label: 'Announcements', icon: Megaphone },
      { to: '/search', label: 'Smart Search', icon: Search },
    ]
  },
];

const ADMIN_NAV = [
  { to: '/people', label: 'People Directory', icon: Users, roles: ['department_admin','hod','admin','principal'] },
  { to: '/admin', label: 'Academic Controls', icon: Settings, roles: ['teacher','lab_instructor','department_admin','hod','admin','principal'] },
  { to: '/adalab', label: 'ADA Lab', icon: FlaskConical, roles: ['teacher','lab_instructor','department_admin','hod','admin','principal'] },
];

function NavItem({ item, user, onClick }) {
  const label = item.staffLabel && user?.role !== 'student' ? item.staffLabel : item.label;
  return (
    <NavLink to={item.to} end={item.exact} onClick={onClick}
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
      <item.icon size={15} strokeWidth={1.75} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('ise-dark') === '1');
  const [toast, setToast] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const seenIds = useRef(new Set());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('ise-dark', darkMode ? '1' : '0');
  }, [darkMode]);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!user) return;
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission().catch(() => null);
    const poll = async () => {
      try {
        const res = await api.get('/notifications');
        const items = res.data || [];
        const newest = items[0];
        if (!newest || seenIds.current.has(newest._id)) { setUnreadCount(items.filter(n => !seenIds.current.has(n._id)).length); return; }
        seenIds.current.add(newest._id);
        setUnreadCount(prev => prev + 1);
        setToast({ title: newest.title, message: newest.message });
        setTimeout(() => setToast(null), 5000);
        if ('Notification' in window && Notification.permission === 'granted') new Notification(newest.title, { body: newest.message });
      } catch { /* silent */ }
    };
    poll();
    const timer = setInterval(poll, 15000);
    return () => clearInterval(timer);
  }, [user]);

  const adminItems = ADMIN_NAV.filter(item => item.roles.includes(user?.role));

  const ROLE_BADGE = {
    student: 'badge-brand', teacher: 'badge-success', lab_instructor: 'badge-success',
    hod: 'badge-warning', department_admin: 'badge-warning', admin: 'badge-danger', principal: 'badge-danger',
  };
  const roleColor = ROLE_BADGE[user?.role] || 'badge-muted';
  const roleLabel = user?.role === 'hod' ? 'HOD' : user?.role?.replace('_',' ');

  function SidebarContent() {
    return (
      <div className="flex h-full flex-col">
        {/* User block */}
        <div className="mb-4 rounded-xl p-3" style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(217,70,239,0.08))' }}>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-base font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#6366f1,#d946ef)', fontFamily: 'Space Grotesk' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{user?.name}</p>
              <span className={`badge ${roleColor} mt-0.5`} style={{ fontSize: 10 }}>{roleLabel}</span>
            </div>
          </div>
          {user?.usn && <p className="rounded-lg px-2 py-1 text-xs font-mono" style={{ background: 'rgba(0,0,0,0.06)', color: 'var(--text-secondary)' }}>USN: {user.usn}</p>}
          {user?.designation && !user?.usn && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{user.designation}</p>}
          <div className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Building2 size={10} className="inline mr-1" />ISE 4A · MVJ College · Sem 4 (2026)
          </div>
        </div>

        <nav className="flex-1 space-y-3.5 overflow-y-auto pr-1">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(item => <NavItem key={item.to} item={item} user={user} onClick={() => setSidebarOpen(false)} />)}
              </div>
            </div>
          ))}
          {adminItems.length > 0 && (
            <div>
              <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Staff Controls</p>
              <div className="space-y-0.5">
                {adminItems.map(item => <NavItem key={item.to} item={item} user={user} onClick={() => setSidebarOpen(false)} />)}
              </div>
            </div>
          )}
        </nav>

        <div className="mt-4 space-y-0.5 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => setDarkMode(s => !s)} className="nav-link w-full">
            {darkMode ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
            <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <button onClick={() => { logout(); navigate('/login'); }}
            className="nav-link w-full" style={{ color: 'var(--danger)' }}>
            <LogOut size={15} strokeWidth={1.75} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-subtle)' }}>
      {/* Toast */}
      {toast && (
        <div className="animate-slide-in-right fixed right-4 top-4 z-50 max-w-sm rounded-2xl p-4 shadow-2xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg gradient-brand">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{toast.title}</p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="btn-icon btn-ghost flex-shrink-0"><X size={14} /></button>
          </div>
        </div>
      )}

      {/* Mobile header */}
      <header className="sticky top-0 z-40 border-b md:hidden"
        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderColor: 'var(--border)' }}>
        <div className="dark:bg-slate-900/90 flex h-13 items-center justify-between px-4 py-2.5">
          <button onClick={() => setSidebarOpen(true)} className="btn-icon btn-ghost"><Menu size={20} /></button>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg gradient-brand">
              <GraduationCap size={13} className="text-white" />
            </div>
            <span className="font-bold text-gradient text-sm" style={{ fontFamily: 'Space Grotesk' }}>ISE Nexus</span>
          </div>
          <NavLink to="/notifications" className="btn-icon btn-ghost relative">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-white text-[10px]"
                style={{ background: 'var(--danger)' }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </NavLink>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 p-4 overflow-y-auto" style={{ background: 'var(--surface)' }}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-brand">
                  <GraduationCap size={14} className="text-white" />
                </div>
                <span className="font-bold text-gradient text-sm" style={{ fontFamily: 'Space Grotesk' }}>ISE Nexus</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="btn-icon btn-ghost"><X size={18} /></button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1400px] gap-5 p-4 md:grid-cols-[268px_1fr] md:p-6">
        {/* Desktop sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-6 card" style={{ minHeight: 'calc(100vh - 3rem)' }}>
            <div className="mb-5 flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl gradient-brand shadow-lg">
                <GraduationCap size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gradient truncate" style={{ fontFamily: 'Space Grotesk', fontSize: '0.95rem' }}>ISE Nexus</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>MVJCE · ISE 4A · 2026</p>
              </div>
              <div className="flex items-center gap-1">
                <NavLink to="/notifications" className="btn-icon btn-ghost relative">
                  <Bell size={15} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-white"
                      style={{ background: 'var(--danger)', fontSize: 9 }}>{unreadCount}</span>
                  )}
                </NavLink>
                <InstallButton />
              </div>
            </div>
            <SidebarContent />
          </div>
        </aside>

        <main className="min-w-0 space-y-4 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
