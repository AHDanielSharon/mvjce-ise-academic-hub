import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { UserCheck, CheckCircle2, XCircle, Calendar, ChevronDown, Save, TrendingUp, AlertTriangle } from 'lucide-react';

const staffRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];
const SUBJECTS = [
  'Analysis & Design of Algorithms',
  'Advanced Java',
  'Database Management Systems',
  'Discrete Mathematical Structures',
  'Biology for Engineers',
  'Universal Human Values',
  'AEC Vertical Level II'
];

function AttendanceBadge({ pct }) {
  if (pct >= 75) return <span className="badge badge-success">{pct}%</span>;
  if (pct >= 65) return <span className="badge badge-warning">{pct}%</span>;
  return <span className="badge badge-danger">{pct}%</span>;
}

function AttendanceRing({ pct, size = 80 }) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 75 ? '#10b981' : pct >= 65 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth="8" stroke="var(--surface-muted)" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth="8" stroke={color}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', transition: 'stroke-dasharray 1s ease' }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: size * 0.18, fill: color }}>
        {pct}%
      </text>
    </svg>
  );
}

export default function AttendancePage() {
  const { user } = useAuth();
  const isStaff = staffRoles.includes(user?.role);
  const [section, setSection] = useState('ISE 4A');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [roster, setRoster] = useState([]);
  const [entries, setEntries] = useState([]);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({ overall: { present: 0, total: 0, percentage: 0 }, subjects: [] });
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isStaff) {
      api.get('/attendance/mine').then(res => setSummary(res.data));
      return;
    }
    api.get(`/attendance/roster/${section}`).then(res => {
      setRoster(res.data || []);
      setEntries((res.data || []).map(s => ({ studentUsn: s.usn, studentName: s.name, present: true })));
    });
    api.get(`/attendance/section/${section}`, { params: { subject } }).then(res => setHistory(res.data || []));
  }, [isStaff, section, subject]);

  const togglePresent = (usn) => {
    setEntries(prev => prev.map(e => e.studentUsn === usn ? { ...e, present: !e.present } : e));
  };

  const markAll = (val) => setEntries(prev => prev.map(e => ({ ...e, present: val })));

  const submitAttendance = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/attendance/mark', { section, subject, date, entries });
      const { data } = await api.get(`/attendance/section/${section}`, { params: { subject } });
      setHistory(data || []);
      setStatus(`✓ Attendance saved — ${section} · ${subject} · ${date}`);
      setTimeout(() => setStatus(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  const presentCount = entries.filter(e => e.present).length;
  const totalCount = entries.length;

  const filteredEntries = useMemo(() =>
    entries.filter(e => e.studentName.toLowerCase().includes(search.toLowerCase()) || e.studentUsn.includes(search)),
    [entries, search]
  );

  // Student View
  if (!isStaff) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <UserCheck size={18} style={{ color: '#6366f1' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>My Attendance</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Track your presence and percentage</p>
          </div>
        </div>

        {/* Overall Card */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-200">Overall Attendance</p>
              <p className="text-5xl font-bold text-white mt-1" style={{ fontFamily: 'Space Grotesk' }}>
                {summary.overall.percentage}%
              </p>
              <p className="text-indigo-200 text-sm mt-2">
                {summary.overall.present} present out of {summary.overall.total} classes
              </p>
              {summary.overall.percentage < 75 && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-xs text-white">
                  <AlertTriangle size={12} className="text-yellow-300" />
                  Below 75% threshold — attend more classes!
                </div>
              )}
            </div>
            <AttendanceRing pct={summary.overall.percentage} size={100} />
          </div>
        </div>

        {/* Subject-wise */}
        <div className="card">
          <h2 className="mb-3 font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Subject-wise Breakdown</h2>
          <div className="space-y-3">
            {summary.subjects.map(s => (
              <div key={s.subject}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{s.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.present}/{s.total}</span>
                    <AttendanceBadge pct={s.percentage} />
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{
                    width: `${s.percentage}%`,
                    background: s.percentage >= 75 ? '#10b981' : s.percentage >= 65 ? '#f59e0b' : '#ef4444'
                  }} />
                </div>
              </div>
            ))}
            {summary.subjects.length === 0 && (
              <p className="text-center py-4 text-sm" style={{ color: 'var(--text-muted)' }}>No attendance data yet</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Staff View
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
          <UserCheck size={18} style={{ color: '#6366f1' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Attendance Management</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Mark and track daily attendance</p>
        </div>
      </div>

      <form onSubmit={submitAttendance} className="space-y-4">
        {/* Controls */}
        <div className="card">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Section</label>
              <select value={section} onChange={e => setSection(e.target.value)}>
                <option>ISE 4A</option>
                <option>ISE 4B</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>✓ Backdated entry allowed for past dates since semester start</p>
        </div>

        {/* Roster */}
        <div className="card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Student Roster</h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                <span className="font-medium" style={{ color: '#10b981' }}>{presentCount}</span>
                <span> present · </span>
                <span className="font-medium" style={{ color: '#ef4444' }}>{totalCount - presentCount}</span>
                <span> absent · {totalCount} total</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: 200 }} />
              <button type="button" onClick={() => markAll(true)} className="btn btn-secondary btn-sm">
                All Present
              </button>
              <button type="button" onClick={() => markAll(false)} className="btn btn-secondary btn-sm">
                All Absent
              </button>
            </div>
          </div>

          {/* Progress summary bar */}
          <div className="mb-4">
            <div className="progress-bar h-2">
              <div className="progress-bar-fill" style={{ width: totalCount > 0 ? `${(presentCount / totalCount) * 100}%` : '0%' }} />
            </div>
          </div>

          <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
            {filteredEntries.map((entry) => (
              <label key={entry.studentUsn}
                className="flex cursor-pointer items-center justify-between rounded-xl p-3 transition-colors"
                style={{
                  background: entry.present ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)',
                  border: `1.5px solid ${entry.present ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)'}`,
                }}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white`}
                    style={{ background: entry.present ? '#10b981' : '#ef4444' }}>
                    {entry.studentName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{entry.studentName}</p>
                    <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{entry.studentUsn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.present
                    ? <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                    : <XCircle size={20} style={{ color: '#ef4444' }} />
                  }
                  <input type="checkbox" checked={entry.present}
                    onChange={() => togglePresent(entry.studentUsn)}
                    className="h-4 w-4 accent-indigo-500"
                    style={{ width: 'auto', background: 'transparent' }} />
                </div>
              </label>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving…
                </span>
              ) : (
                <><Save size={16} /> Save Attendance</>
              )}
            </button>
            {status && <p className="text-sm" style={{ color: '#10b981' }}>{status}</p>}
          </div>
        </div>
      </form>

      {/* History */}
      {history.length > 0 && (
        <div className="card">
          <div className="mb-3 flex items-center gap-2">
            <Calendar size={16} style={{ color: '#6366f1' }} />
            <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Recent Records — {subject}</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Total</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 10).map(row => {
                const present = (row.entries || []).filter(e => e.present).length;
                const total = (row.entries || []).length;
                const pct = total > 0 ? Math.round((present / total) * 100) : 0;
                return (
                  <tr key={row._id}>
                    <td style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>{row.date}</td>
                    <td style={{ color: '#10b981', fontWeight: 600 }}>{present}</td>
                    <td style={{ color: '#ef4444', fontWeight: 600 }}>{total - present}</td>
                    <td>{total}</td>
                    <td><AttendanceBadge pct={pct} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
