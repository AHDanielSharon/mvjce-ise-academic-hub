import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { BellRing, Plus, X, Trash2, Info, CheckCircle2, AlertTriangle, Megaphone } from 'lucide-react';

const posterRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];

const TYPE_CONFIG = {
  info: { icon: Info, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  success: { icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  announcement: { icon: Megaphone, color: '#d946ef', bg: 'rgba(217,70,239,0.1)' },
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info', audience: 'all' });
  const [status, setStatus] = useState('');

  const canPost = posterRoles.includes(user?.role);

  const load = () => api.get('/notifications').then(res => { setItems(res.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const createNotification = async (e) => {
    e.preventDefault();
    await api.post('/notifications', form);
    setForm({ title: '', message: '', type: 'info', audience: 'all' });
    setShowForm(false);
    setStatus('✓ Notification sent.');
    setTimeout(() => setStatus(''), 3000);
    load();
  };

  const deleteNotification = async (id) => {
    await api.delete(`/notifications/${id}`);
    load();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <BellRing size={18} style={{ color: '#6366f1' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Notifications</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{items.length} notifications</p>
          </div>
        </div>
        {canPost && (
          <button onClick={() => setShowForm(s => !s)} className="btn btn-primary btn-sm">
            <Plus size={14} /> Send
          </button>
        )}
      </div>

      {status && (
        <div className="rounded-xl px-4 py-3 text-sm"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>
          {status}
        </div>
      )}

      {showForm && canPost && (
        <form onSubmit={createNotification} className="card space-y-4 animate-slide-up border-2"
          style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Send Notification</h2>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost btn-icon"><X size={16} /></button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Title</label>
              <input required placeholder="Notification title" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Audience</label>
              <select value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}>
                <option value="all">All</option>
                <option value="ISE 4A">ISE 4A</option>
                <option value="ISE 4B">ISE 4B</option>
                <option value="faculty">Faculty Only</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Message</label>
              <textarea required rows={3} placeholder="Notification message…"
                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            <BellRing size={14} /> Send Notification
          </button>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20" />)}</div>
      ) : items.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <BellRing size={40} strokeWidth={1} className="mb-3 opacity-30" />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>You're all caught up!</p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.info;
            const Icon = cfg.icon;
            return (
              <div key={item._id} className="card card-hover flex items-start gap-3 animate-slide-up"
                style={{ animationDelay: `${i * 30}ms` }}>
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background: cfg.bg }}>
                  <Icon size={16} style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                      {item.title}
                    </p>
                    <div className="flex flex-shrink-0 items-center gap-1">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {item.createdAt ? timeAgo(item.createdAt) : ''}
                      </span>
                      {canPost && (
                        <button onClick={() => deleteNotification(item._id)} className="btn btn-ghost btn-icon" style={{ padding: '2px' }}>
                          <Trash2 size={13} style={{ color: 'var(--text-muted)' }} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{item.message}</p>
                  {item.audience && item.audience !== 'all' && (
                    <span className="mt-2 badge badge-muted inline-block">{item.audience}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
