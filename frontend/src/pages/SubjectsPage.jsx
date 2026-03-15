import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    api.get('/subjects').then((res) => setSubjects(res.data));
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Subjects</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {subjects.map((subject) => (
          <Link key={subject._id} to={`/subjects/${subject._id}`} className="card transition hover:-translate-y-1">
            <h2 className="font-semibold">{subject.name}</h2>
            <p className="text-sm text-slate-500">Faculty: {subject.facultyName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
