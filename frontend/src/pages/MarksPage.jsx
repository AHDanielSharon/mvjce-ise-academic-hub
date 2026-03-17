import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const staffRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];

export default function MarksPage() {
  const { user } = useAuth();
  const isStaff = staffRoles.includes(user?.role);
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ student: '', subject: '', ia1: 0, ia2: 0, ia3: 0, sem: 0, published: false });

  const load = async () => {
    if (isStaff) {
      const [marksRes, usersRes, subjectsRes] = await Promise.all([api.get('/marks'), api.get('/users'), api.get('/subjects')]);
      setMarks(marksRes.data);
      setStudents(usersRes.data.grouped?.students || []);
      setSubjects(subjectsRes.data || []);
      const firstStudent = usersRes.data.grouped?.students?.[0]?._id || '';
      const firstSubject = subjectsRes.data?.[0]?._id || '';
      setForm((prev) => ({ ...prev, student: prev.student || firstStudent, subject: prev.subject || firstSubject }));
      return;
    }
    const res = await api.get('/marks/mine');
    setMarks(res.data);
  };

  useEffect(() => { load(); }, [isStaff]);

  const publishResult = async (e) => {
    e.preventDefault();
    const selectedStudent = students.find((s) => s._id === form.student);
    const payload = { ...form, studentName: selectedStudent?.name, studentSection: selectedStudent?.section };
    await api.post('/marks', payload);
    setStatus(form.published ? 'Result published to student notifications.' : 'Result saved as draft (hidden from students).');
    load();
  };

  const graphData = useMemo(() => marks.map((m) => ({ subject: m.subject?.name || 'Subject', total: m.total })), [marks]);

  if (!isStaff) {
    if (marks.length === 0) {
      return (
        <div className="card">
          <h1 className="mb-2 text-2xl font-bold">Exam Results</h1>
          <p className="text-sm text-slate-500">No exam results published yet. Internal 1/2/3 and Semester results will appear after faculty publishes them.</p>
        </div>
      );
    }

    return (
      <div>
        <h1 className="mb-4 text-2xl font-bold">Exam Results</h1>
        <div className="card mb-4 h-72">
          <ResponsiveContainer>
            <BarChart data={graphData}><XAxis dataKey="subject" hide /><YAxis /><Tooltip /><Bar dataKey="total" fill="#2563eb" /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {marks.map((m) => <div className="card" key={m._id}>{m.subject?.name} - IA1: {m.ia1}, IA2: {m.ia2}, IA3: {m.ia3}, Semester: {m.sem}, Total: {m.total}</div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Results Management</h1>
      <form onSubmit={publishResult} className="card grid gap-2 md:grid-cols-2">
        <select required className="rounded-xl border p-2" value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}>
          {students.map((s) => <option key={s._id} value={s._id}>{s.name} • {s.section}</option>)}
        </select>
        <select required className="rounded-xl border p-2" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
          {subjects.map((s) => <option key={s._id} value={s._id}>{s.code} • {s.name}</option>)}
        </select>
        <input type="number" min="0" className="rounded-xl border p-2" placeholder="Internal 1" value={form.ia1} onChange={(e) => setForm({ ...form, ia1: Number(e.target.value) })} />
        <input type="number" min="0" className="rounded-xl border p-2" placeholder="Internal 2" value={form.ia2} onChange={(e) => setForm({ ...form, ia2: Number(e.target.value) })} />
        <input type="number" min="0" className="rounded-xl border p-2" placeholder="Internal 3" value={form.ia3} onChange={(e) => setForm({ ...form, ia3: Number(e.target.value) })} />
        <input type="number" min="0" className="rounded-xl border p-2" placeholder="Final Semester" value={form.sem} onChange={(e) => setForm({ ...form, sem: Number(e.target.value) })} />
        <label className="md:col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publish to student now</label>
        <button className="rounded-xl bg-brand-500 px-4 py-2 text-white md:col-span-2">Save Result</button>
      </form>
      {status && <p className="text-sm text-green-600">{status}</p>}
      <div className="space-y-2">
        {marks.map((m) => <div className="card" key={m._id}>{m.student?.name} • {m.subject?.name} — IA1: {m.ia1}, IA2: {m.ia2}, IA3: {m.ia3}, Sem: {m.sem}, Published: {m.published ? 'Yes' : 'No'}</div>)}
      </div>
    </div>
  );
}
