import { useEffect, useState } from 'react';
import api from '../api/client';

export default function AdaLabPage() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    api.get('/resources').then((res) => {
      setPrograms(res.data.filter((r) => r.type === 'lab-program'));
    });
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">ADA Lab Repository</h1>
      <div className="space-y-3">
        {programs.map((p) => (
          <div key={p._id} className="card">
            <p className="font-semibold">{p.title}</p>
            <p className="mb-2 text-sm text-slate-500">{p.description}</p>
            <pre className="overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-green-300">
{`// Syntax highlighted preview\n${p.description || 'Add code solution and input/output examples here.'}`}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
