import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Trophy, TrendingUp, CheckCircle2, Eye, EyeOff, Send, Save } from 'lucide-react';

const staffRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card rounded-xl px-3 py-2 text-sm shadow-xl">
      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function MarksPage() {
  const { user } = useAuth();
  const isStaff = staffRoles.includes(user?.role);
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ student: '', subject: '', ia1: 0, ia2: 0, ia3: 0, sem: 0, published: false });

  const load = async () => {
    setLoading(true);
    try {
      if (isStaff) {
        const [marksRes, usersRes, subjectsRes] = await Promise.all([
          api.get('/marks'), api.get('/users'), api.get('/subjects')
        ]);
        setMarks(marksRes.data);
        setStudents(usersRes.data.grouped?.students || []);
        setSubjects(subjectsRes.data || []);
        const fs = usersRes.data.grouped?.students?.[0]?._id || '';
        const fsub = subjectsRes.data?.[0]?._id || '';
        setForm(prev => ({ ...prev, student: prev.student || fs, subject: prev.subject || fsub }));
      } else {
        const res = await api.get('/marks/mine');
        setMarks(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [isStaff]);

  const publishResult = async (e) => {
    e.preventDefault();
    const sel = students.find(s => s._id === form.student);
    await api.post('/marks', { ...form, studentName: sel?.name, studentSection: sel?.section });
    setStatus(form.published ? '✓ Result published to student notifications.' : '✓ Result saved as draft.');
    setTimeout(() => setStatus(''), 4000);
    load();
  };

  // Student analytics
  const graphData = useMemo(() => marks.map(m => ({
    subject: (m.subject?.name || 'Sub').split(' ').slice(0, 2).join(' '),
    fullName: m.subject?.name || 'Subject',
    IA1: m.ia1, IA2: m.ia2, IA3: m.ia3, Sem: m.sem, Total: m.total
  })), [marks]);

  const radarData = useMemo(() => marks.map(m => ({
    subject: (m.subject?.name || '').split(' ')[0],
    score: m.total,
    fullMark: 100,
  })), [marks]);

  const bestSubject = useMemo(() => {
    if (!marks.length) return null;
    return marks.reduce((a, b) => (a.total > b.total ? a : b));
  }, [marks]);

  const avgScore = useMemo(() => {
    if (!marks.length) return 0;
    return Math.round(marks.reduce((s, m) => s + m.total, 0) / marks.length);
  }, [marks]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24" />)}
      </div>
    );
  }

  // Student View
  if (!isStaff) {
    if (marks.length === 0) {
      return (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
              <BarChart3 size={18} style={{ color: '#6366f1' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Exam Results</h1>
          </div>
          <div className="card flex flex-col items-center py-16 text-center">
            <div className="mb-4 text-5xl">📊</div>
            <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>No results yet</p>
            <p className="mt-2 max-w-sm text-sm" style={{ color: 'var(--text-muted)' }}>
              Internal assessment (IA1, IA2, IA3) and semester results will appear once faculty publishes them.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <BarChart3 size={18} style={{ color: '#6366f1' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Exam Results</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your academic performance overview</p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div className="stat-card text-center">
            <p className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk', color: '#6366f1' }}>{avgScore}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Average Total</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk', color: '#10b981' }}>{marks.length}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Subjects Published</p>
          </div>
          {bestSubject && (
            <div className="stat-card text-center col-span-2 md:col-span-1">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy size={16} style={{ color: '#f59e0b' }} />
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Best Subject</p>
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {bestSubject.subject?.name}
              </p>
              <p className="text-xs" style={{ color: '#f59e0b' }}>Score: {bestSubject.total}</p>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="card">
          <h2 className="mb-4 font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Performance Chart</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData} barGap={4}>
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="IA1" fill="#6366f1" radius={[4,4,0,0]} />
                <Bar dataKey="IA2" fill="#d946ef" radius={[4,4,0,0]} />
                <Bar dataKey="IA3" fill="#10b981" radius={[4,4,0,0]} />
                <Bar dataKey="Sem" fill="#f59e0b" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{background:'#6366f1'}} /> IA1</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{background:'#d946ef'}} /> IA2</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{background:'#10b981'}} /> IA3</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{background:'#f59e0b'}} /> Semester</span>
          </div>
        </div>

        {/* Detailed Cards */}
        <div className="space-y-3">
          {marks.map(m => (
            <div key={m._id} className="card card-hover">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                    {m.subject?.name}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.subject?.code}</p>
                </div>
                <span className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk', color: '#6366f1' }}>{m.total}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[['IA1', m.ia1, '#6366f1'], ['IA2', m.ia2, '#d946ef'], ['IA3', m.ia3, '#10b981'], ['Sem', m.sem, '#f59e0b']].map(([label, val, color]) => (
                  <div key={label} className="rounded-lg py-2" style={{ background: 'var(--surface-muted)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                    <p className="text-lg font-bold mt-0.5" style={{ fontFamily: 'Space Grotesk', color }}>{val}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 progress-bar">
                <div className="progress-bar-fill" style={{ width: `${Math.min(100, m.total)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Staff View
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
          <BarChart3 size={18} style={{ color: '#6366f1' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Results Management</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Enter and publish exam results</p>
        </div>
      </div>

      <form onSubmit={publishResult} className="card space-y-4">
        <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Enter Result</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Student</label>
            <select required value={form.student} onChange={e => setForm(f => ({ ...f, student: e.target.value }))}>
              {students.map(s => <option key={s._id} value={s._id}>{s.name} · {s.section}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Subject</label>
            <select required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.code} · {s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[['ia1', 'Internal 1', 30], ['ia2', 'Internal 2', 30], ['ia3', 'Internal 3', 30], ['sem', 'Semester', 100]].map(([key, label, max]) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(/{max})</span></label>
              <input type="number" min={0} max={max} value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: Number(e.target.value) }))} />
            </div>
          ))}
        </div>

        <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Visibility</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {form.published ? 'Student will be notified immediately' : 'Saved as draft — not visible to student'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {form.published ? 'Published' : 'Draft'}
            </span>
            <button type="button"
              onClick={() => setForm(f => ({ ...f, published: !f.published }))}
              className="relative h-6 w-11 rounded-full transition-colors"
              style={{ background: form.published ? '#6366f1' : 'var(--surface-muted)', border: '1.5px solid var(--border)' }}>
              <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                style={{ left: form.published ? 'calc(100% - 1.375rem)' : '2px' }} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn btn-primary">
            {form.published ? <><Send size={14} /> Publish Result</> : <><Save size={14} /> Save Draft</>}
          </button>
          {status && <p className="text-sm" style={{ color: '#10b981' }}>{status}</p>}
        </div>
      </form>

      {/* Results Table */}
      <div className="card">
        <h2 className="mb-3 font-semibold" style={{ fontFamily: 'Space Grotesk' }}>All Results ({marks.length})</h2>
        {marks.length === 0 ? (
          <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>No results entered yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>IA1</th>
                  <th>IA2</th>
                  <th>IA3</th>
                  <th>Sem</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {marks.map(m => (
                  <tr key={m._id}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{m.student?.name}</td>
                    <td>{m.subject?.name}</td>
                    <td>{m.ia1}</td>
                    <td>{m.ia2}</td>
                    <td>{m.ia3}</td>
                    <td>{m.sem}</td>
                    <td style={{ fontWeight: 700, color: '#6366f1' }}>{m.total}</td>
                    <td>
                      {m.published
                        ? <span className="badge badge-success"><Eye size={10} /> Published</span>
                        : <span className="badge badge-muted"><EyeOff size={10} /> Draft</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
