import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const canEditRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];

export default function TimetablePage() {
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState('ISE 4A');
  const [weekly, setWeekly] = useState([]);
  const [today, setToday] = useState(null);
  const [editorDay, setEditorDay] = useState('Monday');
  const [entriesJson, setEntriesJson] = useState('[]');
  const [status, setStatus] = useState('');

  const canEdit = canEditRoles.includes(user?.role);

  useEffect(() => {
    if (!user) return;
    setSelectedSection(user.role === 'student' ? user.section : 'ISE 4A');
  }, [user]);

  const load = () => {
    if (!selectedSection) return;
    api.get(`/timetable/${selectedSection}`).then((res) => setWeekly(res.data));
    api.get(`/timetable/today/${selectedSection}`).then((res) => setToday(res.data));
  };

  useEffect(() => {
    load();
  }, [selectedSection]);

  const byDay = useMemo(() => Object.fromEntries(weekly.map((d) => [d.day, d.entries])), [weekly]);

  useEffect(() => {
    setEntriesJson(JSON.stringify(byDay[editorDay] || [], null, 2));
  }, [byDay, editorDay]);

  const saveDay = async () => {
    setStatus('');
    const parsed = JSON.parse(entriesJson);
    await api.put(`/timetable/${selectedSection}/${editorDay}`, { entries: parsed });
    setStatus(`Updated ${selectedSection} • ${editorDay} timetable.`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Smart Timetable • {selectedSection}</h1>
        <select
          className="rounded-xl border p-2"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          disabled={user?.role === 'student'}
        >
          <option>ISE 4A</option>
          <option>ISE 4B</option>
        </select>
      </div>

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

      <section className="card overflow-auto">
        <h2 className="mb-2 font-semibold">Weekly Grid View</h2>
        <div className="grid min-w-[920px] grid-cols-5 gap-3">
          {days.map((day) => (
            <div key={day}>
              <h3 className="mb-2 rounded-lg bg-slate-100 px-2 py-1 text-sm font-semibold dark:bg-slate-800">{day}</h3>
              <div className="space-y-2">
                {(byDay[day] || []).map((entry, idx) => (
                  <div key={`${entry.startTime}-${idx}`} className="rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700">
                    <p className="font-semibold">{entry.subject}</p>
                    <p>{entry.startTime} - {entry.endTime}</p>
                    {entry.roomNumber && <p>{entry.roomNumber}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {canEdit && (
        <section className="card">
          <h2 className="mb-2 font-semibold">Teacher/Management Timetable Editor</h2>
          <div className="mb-2 flex flex-wrap gap-2">
            <select className="rounded-xl border p-2" value={editorDay} onChange={(e) => setEditorDay(e.target.value)}>
              {days.map((day) => <option key={day}>{day}</option>)}
            </select>
            <button type="button" onClick={saveDay} className="rounded-xl bg-brand-500 px-4 py-2 text-white">Save Day Timetable</button>
          </div>
          <textarea className="min-h-[220px] w-full rounded-xl border p-2 font-mono text-xs" value={entriesJson} onChange={(e) => setEntriesJson(e.target.value)} />
          {status && <p className="mt-2 text-sm text-green-600">{status}</p>}
        </section>
      )}
    </div>
  );
}
