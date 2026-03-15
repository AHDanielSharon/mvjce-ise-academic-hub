import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ title: '', subject: '', deadline: '', section: 'ISE 4A' });

  const load = () => api.get('/assignments').then((res) => setList(res.data));
  useEffect(() => { load(); }, []);

  const createAssignment = async (e) => {
    e.preventDefault();
    await api.post('/assignments', form);
    setForm({ title: '', subject: '', deadline: '', section: 'ISE 4A' });
    load();
  };

  const submit = async (id) => {
    await api.post(`/assignments/${id}/submit`, { fileUrl: 'https://example.com/submission-link' });
    load();
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Assignment Manager</h1>
      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <form onSubmit={createAssignment} className="card mb-4 grid gap-2 md:grid-cols-4">
          <input required className="rounded-xl border p-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input required className="rounded-xl border p-2" placeholder="Subject ID" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <input required type="date" className="rounded-xl border p-2" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          <button className="rounded-xl bg-brand-500 text-white">Create</button>
        </form>
      )}
      <div className="space-y-3">
        {list.map((a) => (
          <div className="card" key={a._id}>
            <p className="font-semibold">{a.title}</p>
            <p className="text-sm text-slate-500">Deadline: {new Date(a.deadline).toLocaleString()}</p>
            {user?.role === 'student' && <button type="button" className="mt-2 rounded-xl bg-slate-900 px-3 py-1 text-white dark:bg-slate-100 dark:text-slate-900" onClick={() => submit(a._id)}>Submit</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
