import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function SubjectsPage() {
  const { user } = useAuth();
  const [section, setSection] = useState('ISE 4A');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (!user) return;
    setSection(user.role === 'student' ? user.section : 'ISE 4A');
  }, [user]);

  useEffect(() => {
    api.get('/subjects', { params: { section } }).then((res) => setSubjects(res.data));
  }, [section]);

  const title = useMemo(() => `Subjects • ${section}`, [section]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <select className="rounded-xl border p-2" value={section} onChange={(e) => setSection(e.target.value)} disabled={user?.role === 'student'}>
          <option>ISE 4A</option>
          <option>ISE 4B</option>
        </select>
      </div>
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
