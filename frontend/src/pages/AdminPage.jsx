import { useEffect, useState } from 'react';
import api from '../api/client';

const emptyEntry = { subject: '', startTime: '08:00', endTime: '08:50', roomNumber: '', faculty: '', type: 'class' };

export default function AdminPage() {
  const [saturdayFollowDay, setSaturdayFollowDay] = useState('Friday');
  const [section, setSection] = useState('ISE 4A');
  const [day, setDay] = useState('Monday');
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/timetable/settings/saturday/value').then((res) => setSaturdayFollowDay(res.data.saturdayFollowDay));
  }, []);

  const loadDay = async () => {
    const { data } = await api.get(`/timetable/${section}`);
    const found = data.find((d) => d.day === day);
    setEntries(found?.entries || [{ ...emptyEntry }]);
  };

  useEffect(() => {
    loadDay();
  }, [section, day]);

  const saveSaturdayRule = async () => {
    await api.put('/timetable/settings/saturday', { saturdayFollowDay });
    setStatus('Saturday rule updated successfully.');
  };

  const saveDayTimetable = async () => {
    await api.put(`/timetable/${section}/${day}`, { entries });
    setStatus(`${section} ${day} timetable updated successfully.`);
  };

  const updateEntry = (index, key, value) => {
    setEntries((prev) => prev.map((entry, i) => (i === index ? { ...entry, [key]: value } : entry)));
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
        <h2 className="mb-2 font-semibold">Timetable Management (Form Based)</h2>
        <div className="mb-2 flex flex-wrap gap-2">
          <select className="rounded-xl border p-2" value={section} onChange={(e) => setSection(e.target.value)}>
            <option>ISE 4A</option><option>ISE 4B</option>
          </select>
          <select className="rounded-xl border p-2" value={day} onChange={(e) => setDay(e.target.value)}>
            <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option>
          </select>
          <button type="button" className="rounded-xl border px-3 py-2" onClick={() => setEntries((prev) => [...prev, { ...emptyEntry }])}>Add Row</button>
          <button type="button" className="rounded-xl border px-3 py-2" onClick={loadDay}>Reload</button>
        </div>
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div key={`${index}-${entry.startTime}`} className="grid gap-2 rounded-xl border p-2 md:grid-cols-6">
              <input className="rounded border p-2" placeholder="Subject" value={entry.subject || ''} onChange={(e) => updateEntry(index, 'subject', e.target.value)} />
              <input className="rounded border p-2" placeholder="Faculty" value={entry.faculty || ''} onChange={(e) => updateEntry(index, 'faculty', e.target.value)} />
              <input className="rounded border p-2" placeholder="Room" value={entry.roomNumber || ''} onChange={(e) => updateEntry(index, 'roomNumber', e.target.value)} />
              <input type="time" className="rounded border p-2" value={entry.startTime || '08:00'} onChange={(e) => updateEntry(index, 'startTime', e.target.value)} />
              <input type="time" className="rounded border p-2" value={entry.endTime || '08:50'} onChange={(e) => updateEntry(index, 'endTime', e.target.value)} />
              <button type="button" className="rounded border px-3 py-2" onClick={() => setEntries((prev) => prev.filter((_, i) => i !== index))}>Remove</button>
            </div>
          ))}
        </div>
        <button type="button" className="mt-2 rounded-xl bg-brand-500 px-4 py-2 text-white" onClick={saveDayTimetable}>Save Day Timetable</button>
      </section>

      {status && <p className="text-sm text-green-600">{status}</p>}
    </div>
  );
}
