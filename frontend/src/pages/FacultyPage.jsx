import { useEffect, useState } from 'react';
import api from '../api/client';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  useEffect(() => {
    api.get('/faculty').then((res) => setFaculty(res.data));
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Faculty Information</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {faculty.map((item) => (
          <div className="card" key={item._id}>
            <p className="font-semibold">{item.name}</p>
            <p>{item.facultyName}</p>
            <p className="text-sm text-slate-500">{item.designation} • {item.department}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
