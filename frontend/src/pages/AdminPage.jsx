import { useEffect, useState } from 'react';
import api from '../api/client';

export default function AdminPage() {
  const [saturdayFollowDay, setSaturdayFollowDay] = useState('Friday');
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/timetable/settings/saturday/value').then((res) => setSaturdayFollowDay(res.data.saturdayFollowDay));
  }, []);

  const saveSaturdayRule = async () => {
    await api.put('/timetable/settings/saturday', { saturdayFollowDay });
    setStatus('Saturday rule updated successfully.');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <section className="card">
        <h2 className="mb-2 font-semibold">Saturday Timetable Configuration</h2>
        <p className="mb-3 text-sm text-slate-500">Odd Saturdays are holiday. Even Saturdays follow selected weekday timetable.</p>
        <div className="flex flex-wrap items-center gap-2">
          <select className="rounded-xl border p-2" value={saturdayFollowDay} onChange={(e) => setSaturdayFollowDay(e.target.value)}>
            <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option>
          </select>
          <button type="button" className="rounded-xl bg-brand-500 px-4 py-2 text-white" onClick={saveSaturdayRule}>Save</button>
        </div>
        {status && <p className="mt-2 text-sm text-green-600">{status}</p>}
      </section>
      <section className="card">
        <h2 className="mb-2 font-semibold">Admin Controls</h2>
        <ul className="list-disc pl-5 text-sm">
          <li>Manage timetable for ISE 4A and ISE 4B.</li>
          <li>Post department-wide announcements.</li>
          <li>Supervise notes, assignments, and faculty data.</li>
        </ul>
      </section>
    </div>
  );
}
