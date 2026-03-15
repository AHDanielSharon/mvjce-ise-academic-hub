import { useEffect, useState } from 'react';
import api from '../api/client';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get('/resources').then((res) => setResources(res.data));
  }, []);

  const filtered = resources.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Notes Library</h1>
      <input className="card mb-4 w-full border p-2" placeholder="Search notes" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="space-y-2">
        {filtered.map((item) => (
          <div className="card" key={item._id}>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-slate-500">{item.type}</p>
            <a className="text-brand-600" href={item.fileUrl || item.linkUrl} target="_blank" rel="noreferrer">Preview / Download</a>
          </div>
        ))}
      </div>
    </div>
  );
}
