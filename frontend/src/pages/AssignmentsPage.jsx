import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const creatorRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ title: '', subject: '', deadline: '', section: 'ISE 4A', description: '' });

  const canCreate = creatorRoles.includes(user?.role);

  const load = () => api.get('/assignments').then((res) => setList(res.data));

  useEffect(() => {
    load();
    if (canCreate) {
      api.get('/subjects').then((res) => {
        setSubjects(res.data);
        if (!form.subject && res.data[0]?._id) {
          setForm((prev) => ({ ...prev, subject: res.data[0]._id }));
        }
      });
    }
  }, [canCreate]);

  const subjectNameById = useMemo(() => {
    const map = new Map();
    subjects.forEach((s) => map.set(s._id, `${s.code} • ${s.name}`));
    return map;
  }, [subjects]);

  const createAssignment = async (e) => {
    e.preventDefault();
    setStatus('');
    await api.post('/assignments', form);
    setForm({ title: '', subject: subjects[0]?._id || '', deadline: '', section: 'ISE 4A', description: '' });
    setStatus('Assignment created successfully.');
    load();
  };

  const submitAssignment = async (id) => {
    await api.post(`/assignments/${id}/submit`, { fileUrl: 'https://example.com/submission-link' });
    setStatus('Submission uploaded successfully.');
    load();
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Assignment Manager</h1>
      {status && <p className="mb-3 text-sm text-green-600">{status}</p>}
      {canCreate && (
        <form onSubmit={createAssignment} className="card mb-4 grid gap-2 md:grid-cols-2">
          <input required className="rounded-xl border p-2" placeholder="Assignment title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select required className="rounded-xl border p-2" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.code} • {s.name}</option>)}
          </select>
          <input required type="datetime-local" className="rounded-xl border p-2" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          <select className="rounded-xl border p-2" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
            <option>ISE 4A</option>
            <option>ISE 4B</option>
          </select>
          <textarea className="rounded-xl border p-2 md:col-span-2" placeholder="Instructions / description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="rounded-xl bg-brand-500 px-4 py-2 text-white md:col-span-2">Create Assignment</button>
        </form>
      )}
      <div className="space-y-3">
        {list.map((a) => (
          <div className="card" key={a._id}>
            <p className="font-semibold">{a.title}</p>
            <p className="text-xs text-slate-500">{a.subject?.name || subjectNameById.get(a.subject) || 'Subject'} • {a.section}</p>
            <p className="text-sm text-slate-500">Deadline: {new Date(a.deadline).toLocaleString()}</p>
            {a.description && <p className="mt-2 text-sm">{a.description}</p>}
            {user?.role === 'student' && (
              <button type="button" className="mt-2 rounded-xl bg-slate-900 px-3 py-1 text-white dark:bg-slate-100 dark:text-slate-900" onClick={() => submitAssignment(a._id)}>
                Submit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
