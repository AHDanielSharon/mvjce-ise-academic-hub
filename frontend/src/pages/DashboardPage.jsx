import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Clock, BookOpen, TrendingUp, Users, ClipboardList, CalendarDays,
  Zap, AlertCircle, CheckCircle2, ChevronRight, FileText, Bell, GraduationCap,
  BarChart3, UserCheck, Activity, Flame
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color = 'brand', delay = 0 }) {
  const colors = {
    brand: 'rgba(99,102,241,0.12)',
    success: 'rgba(16,185,129,0.12)',
    warning: 'rgba(245,158,11,0.12)',
    danger: 'rgba(239,68,68,0.12)',
    accent: 'rgba(217,70,239,0.12)',
  };
  const textColors = {
    brand: '#6366f1', success: '#10b981', warning: '#d97706', danger: '#ef4444', accent: '#d946ef',
  };
  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <p className="mt-1 text-3xl font-bold" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>{value ?? '—'}</p>
          {sub && <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: colors[color] }}>
          <Icon size={20} style={{ color: textColors[color] }} />
        </div>
      </div>
    </div>
  );
}

function TimetableSlot({ entry, isCurrent, delay }) {
  return (
    <div
      className={`animate-slide-up rounded-xl px-4 py-3 transition-all ${isCurrent ? 'border-l-4' : 'border border-l-4'}`}
      style={{
        animationDelay: `${delay}ms`,
        borderLeftColor: isCurrent ? '#6366f1' : 'transparent',
        background: isCurrent ? 'rgba(99,102,241,0.08)' : 'var(--surface-muted)',
        borderColor: isCurrent ? 'rgba(99,102,241,0.2)' : 'transparent',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{entry.subject}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {entry.startTime} – {entry.endTime}
            {entry.roomNumber ? ` · Room ${entry.roomNumber}` : ''}
            {entry.faculty ? ` · ${entry.faculty}` : ''}
          </p>
        </div>
        {isCurrent && (
          <span className="badge badge-brand animate-pulse">
            <span className="status-dot online mr-1" style={{ width: 6, height: 6 }} />
            Live
          </span>
        )}
      </div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label, color }) {
  return (
    <Link to={to}
      className="card card-hover flex flex-col items-center gap-2 p-4 text-center transition-all cursor-pointer"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: color + '20' }}>
        <Icon size={20} style={{ color }} />
      </div>
      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get(`/timetable/today/${user.section}`),
      api.get('/dashboard/overview'),
    ]).then(([ttRes, ovRes]) => {
      setTimetable(ttRes.data);
      setOverview(ovRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const isStudent = overview?.role === 'student';
  const isTeacher = ['teacher', 'lab_instructor'].includes(overview?.role);
  const isAdmin = !isStudent && !isTeacher;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dayName = now.toLocaleDateString('en-IN', { weekday: 'long' });
  const dateFmt = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-28 w-full" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24" />)}
        </div>
        <div className="skeleton h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Hero Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6"
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 40%, #7c3aed 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='white' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-200">{greeting} 👋</p>
              <h1 className="mt-1 text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                {user?.name?.split(' ')[0]}
              </h1>
              <p className="mt-1 text-sm text-indigo-200">{dayName}, {dateFmt}</p>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs text-indigo-300 uppercase tracking-wide">Section</p>
              <p className="text-xl font-bold text-white">{user?.section}</p>
              {user?.usn && <p className="text-xs text-indigo-300 mt-1">{user.usn}</p>}
            </div>
          </div>

          {/* Next class callout */}
          {timetable?.currentClass && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <Flame size={14} className="text-yellow-300" />
              <span className="font-medium">In class now:</span>
              <span>{timetable.currentClass.subject}</span>
            </div>
          )}
          {!timetable?.currentClass && timetable?.nextClass && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <Clock size={14} className="text-indigo-200" />
              <span>Next: {timetable.nextClass.subject} at {timetable.nextClass.startTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      {isStudent && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard icon={UserCheck} label="Attendance" value={`${overview?.attendancePct ?? '--'}%`} color="success" delay={0} />
          <StatCard icon={ClipboardList} label="Assignments" value={overview?.assignments?.length ?? 0} sub="pending" color="warning" delay={50} />
          <StatCard icon={BarChart3} label="Results" value={overview?.marks?.length ?? 0} sub="subjects" color="brand" delay={100} />
          <StatCard icon={Bell} label="Notifications" value={overview?.notifications?.length ?? 0} sub="unread" color="accent" delay={150} />
        </div>
      )}

      {isAdmin && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard icon={Users} label="Students" value={overview?.analytics?.studentCount ?? 0} color="brand" delay={0} />
          <StatCard icon={GraduationCap} label="Faculty" value={overview?.analytics?.teacherCount ?? 0} color="success" delay={50} />
          <StatCard icon={ClipboardList} label="Assignments" value={overview?.analytics?.assignmentStats ?? 0} color="warning" delay={100} />
          <StatCard icon={BookOpen} label="Subjects" value={overview?.analytics?.subjectCount ?? 0} color="accent" delay={150} />
          <StatCard icon={FileText} label="Resources" value={overview?.analytics?.resourceCount ?? 0} color="success" delay={200} />
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        {/* Today's Timetable */}
        <div className="card md:col-span-2 animate-slide-up-d1">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} style={{ color: '#6366f1' }} />
              <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>
                Today's Schedule
                {timetable?.day && <span className="ml-2 text-sm font-normal" style={{ color: 'var(--text-muted)' }}>({timetable.day})</span>}
              </h2>
            </div>
            <Link to="/timetable" className="flex items-center gap-1 text-xs" style={{ color: '#6366f1' }}>
              Full view <ChevronRight size={12} />
            </Link>
          </div>

          {timetable?.holiday ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 text-4xl">🎉</div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Holiday Today!</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Odd Saturday — enjoy your day off</p>
            </div>
          ) : timetable?.entries?.length > 0 ? (
            <div className="space-y-2">
              {timetable.entries.map((entry, i) => (
                <TimetableSlot
                  key={`${entry.startTime}-${i}`}
                  entry={entry}
                  isCurrent={timetable.currentClass?.startTime === entry.startTime}
                  delay={i * 40}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8" style={{ color: 'var(--text-muted)' }}>
              <CalendarDays size={32} strokeWidth={1} className="mb-2 opacity-40" />
              <p className="text-sm">No classes scheduled</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Recent Notifications */}
          <div className="card animate-slide-up-d2">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} style={{ color: '#d946ef' }} />
                <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk' }}>Notifications</h2>
              </div>
              <Link to="/notifications" className="text-xs" style={{ color: '#6366f1' }}>View all</Link>
            </div>
            <div className="space-y-2">
              {(overview?.notifications || []).slice(0, 4).map((item) => (
                <div key={item._id} className="flex items-start gap-2 text-xs py-1.5">
                  <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: '#6366f1' }} />
                  <span style={{ color: 'var(--text-secondary)' }} className="line-clamp-2">{item.title}</span>
                </div>
              ))}
              {(!overview?.notifications || overview.notifications.length === 0) && (
                <p className="text-xs py-2 text-center" style={{ color: 'var(--text-muted)' }}>All caught up ✓</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Quick Actions</p>
            <div className="grid grid-cols-3 gap-2">
              <QuickAction to="/assignments" icon={ClipboardList} label="Submit" color="#6366f1" />
              <QuickAction to="/resources" icon={FileText} label="Notes" color="#10b981" />
              <QuickAction to="/forum" icon={Activity} label="Forum" color="#d946ef" />
            </div>
          </div>
        </div>
      </div>

      {/* Student: Assignments + Marks */}
      {isStudent && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card animate-slide-up-d2">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList size={16} style={{ color: '#f59e0b' }} />
                <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk' }}>Upcoming Assignments</h2>
              </div>
              <Link to="/assignments" className="text-xs" style={{ color: '#6366f1' }}>View all</Link>
            </div>
            <div className="space-y-2">
              {(overview?.assignments || []).slice(0, 5).map((a) => {
                const deadline = new Date(a.deadline);
                const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
                const isUrgent = daysLeft <= 2;
                return (
                  <div key={a._id} className="flex items-center justify-between rounded-lg p-2.5" style={{ background: 'var(--surface-muted)' }}>
                    <div>
                      <p className="text-sm font-medium line-clamp-1" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.subject?.name}</p>
                    </div>
                    <span className={`badge ${isUrgent ? 'badge-danger' : 'badge-warning'} flex-shrink-0 ml-2`}>
                      {daysLeft > 0 ? `${daysLeft}d` : 'Due!'}
                    </span>
                  </div>
                );
              })}
              {(!overview?.assignments || overview.assignments.length === 0) && (
                <div className="flex items-center gap-2 py-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={16} className="text-green-500" /> No pending assignments
                </div>
              )}
            </div>
          </div>

          <div className="card animate-slide-up-d3">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} style={{ color: '#6366f1' }} />
                <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk' }}>Performance</h2>
              </div>
              <Link to="/marks" className="text-xs" style={{ color: '#6366f1' }}>Details</Link>
            </div>
            <div className="space-y-3">
              {(overview?.marks || []).slice(0, 5).map((m) => {
                const pct = Math.min(100, Math.round((m.total / 100) * 100));
                return (
                  <div key={m._id}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{m.subject?.name}</span>
                      <span style={{ color: '#6366f1' }}>{m.total}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {(!overview?.marks || overview.marks.length === 0) && (
                <p className="py-2 text-sm text-center" style={{ color: 'var(--text-muted)' }}>Results not yet published</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Teacher: Submissions + Assignments */}
      {isTeacher && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card animate-slide-up-d2">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle size={16} style={{ color: '#f59e0b' }} />
              <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk' }}>Pending Submissions</h2>
            </div>
            <div className="space-y-2">
              {(overview?.pendingSubmissions || []).slice(0, 5).map((s) => (
                <div key={s._id} className="flex items-center justify-between rounded-lg p-2.5" style={{ background: 'var(--surface-muted)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.student?.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.assignment?.title}</p>
                  </div>
                  <span className="badge badge-warning">Review</span>
                </div>
              ))}
              {(!overview?.pendingSubmissions || overview.pendingSubmissions.length === 0) && (
                <div className="flex items-center gap-2 py-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={16} className="text-green-500" /> No pending reviews
                </div>
              )}
            </div>
          </div>

          <div className="card animate-slide-up-d3">
            <div className="mb-3 flex items-center gap-2">
              <ClipboardList size={16} style={{ color: '#6366f1' }} />
              <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk' }}>Your Assignments</h2>
            </div>
            <div className="space-y-2">
              {(overview?.assignments || []).slice(0, 5).map((a) => (
                <div key={a._id} className="rounded-lg p-2.5" style={{ background: 'var(--surface-muted)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.section} · Due {new Date(a.deadline).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
