import { useState } from 'react';
import api from '../api/client';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);

  const runSearch = async () => {
    const { data } = await api.get(`/search?q=${encodeURIComponent(q)}`);
    setResults(data);
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Smart Search</h1>
      <div className="card mb-4 flex gap-2">
        <input className="flex-1 rounded-xl border p-2" placeholder="Search subjects, notes, assignments, faculty" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" onClick={runSearch} className="rounded-xl bg-brand-500 px-4 text-white">Search</button>
      </div>
      {results && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card"><h2 className="font-semibold">Subjects</h2>{results.subjects.map((r) => <p key={r._id}>{r.name}</p>)}</div>
          <div className="card"><h2 className="font-semibold">Assignments</h2>{results.assignments.map((r) => <p key={r._id}>{r.title}</p>)}</div>
          <div className="card"><h2 className="font-semibold">Notes</h2>{results.notes.map((r) => <p key={r._id}>{r.title}</p>)}</div>
          <div className="card"><h2 className="font-semibold">Faculty</h2>{results.faculty.map((r, i) => <p key={`${r._id}-${i}`}>{r.facultyName} ({r.name})</p>)}</div>
        </div>
      )}
    </div>
  );
}
