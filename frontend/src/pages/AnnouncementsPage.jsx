import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const posterRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', audience: 'all' });
  const [status, setStatus] = useState('');

  const canPost = posterRoles.includes(user?.role);

  const load = () => api.get('/announcements').then((res) => setItems(res.data));

  useEffect(() => {
    load();
  }, []);

  const createAnnouncement = async (e) => {
    e.preventDefault();
    setStatus('');
    await api.post('/announcements', form);
    setForm({ title: '', content: '', audience: 'all' });
    setStatus('Announcement posted successfully.');
    load();
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Announcement Board</h1>
      {canPost && (
        <form onSubmit={createAnnouncement} className="card mb-4 grid gap-2 md:grid-cols-2">
          <input required className="rounded-xl border p-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select className="rounded-xl border p-2" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
            <option value="all">All sections</option>
            <option value="ISE 4A">ISE 4A</option>
            <option value="ISE 4B">ISE 4B</option>
          </select>
          <textarea required className="rounded-xl border p-2 md:col-span-2" placeholder="Announcement content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <button className="rounded-xl bg-brand-500 px-4 py-2 text-white md:col-span-2">Post Announcement</button>
        </form>
      )}
      {status && <p className="mb-3 text-sm text-green-600">{status}</p>}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="card">
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm">{item.content}</p>
            <p className="text-xs text-slate-500">Audience: {item.audience || 'all'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
