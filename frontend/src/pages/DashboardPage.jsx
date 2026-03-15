import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState(null);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    if (!user) return;
    api.get(`/timetable/today/${user.section}`).then((res) => setTimetable(res.data));
    api.get('/dashboard/overview').then((res) => setOverview(res.data));
  }, [user]);

  const isStudent = overview?.role === 'student';
  const isTeacher = ['teacher', 'lab_instructor'].includes(overview?.role);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Intelligent Personal Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <section className="card md:col-span-2">
          <h2 className="mb-2 font-semibold">Today's timetable ({timetable?.day || '-'})</h2>
          {timetable?.holiday ? <p>Odd Saturday Holiday</p> : timetable?.entries?.map((entry) => (
            <div key={`${entry.startTime}-${entry.subject}`} className={`mb-2 rounded-xl border p-2 ${timetable?.currentClass?.startTime === entry.startTime ? 'border-brand-500 bg-blue-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700'}`}>
              <p className="font-medium">{entry.subject}</p>
              <p className="text-sm text-slate-500">{entry.startTime} - {entry.endTime} {entry.roomNumber ? `• ${entry.roomNumber}` : ''}</p>
            </div>
          ))}
          {timetable?.nextClass && <p className="mt-2 text-sm text-brand-600">Next class: {timetable.nextClass.subject} ({timetable.nextClass.startTime})</p>}
        </section>
        <section className="card">
          <h2 className="mb-2 font-semibold">Recent notifications</h2>
          {(overview?.notifications || []).slice(0, 4).map((item) => <p key={item._id} className="mb-2 text-sm">• {item.title}</p>)}
        </section>
      </div>

      {isStudent && (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="card">
            <h2 className="mb-2 font-semibold">Upcoming assignments</h2>
            {(overview?.assignments || []).map((a) => <p key={a._id} className="text-sm">{a.title} • {new Date(a.deadline).toLocaleDateString()}</p>)}
          </section>
          <section className="card">
            <h2 className="mb-2 font-semibold">Performance summary</h2>
            {(overview?.marks || []).map((m) => <p key={m._id} className="text-sm">{m.subject?.name}: Total {m.total}</p>)}
          </section>
        </div>
      )}

      {isTeacher && (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="card">
            <h2 className="mb-2 font-semibold">Assignments for review</h2>
            {(overview?.pendingSubmissions || []).map((s) => <p key={s._id} className="text-sm">{s.student?.name} submitted {s.assignment?.title}</p>)}
          </section>
          <section className="card">
            <h2 className="mb-2 font-semibold">Your recent assignments</h2>
            {(overview?.assignments || []).map((a) => <p key={a._id} className="text-sm">{a.title}</p>)}
          </section>
        </div>
      )}

      {!isStudent && !isTeacher && (
        <section className="card">
          <h2 className="mb-2 font-semibold">Department Analytics Snapshot</h2>
          <div className="grid gap-3 md:grid-cols-5 text-sm">
            <div>Students: {overview?.analytics?.studentCount || 0}</div>
            <div>Faculty: {overview?.analytics?.teacherCount || 0}</div>
            <div>Assignments: {overview?.analytics?.assignmentStats || 0}</div>
            <div>Subjects: {overview?.analytics?.subjectCount || 0}</div>
            <div>Resources: {overview?.analytics?.resourceCount || 0}</div>
          </div>
        </section>
      )}
    </div>
  );
}
