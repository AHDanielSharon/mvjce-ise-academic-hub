import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

const sections = ['notes', 'ppt', 'question-paper', 'assignment', 'link', 'lab-program'];

export default function SubjectDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    api.get(`/subjects/${id}/dashboard`).then((res) => setData(res.data));
  }, [id]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Subject Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((type) => (
          <section key={type} className="card">
            <h2 className="mb-2 font-semibold capitalize">{type.replace('-', ' ')}</h2>
            {(data[type] || []).map((item) => (
              <a key={item._id} href={item.fileUrl || item.linkUrl} className="mb-1 block text-sm text-brand-600" target="_blank" rel="noreferrer">{item.title}</a>
            ))}
            {!data[type]?.length && <p className="text-sm text-slate-500">No items yet.</p>}
          </section>
        ))}
      </div>
    </div>
  );
}
