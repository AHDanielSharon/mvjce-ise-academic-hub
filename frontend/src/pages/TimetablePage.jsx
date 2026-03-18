import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const canEditRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];

const emptyEntry = { subject: '', startTime: '08:00', endTime: '08:50', roomNumber: '', faculty: '', type: 'class' };

export default function TimetablePage() {
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState('ISE 4A');
  const [weekly, setWeekly] = useState([]);
  const [today, setToday] = useState(null);
  const [editorDay, setEditorDay] = useState('Monday');
  const [editableEntries, setEditableEntries] = useState([]);
  const [status, setStatus] = useState('');
  const [timetableImage, setTimetableImage] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const canEdit = canEditRoles.includes(user?.role);

  useEffect(() => {
    if (!user) return;
    setSelectedSection(user.role === 'student' ? user.section : 'ISE 4A');
  }, [user]);

  const load = () => {
    if (!selectedSection) return;
    api.get(`/timetable/${selectedSection}`).then((res) => setWeekly(res.data));
    api.get(`/timetable/today/${selectedSection}`).then((res) => setToday(res.data));
    api.get(`/timetable/image/${selectedSection}`).then((res) => setTimetableImage(res.data.imageUrl || ''));
  };

  useEffect(() => {
    load();
  }, [selectedSection]);

  const byDay = useMemo(() => Object.fromEntries(weekly.map((d) => [d.day, d.entries])), [weekly]);

  useEffect(() => {
    setEditableEntries((byDay[editorDay] || []).map((entry) => ({ ...entry })));
  }, [byDay, editorDay]);

  const updateEntry = (index, key, value) => {
    setEditableEntries((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const addRow = () => setEditableEntries((prev) => [...prev, { ...emptyEntry }]);
  const deleteRow = (index) => setEditableEntries((prev) => prev.filter((_, i) => i !== index));

  const saveDay = async () => {
    setStatus('');
    await api.put(`/timetable/${selectedSection}/${editorDay}`, { entries: editableEntries });
    setStatus(`Updated ${selectedSection} • ${editorDay} timetable.`);
    load();
  };

  const saveImage = async () => {
    if (!imageFile) return;
    const payload = new FormData();
    payload.append('file', imageFile);
    const { data } = await api.put(`/timetable/image/${selectedSection}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
    setTimetableImage(data.imageUrl || '');
    setImageFile(null);
    setStatus(`Uploaded timetable image for ${selectedSection}.`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Smart Timetable • {selectedSection}</h1>
        <select className="rounded-xl border p-2" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} disabled={user?.role === 'student'}>
          <option>ISE 4A</option><option>ISE 4B</option>
        </select>
      </div>

      {timetableImage && (
        <section className="card">
          <h2 className="mb-2 font-semibold">Uploaded Timetable</h2>
          <img src={timetableImage} alt={`Timetable ${selectedSection}`} className="max-h-[420px] rounded-xl border" />
        </section>
      )}

      <section className="card">
        <h2 className="mb-2 font-semibold">Today's View ({today?.day || '-'})</h2>
        {today?.holiday ? <p>Odd Saturday is configured as holiday.</p> : (
          <div className="grid gap-2 md:grid-cols-2">
            {(today?.entries || []).map((entry) => (
              <div key={`${entry.startTime}-${entry.subject}`} className={`rounded-xl border p-3 ${today?.currentClass?.startTime === entry.startTime ? 'border-brand-500 bg-blue-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700'}`}>
                <p className="font-semibold">{entry.subject}</p>
                <p className="text-xs text-slate-500">{entry.startTime} - {entry.endTime}</p>
                {entry.faculty && <p className="text-xs">{entry.faculty} • {entry.roomNumber}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {canEdit && (
        <section className="card space-y-2">
          <h2 className="font-semibold">Teacher Timetable Update (No Coding)</h2>
          <div className="flex flex-wrap gap-2">
            <select className="rounded-xl border p-2" value={editorDay} onChange={(e) => setEditorDay(e.target.value)}>
              {days.map((day) => <option key={day}>{day}</option>)}
            </select>
            <button type="button" onClick={addRow} className="rounded-xl border px-3 py-2">Add Row</button>
            <button type="button" onClick={saveDay} className="rounded-xl bg-brand-500 px-4 py-2 text-white">Save Day Timetable</button>
          </div>
          <div className="space-y-2">
            {editableEntries.map((entry, index) => (
              <div key={`${index}-${entry.startTime}`} className="grid gap-2 rounded-xl border p-2 md:grid-cols-6">
                <input className="rounded border p-2" placeholder="Subject" value={entry.subject || ''} onChange={(e) => updateEntry(index, 'subject', e.target.value)} />
                <input className="rounded border p-2" placeholder="Faculty" value={entry.faculty || ''} onChange={(e) => updateEntry(index, 'faculty', e.target.value)} />
                <input className="rounded border p-2" placeholder="Room" value={entry.roomNumber || ''} onChange={(e) => updateEntry(index, 'roomNumber', e.target.value)} />
                <input type="time" className="rounded border p-2" value={entry.startTime || '08:00'} onChange={(e) => updateEntry(index, 'startTime', e.target.value)} />
                <input type="time" className="rounded border p-2" value={entry.endTime || '08:50'} onChange={(e) => updateEntry(index, 'endTime', e.target.value)} />
                <button type="button" className="rounded border px-3 py-2" onClick={() => deleteRow(index)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="grid gap-2 md:grid-cols-[1fr_auto]">
            <input type="file" accept="image/*" className="rounded-xl border p-2" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            <button type="button" onClick={saveImage} className="rounded-xl bg-brand-500 px-4 py-2 text-white">Upload Timetable Image</button>
          </div>
          {status && <p className="mt-2 text-sm text-green-600">{status}</p>}
        </section>
      )}
    </div>
  );
}
