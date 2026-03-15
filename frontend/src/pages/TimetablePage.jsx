import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function TimetablePage() {
  const { user } = useAuth();
  const [weekly, setWeekly] = useState([]);
  const [today, setToday] = useState(null);

  useEffect(() => {
    if (!user) return;
    api.get(`/timetable/${user.section}`).then((res) => setWeekly(res.data));
    api.get(`/timetable/today/${user.section}`).then((res) => setToday(res.data));
  }, [user]);

  const byDay = Object.fromEntries(weekly.map((d) => [d.day, d.entries]));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Smart Timetable • {user?.section}</h1>
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
    </div>
  );
}
