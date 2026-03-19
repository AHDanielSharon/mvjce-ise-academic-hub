import { useEffect, useState, useMemo } from 'react';
import api from '../api/client';
import { Users, Search, Filter } from 'lucide-react';

const ROLE_COLORS = {
  student: 'badge-brand', teacher: 'badge-success', lab_instructor: 'badge-success',
  hod: 'badge-warning', department_admin: 'badge-warning', admin: 'badge-danger', principal: 'badge-danger',
};
const AVATAR_COLORS = ['#6366f1','#d946ef','#10b981','#f59e0b','#ef4444','#06b6d4'];
const avatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

export default function PeoplePage() {
  const [users, setUsers] = useState({ all: [], grouped: {} });
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then(r => { setUsers(r.data); setLoading(false); });
  }, []);

  const all = users.all || [];
  const filtered = useMemo(() =>
    all.filter(u =>
      (roleFilter === 'all' || u.role === roleFilter) &&
      `${u.name} ${u.usn || ''} ${u.email || ''} ${u.section || ''}`.toLowerCase().includes(query.toLowerCase())
    ), [all, query, roleFilter]
  );

  const roles = [...new Set(all.map(u => u.role).filter(Boolean))];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
          <Users size={18} style={{ color: '#6366f1' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>People Directory</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{all.length} registered users</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Search by name, USN, email…" value={query}
            onChange={e => setQuery(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">All roles</option>
          {roles.map(r => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-20" />)}</div>
      ) : (
        <div className="card">
          <p className="mb-3 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{filtered.length} results</p>
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>USN / Email</th><th>Section</th><th>Role</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const color = avatarColor(u.name);
                return (
                  <tr key={u._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ background: color }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>{u.usn || u.email || '—'}</td>
                    <td>{u.section || '—'}</td>
                    <td><span className={`badge ${ROLE_COLORS[u.role] || 'badge-muted'}`}>{u.role?.replace('_',' ')}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>No users match your search</p>
          )}
        </div>
      )}
    </div>
  );
}
