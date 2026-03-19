import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { ClipboardList, Plus, Upload, Clock, CheckCircle2, AlertCircle, X, Calendar, BookOpen, Users } from 'lucide-react';

const creatorRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];

function DeadlineBadge({ deadline }) {
  const now = new Date();
  const d = new Date(deadline);
  const daysLeft = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return <span className="badge badge-muted">Overdue</span>;
  if (daysLeft === 0) return <span className="badge badge-danger">Due today!</span>;
  if (daysLeft <= 2) return <span className="badge badge-danger">{daysLeft}d left</span>;
  if (daysLeft <= 5) return <span className="badge badge-warning">{daysLeft}d left</span>;
  return <span className="badge badge-success">{daysLeft}d left</span>;
}

function AssignmentCard({ a, canCreate, user, onSubmit, index }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit(a._id, fileUrl || 'https://example.com/submission');
    setSubmitted(true);
    setShowSubmit(false);
    setSubmitting(false);
  };

  return (
    <div className="card card-hover animate-slide-up" style={{ animationDelay: `${index * 40}ms` }}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'rgba(245,158,11,0.12)' }}>
          <ClipboardList size={18} style={{ color: '#f59e0b' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                {a.title}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="badge badge-muted">
                  <BookOpen size={9} /> {a.subject?.name || 'Subject'}
                </span>
                <span className="badge badge-muted">
                  <Users size={9} /> {a.section}
                </span>
              </div>
            </div>
            <DeadlineBadge deadline={a.deadline} />
          </div>

          {a.description && (
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{a.description}</p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Calendar size={11} />
              Due: {new Date(a.deadline).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
            {user?.role === 'student' && (
              submitted ? (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: '#10b981' }}>
                  <CheckCircle2 size={14} /> Submitted
                </span>
              ) : (
                <button onClick={() => setShowSubmit(s => !s)} className="btn btn-primary btn-sm">
                  <Upload size={12} /> Submit
                </button>
              )
            )}
          </div>

          {showSubmit && user?.role === 'student' && (
            <div className="mt-3 animate-slide-up flex gap-2">
              <input placeholder="Paste your submission link (Drive, GitHub…)"
                value={fileUrl} onChange={e => setFileUrl(e.target.value)}
                style={{ flex: 1 }} />
              <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary btn-sm flex-shrink-0">
                {submitting
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  : <><CheckCircle2 size={12} /> Confirm</>
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', subject: '', deadline: '', section: 'ISE 4A', description: '' });

  const canCreate = creatorRoles.includes(user?.role);

  const load = () => api.get('/assignments').then(res => { setList(res.data); setLoading(false); });

  useEffect(() => {
    load();
    if (canCreate) {
      api.get('/subjects').then(res => {
        setSubjects(res.data);
        if (!form.subject && res.data[0]?._id) setForm(prev => ({ ...prev, subject: res.data[0]._id }));
      });
    }
  }, [canCreate]);

  const createAssignment = async (e) => {
    e.preventDefault();
    await api.post('/assignments', form);
    setForm({ title: '', subject: subjects[0]?._id || '', deadline: '', section: 'ISE 4A', description: '' });
    setShowForm(false);
    setStatus('✓ Assignment created and students notified.');
    setTimeout(() => setStatus(''), 4000);
    load();
  };

  const handleSubmit = async (id, fileUrl) => {
    await api.post(`/assignments/${id}/submit`, { fileUrl });
  };

  const now = new Date();
  const filtered = useMemo(() => list.filter(a => {
    if (filter === 'upcoming') return new Date(a.deadline) > now;
    if (filter === 'overdue') return new Date(a.deadline) < now;
    return true;
  }), [list, filter]);

  const counts = useMemo(() => ({
    all: list.length,
    upcoming: list.filter(a => new Date(a.deadline) > now).length,
    overdue: list.filter(a => new Date(a.deadline) < now).length,
  }), [list]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(245,158,11,0.12)' }}>
            <ClipboardList size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Assignments</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{counts.upcoming} upcoming · {counts.overdue} overdue</p>
          </div>
        </div>
        {canCreate && (
          <button onClick={() => setShowForm(s => !s)} className="btn btn-primary btn-sm">
            <Plus size={14} /> Create
          </button>
        )}
      </div>

      {status && (
        <div className="animate-slide-up rounded-xl px-4 py-3 text-sm"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>
          {status}
        </div>
      )}

      {/* Create Form */}
      {showForm && canCreate && (
        <form onSubmit={createAssignment} className="card space-y-4 animate-slide-up border-2"
          style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>New Assignment</h2>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost btn-icon">
              <X size={16} />
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Title</label>
              <input required placeholder="Assignment title" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Subject</label>
              <select required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.code} · {s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Section</label>
              <select value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}>
                <option>ISE 4A</option>
                <option>ISE 4B</option>
                <option value="both">Both Sections</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Deadline</label>
              <input required type="datetime-local" value={form.deadline}
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Instructions</label>
              <textarea placeholder="Describe the assignment, submission format, and any guidelines…"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3} style={{ resize: 'vertical' }} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            <ClipboardList size={14} /> Create Assignment
          </button>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {[['all', 'All'], ['upcoming', 'Upcoming'], ['overdue', 'Overdue']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`badge cursor-pointer transition-all ${
              filter === val
                ? val === 'overdue' ? 'badge-danger' : val === 'upcoming' ? 'badge-success' : 'badge-brand'
                : 'badge-muted'
            }`}>
            {label} ({counts[val]})
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <ClipboardList size={40} strokeWidth={1} className="mb-3 opacity-30" />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {filter !== 'all' ? `No ${filter} assignments` : 'No assignments yet'}
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            {canCreate ? 'Create the first assignment for your students' : 'Check back soon'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a, i) => (
            <AssignmentCard key={a._id} a={a} canCreate={canCreate} user={user} onSubmit={handleSubmit} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
