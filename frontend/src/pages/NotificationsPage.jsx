import { useEffect, useState } from 'react';
import api from '../api/client';

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/notifications').then((res) => setItems(res.data)); }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Notification Center</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div className="card" key={item._id}>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm">{item.message}</p>
            <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
