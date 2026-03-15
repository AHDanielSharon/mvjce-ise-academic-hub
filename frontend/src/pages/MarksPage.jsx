import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../api/client';

export default function MarksPage() {
  const [marks, setMarks] = useState([]);
  useEffect(() => {
    api.get('/marks/mine').then((res) => setMarks(res.data));
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Internal Marks Tracker</h1>
      <div className="card mb-4 h-72">
        <ResponsiveContainer>
          <BarChart data={marks.map((m) => ({ subject: m.subject?.name || 'Subject', total: m.total }))}>
            <XAxis dataKey="subject" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2">
        {marks.map((m) => <div className="card" key={m._id}>{m.subject?.name} - T1: {m.test1}, T2: {m.test2}, Assignments: {m.assignments}, Total: {m.total}</div>)}
      </div>
    </div>
  );
}
