import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const staffRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];

export default function AttendancePage() {
  const { user } = useAuth();
  const isStaff = staffRoles.includes(user?.role);
  const [section, setSection] = useState('ISE 4A');
  const [subject, setSubject] = useState('Analysis & Design of Algorithms');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [roster, setRoster] = useState([]);
  const [entries, setEntries] = useState([]);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({ overall: { present: 0, total: 0, percentage: 0 }, subjects: [] });
  const [status, setStatus] = useState('');

  const subjects = useMemo(() => [
    'Analysis & Design of Algorithms',
    'Advanced Java',
    'Database Management Systems',
    'Discrete Mathematical Structures',
    'Biology for Engineers',
    'Universal Human Values',
    'AEC Vertical Level II'
  ], []);

  useEffect(() => {
    if (!isStaff) {
      api.get('/attendance/mine').then((res) => setSummary(res.data));
      return;
    }
    api.get(`/attendance/roster/${section}`).then((res) => {
      setRoster(res.data || []);
      setEntries((res.data || []).map((s) => ({ studentUsn: s.usn, studentName: s.name, present: true })));
    });
    api.get(`/attendance/section/${section}`, { params: { subject } }).then((res) => setHistory(res.data || []));
  }, [isStaff, section, subject]);

  const togglePresent = (usn) => {
    setEntries((prev) => prev.map((e) => (e.studentUsn === usn ? { ...e, present: !e.present } : e)));
  };

  const submitAttendance = async (e) => {
    e.preventDefault();
    await api.post('/attendance/mark', { section, subject, date, entries });
    setStatus(`Attendance saved for ${section} • ${subject} • ${date}`);
    const { data } = await api.get(`/attendance/section/${section}`, { params: { subject } });
    setHistory(data || []);
  };

  if (!isStaff) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <div className="card">
          <p className="text-sm text-slate-500">Overall Attendance</p>
          <p className="text-3xl font-bold">{summary.overall.percentage}%</p>
          <p className="text-sm">Present {summary.overall.present} / {summary.overall.total}</p>
        </div>
        <div className="space-y-2">
          {summary.subjects.map((s) => (
            <div key={s.subject} className="card flex items-center justify-between">
              <p>{s.subject}</p>
              <p className="font-semibold">{s.percentage}%</p>
            </div>
          ))}
          {summary.subjects.length === 0 && <p className="text-sm text-slate-500">No attendance entered yet.</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Attendance Management</h1>
      <form onSubmit={submitAttendance} className="card space-y-3">
        <div className="grid gap-2 md:grid-cols-3">
          <select className="rounded-xl border p-2" value={section} onChange={(e) => setSection(e.target.value)}>
            <option>ISE 4A</option>
            <option>ISE 4B</option>
          </select>
          <select className="rounded-xl border p-2" value={subject} onChange={(e) => setSubject(e.target.value)}>
            {subjects.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input type="date" className="rounded-xl border p-2" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <p className="text-xs text-slate-500">Backdated entry is allowed (for past days since semester started).</p>
        <div className="max-h-[420px] space-y-2 overflow-auto">
          {entries.map((entry) => (
            <label key={entry.studentUsn} className="card flex cursor-pointer items-center justify-between">
              <div>
                <p className="font-semibold">{entry.studentName}</p>
                <p className="text-xs text-slate-500">{entry.studentUsn}</p>
              </div>
              <input type="checkbox" checked={entry.present} onChange={() => togglePresent(entry.studentUsn)} />
            </label>
          ))}
        </div>
        <button className="rounded-xl bg-brand-500 px-4 py-2 text-white">Save Daily Attendance</button>
        {status && <p className="text-sm text-green-600">{status}</p>}
      </form>

      <section className="card">
        <h2 className="mb-2 font-semibold">Recent Records ({subject})</h2>
        <div className="space-y-2">
          {history.slice(0, 8).map((row) => {
            const presentCount = (row.entries || []).filter((e) => e.present).length;
            const total = (row.entries || []).length;
            return <p key={row._id} className="text-sm">{row.date}: {presentCount}/{total} present</p>;
          })}
          {history.length === 0 && <p className="text-sm text-slate-500">No records yet.</p>}
        </div>
      </section>
    </div>
  );
}
