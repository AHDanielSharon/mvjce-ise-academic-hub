import { useEffect, useState } from 'react';
import api from '../api/client';

const defaultEntry = {
  subject: 'New Subject',
  subjectCode: '',
  faculty: '',
  roomNumber: '',
  startTime: '08:00',
  endTime: '08:50',
  type: 'class'
};

export default function AdminPage() {
  const [saturdayFollowDay, setSaturdayFollowDay] = useState('Friday');
  const [section, setSection] = useState('ISE 4A');
  const [day, setDay] = useState('Monday');
  const [entriesJson, setEntriesJson] = useState('[]');
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/timetable/settings/saturday/value').then((res) => setSaturdayFollowDay(res.data.saturdayFollowDay));
  }, []);

  const loadDay = async () => {
    const { data } = await api.get(`/timetable/${section}`);
    const found = data.find((d) => d.day === day);
    setEntriesJson(JSON.stringify(found?.entries || [defaultEntry], null, 2));
  };

  useEffect(() => {
    loadDay();
  }, [section, day]);

  const saveSaturdayRule = async () => {
    await api.put('/timetable/settings/saturday', { saturdayFollowDay });
    setStatus('Saturday rule updated successfully.');
  };

  const saveDayTimetable = async () => {
    const parsed = JSON.parse(entriesJson);
    await api.put(`/timetable/${section}/${day}`, { entries: parsed });
    setStatus(`${section} ${day} timetable updated successfully.`);
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
      </section>

      <section className="card">
        <h2 className="mb-2 font-semibold">Timetable Management</h2>
        <div className="mb-2 flex flex-wrap gap-2">
          <select className="rounded-xl border p-2" value={section} onChange={(e) => setSection(e.target.value)}>
            <option>ISE 4A</option><option>ISE 4B</option>
          </select>
          <select className="rounded-xl border p-2" value={day} onChange={(e) => setDay(e.target.value)}>
            <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option>
          </select>
          <button type="button" className="rounded-xl border px-3 py-2" onClick={loadDay}>Reload</button>
        </div>
        <p className="mb-2 text-xs text-slate-500">Edit entries JSON array (subject, startTime, endTime, roomNumber, faculty, type).</p>
        <textarea className="min-h-[260px] w-full rounded-xl border p-2 font-mono text-xs" value={entriesJson} onChange={(e) => setEntriesJson(e.target.value)} />
        <button type="button" className="mt-2 rounded-xl bg-brand-500 px-4 py-2 text-white" onClick={saveDayTimetable}>Save Day Timetable</button>
      </section>

      {status && <p className="text-sm text-green-600">{status}</p>}
    </div>
  );
}
