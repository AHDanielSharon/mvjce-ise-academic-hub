import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get(`/timetable/today/${user.section}`).then((res) => setTimetable(res.data));
    api.get('/assignments').then((res) => setAssignments(res.data.slice(0, 5))).catch(() => setAssignments([]));
    api.get('/announcements').then((res) => setAnnouncements(res.data.slice(0, 5))).catch(() => setAnnouncements([]));
  }, [user]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <section className="card md:col-span-2">
          <h2 className="mb-2 font-semibold">Today's Classes ({timetable?.day || '-'})</h2>
          {timetable?.holiday ? <p>Odd Saturday Holiday 🎉</p> : timetable?.entries?.map((entry) => (
            <div key={`${entry.startTime}-${entry.subject}`} className={`mb-2 rounded-xl border p-2 ${timetable?.currentClass?.startTime === entry.startTime ? 'border-brand-500 bg-blue-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700'}`}>
              <p className="font-medium">{entry.subject}</p>
              <p className="text-sm text-slate-500">{entry.startTime} - {entry.endTime}</p>
            </div>
          ))}
          {timetable?.nextClass && <p className="mt-2 text-sm text-brand-600">Next: {timetable.nextClass.subject} at {timetable.nextClass.startTime}</p>}
        </section>
        <section className="card">
          <h2 className="mb-2 font-semibold">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>📚 Notes Library</li><li>🧪 ADA Lab Repository</li><li>📝 Assignment Manager</li><li>🔔 Announcement Board</li>
          </ul>
        </section>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="card">
          <h2 className="mb-2 font-semibold">Upcoming Assignments</h2>
          {assignments.map((item) => <p key={item._id} className="mb-2 text-sm">{item.title} • {new Date(item.deadline).toLocaleDateString()}</p>)}
        </section>
        <section className="card">
          <h2 className="mb-2 font-semibold">New Announcements</h2>
          {announcements.map((item) => <p key={item._id} className="mb-2 text-sm">{item.title}</p>)}
        </section>
      </div>
    </div>
  );
}
