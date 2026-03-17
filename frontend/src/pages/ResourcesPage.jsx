import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const uploaderRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];

export default function ResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ title: '', type: 'notes', subject: '', description: '', content: '', file: null });

  const canUpload = uploaderRoles.includes(user?.role);

  const load = () => api.get('/resources').then((res) => setResources(res.data));

  useEffect(() => {
    load();
    api.get('/subjects').then((res) => {
      setSubjects(res.data);
      if (res.data[0]?._id) {
        setForm((prev) => ({ ...prev, subject: prev.subject || res.data[0]._id }));
      }
    });
  }, []);

  const filtered = useMemo(() => resources
    .filter((r) => r.fileUrl || r.content || r.linkUrl)
    .filter((r) => {
      const haystack = `${r.title} ${r.description || ''} ${r.subject?.name || ''}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    }), [resources, query]);

  const createResource = async (e) => {
    e.preventDefault();
    setStatus('');

    const payload = new FormData();
    payload.append('title', form.title);
    payload.append('type', form.type);
    payload.append('subject', form.subject);
    payload.append('description', form.description);
    payload.append('content', form.content);
    if (form.file) payload.append('file', form.file);

    await api.post('/resources', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
    setStatus('Resource uploaded successfully.');
    setForm({ title: '', type: 'notes', subject: subjects[0]?._id || '', description: '', content: '', file: null });
    load();
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Notes Library</h1>
      {canUpload && (
        <form onSubmit={createResource} className="card mb-4 grid gap-2 md:grid-cols-2">
          <input required className="rounded-xl border p-2" placeholder="Resource title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select className="rounded-xl border p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="notes">Notes</option>
            <option value="ppt">PPT</option>
            <option value="question-paper">Previous Year Question Paper</option>
            <option value="assignment">Assignment</option>
            <option value="lab-program">Lab Program</option>
          </select>
          <select required className="rounded-xl border p-2" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.code} • {s.name}</option>)}
          </select>
          <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png" className="rounded-xl border p-2" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} />
          <textarea className="rounded-xl border p-2 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <textarea className="rounded-xl border p-2 md:col-span-2" placeholder="Paste notes text here (optional)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <button className="rounded-xl bg-brand-500 px-4 py-2 text-white md:col-span-2">Upload Resource</button>
        </form>
      )}
      {status && <p className="mb-4 text-sm text-green-600">{status}</p>}
      <input className="card mb-4 w-full border p-2" placeholder="Search notes/resources" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="space-y-2">
        {filtered.map((item) => (
          <div className="card" key={item._id}>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-slate-500">{item.type} • {item.subject?.name}</p>
            {item.description && <p className="text-sm">{item.description}</p>}
            {item.content && <p className="text-sm whitespace-pre-wrap">{item.content}</p>}
            {(item.fileUrl || item.linkUrl) && <a className="text-brand-600" href={item.fileUrl || item.linkUrl} target="_blank" rel="noreferrer">Preview / Download</a>}
          </div>
        ))}
      </div>
    </div>
  );
}
