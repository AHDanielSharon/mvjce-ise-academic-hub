import { useEffect, useState } from 'react';
import api from '../api/client';

export default function AnnouncementsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get('/announcements').then((res) => setItems(res.data));
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Announcement Board</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="card">
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
