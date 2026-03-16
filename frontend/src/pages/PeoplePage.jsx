import { useEffect, useState } from 'react';
import api from '../api/client';

function UserList({ title, users }) {
  return (
    <section className="card">
      <h2 className="mb-2 text-lg font-semibold">{title} ({users.length})</h2>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u._id} className="rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-700">
            <p className="font-semibold">{u.name}</p>
            <p>{u.email}</p>
            <p className="text-xs text-slate-500">{u.role.replace('_', ' ')} • {u.section} {u.designation ? `• ${u.designation}` : ''}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PeoplePage() {
  const [data, setData] = useState({ grouped: { students: [], teachers: [], management: [] } });

  useEffect(() => {
    api.get('/users').then((res) => setData(res.data));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">People & Roles Directory</h1>
      <p className="text-sm text-slate-500">Use this to verify who is student, teacher/lab, and management in the system.</p>
      <div className="grid gap-4 md:grid-cols-3">
        <UserList title="Students" users={data.grouped.students} />
        <UserList title="Teachers & Lab Instructors" users={data.grouped.teachers} />
        <UserList title="Management" users={data.grouped.management} />
      </div>
    </div>
  );
}
