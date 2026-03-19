import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Megaphone, Plus, Users, User, Globe, Clock, X } from 'lucide-react';

const posterRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];

function AnnouncementCard({ item, index }) {
  const audienceConfig = {
    all: { label: 'All Sections', icon: Globe, color: '#6366f1' },
    'ISE 4A': { label: 'ISE 4A', icon: Users, color: '#10b981' },
    'ISE 4B': { label: 'ISE 4B', icon: Users, color: '#f59e0b' },
  };
  const aud = audienceConfig[item.audience] || audienceConfig.all;
  const timeAgo = item.createdAt
    ? (() => {
        const diff = Date.now() - new Date(item.createdAt);
        const hrs = Math.floor(diff / 3600000);
        if (hrs < 1) return 'Just now';
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
      })()
    : '';

  return (
    <div className="card card-hover animate-slide-up" style={{ animationDelay: `${index * 40}ms` }}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(217,70,239,0.1))' }}>
          <Megaphone size={18} style={{ color: '#6366f1' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-snug" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              {item.title}
            </h3>
            <div className="flex flex-shrink-0 items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Clock size={11} /> {timeAgo}
            </div>
          </div>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.content}</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="badge" style={{ background: aud.color + '15', color: aud.color }}>
              <aud.icon size={10} /> {aud.label}
            </span>
            {item.postedBy?.name && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <User size={10} /> {item.postedBy.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', audience: 'all' });
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const canPost = posterRoles.includes(user?.role);

  const load = () => api.get('/announcements').then(res => { setItems(res.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const createAnnouncement = async (e) => {
    e.preventDefault();
    await api.post('/announcements', form);
    setForm({ title: '', content: '', audience: 'all' });
    setShowForm(false);
    setStatus('✓ Announcement posted successfully.');
    setTimeout(() => setStatus(''), 4000);
    load();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(217,70,239,0.12)' }}>
            <Megaphone size={18} style={{ color: '#d946ef' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Announcements</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{items.length} announcements</p>
          </div>
        </div>
        {canPost && (
          <button onClick={() => setShowForm(s => !s)} className="btn btn-primary btn-sm">
            <Plus size={14} /> Post
          </button>
        )}
      </div>

      {/* Status */}
      {status && (
        <div className="animate-slide-up rounded-xl px-4 py-3 text-sm flex items-center gap-2"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>
          {status}
        </div>
      )}

      {/* Form */}
      {showForm && canPost && (
        <form onSubmit={createAnnouncement} className="card space-y-4 animate-slide-up border-2"
          style={{ borderColor: 'rgba(217,70,239,0.25)' }}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>New Announcement</h2>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost btn-icon">
              <X size={16} />
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Title</label>
              <input required placeholder="Announcement title" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Audience</label>
              <select value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}>
                <option value="all">All Sections</option>
                <option value="ISE 4A">ISE 4A Only</option>
                <option value="ISE 4B">ISE 4B Only</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Content</label>
            <textarea required rows={4} placeholder="Write your announcement here…"
              value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              style={{ resize: 'vertical' }} />
          </div>
          <button type="submit" className="btn btn-primary">
            <Megaphone size={14} /> Post Announcement
          </button>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24" />)}</div>
      ) : items.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <Megaphone size={40} strokeWidth={1} className="mb-3 opacity-30" />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No announcements yet</p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Check back soon for updates from faculty</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => <AnnouncementCard key={item._id} item={item} index={i} />)}
        </div>
      )}
    </div>
  );
}
