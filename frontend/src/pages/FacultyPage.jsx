import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function FacultyPage() {
  const { user } = useAuth();
  const [section, setSection] = useState('ISE 4A');
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    if (!user) return;
    setSection(user.role === 'student' ? user.section : 'ISE 4A');
  }, [user]);

  useEffect(() => {
    api.get('/faculty', { params: { section } }).then((res) => setFaculty(res.data));
  }, [section]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Faculty Information • {section}</h1>
        <select className="rounded-xl border p-2" value={section} onChange={(e) => setSection(e.target.value)} disabled={user?.role === 'student'}>
          <option>ISE 4A</option>
          <option>ISE 4B</option>
        </select>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {faculty.map((item) => (
          <div className="card" key={item._id}>
            <p className="font-semibold">{item.facultyName}</p>
            <p className="text-sm text-slate-500">{item.designation} • {item.department}</p>
            <p className="text-sm">Class: {item.section}</p>
            {item.isClassCoordinator && <p className="text-sm font-semibold text-brand-600">Class Coordinator</p>}
            {Array.isArray(item.subjects) && item.subjects.length > 0 && <p className="text-sm">Subjects: {item.subjects.join(', ')}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
