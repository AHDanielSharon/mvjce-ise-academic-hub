import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  FolderOpen, Upload, Search, FileText, Video, Presentation, HelpCircle,
  Link2, FlaskConical, ExternalLink, Download, Filter, X, Plus
} from 'lucide-react';

const uploaderRoles = ['teacher', 'lab_instructor', 'department_admin', 'hod', 'admin', 'principal'];

const TYPE_CONFIG = {
  notes: { label: 'Notes', icon: FileText, color: '#6366f1' },
  video: { label: 'Video', icon: Video, color: '#ef4444' },
  ppt: { label: 'PPT', icon: Presentation, color: '#f59e0b' },
  'question-paper': { label: 'Question Paper', icon: HelpCircle, color: '#10b981' },
  assignment: { label: 'Assignment', icon: FileText, color: '#d946ef' },
  link: { label: 'Important Link', icon: Link2, color: '#06b6d4' },
  'lab-program': { label: 'Lab Program', icon: FlaskConical, color: '#8b5cf6' },
};

const ALL_TYPES = Object.keys(TYPE_CONFIG);

function ResourceCard({ item }) {
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.notes;
  return (
    <div className="card card-hover group">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
          style={{ background: cfg.color + '18' }}>
          <cfg.icon size={18} style={{ color: cfg.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold leading-snug truncate" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>
                {item.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="badge" style={{ background: cfg.color + '18', color: cfg.color }}>
                  {cfg.label}
                </span>
                {item.subject?.name && (
                  <span className="badge badge-muted">{item.subject.name}</span>
                )}
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1">
              {item.linkUrl && (
                <a href={item.linkUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon">
                  <ExternalLink size={15} />
                </a>
              )}
              {item.fileUrl && (
                <a href={item.fileUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon">
                  <Download size={15} />
                </a>
              )}
            </div>
          </div>
          {item.description && (
            <p className="mt-2 text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
          )}
          {item.content && (
            <div className="mt-2 max-h-24 overflow-hidden text-xs rounded-lg p-2 whitespace-pre-wrap"
              style={{ background: 'var(--surface-muted)', color: 'var(--text-secondary)' }}>
              {item.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', type: 'notes', subject: '', description: '', content: '', linkUrl: '', file: null });

  const canUpload = uploaderRoles.includes(user?.role);

  const load = () => api.get('/resources').then(res => { setResources(res.data); setLoading(false); });

  useEffect(() => {
    load();
    api.get('/subjects').then(res => {
      setSubjects(res.data);
      if (res.data[0]?._id) setForm(prev => ({ ...prev, subject: prev.subject || res.data[0]._id }));
    });
  }, []);

  const filtered = useMemo(() => resources
    .filter(r => r.fileUrl || r.content || r.linkUrl)
    .filter(r => activeType === 'all' || r.type === activeType)
    .filter(r => `${r.title} ${r.description || ''} ${r.subject?.name || ''}`.toLowerCase().includes(query.toLowerCase())),
    [resources, query, activeType]
  );

  const counts = useMemo(() => {
    const c = { all: resources.filter(r => r.fileUrl || r.content || r.linkUrl).length };
    ALL_TYPES.forEach(t => { c[t] = resources.filter(r => r.type === t && (r.fileUrl || r.content || r.linkUrl)).length; });
    return c;
  }, [resources]);

  const createResource = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v && k !== 'file') payload.append(k, v); });
    if (form.file) payload.append('file', form.file);
    await api.post('/resources', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
    setStatus('✓ Resource uploaded successfully!');
    setTimeout(() => setStatus(''), 4000);
    setForm({ title: '', type: 'notes', subject: subjects[0]?._id || '', description: '', content: '', linkUrl: '', file: null });
    setShowForm(false);
    load();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <FolderOpen size={18} style={{ color: '#6366f1' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Resource Library</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{counts.all} resources · notes, PPTs, question papers</p>
          </div>
        </div>
        {canUpload && (
          <button onClick={() => setShowForm(s => !s)} className="btn btn-primary btn-sm">
            <Plus size={14} /> Upload
          </button>
        )}
      </div>

      {/* Upload Form */}
      {showForm && canUpload && (
        <form onSubmit={createResource} className="card space-y-4 animate-slide-up border-2" style={{ borderColor: 'rgba(99,102,241,0.25)' }}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Upload Resource</h2>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost btn-icon">
              <X size={16} />
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Title</label>
              <input required placeholder="Resource title" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {ALL_TYPES.map(t => <option key={t} value={t}>{TYPE_CONFIG[t].label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Subject</label>
              <select required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.code} · {s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Reference URL (optional)</label>
              <input placeholder="https://…" value={form.linkUrl}
                onChange={e => setForm(f => ({ ...f, linkUrl: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              File Upload <span style={{ fontWeight: 400 }}>(PDF, PPT, DOCX, images)</span>
            </label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer hover:border-indigo-400"
              style={{ borderColor: 'var(--border)', background: 'var(--surface-muted)' }}
              onClick={() => document.getElementById('file-input').click()}>
              <Upload size={24} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {form.file ? form.file.name : 'Click to browse or drag & drop'}
              </p>
              <input id="file-input" type="file" className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4"
                onChange={e => setForm(f => ({ ...f, file: e.target.files?.[0] || null }))}
                style={{ width: 'auto', background: 'transparent', padding: 0, border: 'none' }} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Description</label>
            <textarea placeholder="Brief description of this resource" value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Paste Notes Text (optional)</label>
            <textarea placeholder="Paste notes content directly…" value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} style={{ resize: 'vertical' }} />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn btn-primary">
              <Upload size={14} /> Upload Resource
            </button>
            {status && <p className="text-sm" style={{ color: '#10b981' }}>{status}</p>}
          </div>
        </form>
      )}

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Search resources, subjects, descriptions…" value={query}
            onChange={e => setQuery(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveType('all')}
            className={`badge cursor-pointer transition-all ${activeType === 'all' ? 'badge-brand' : 'badge-muted'}`}>
            All ({counts.all})
          </button>
          {ALL_TYPES.map(t => counts[t] > 0 && (
            <button key={t} onClick={() => setActiveType(t)}
              className={`badge cursor-pointer transition-all`}
              style={activeType === t
                ? { background: TYPE_CONFIG[t].color + '20', color: TYPE_CONFIG[t].color }
                : { background: 'var(--surface-muted)', color: 'var(--text-muted)' }}>
              {TYPE_CONFIG[t].label} ({counts[t]})
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <FolderOpen size={40} strokeWidth={1} className="mb-3 opacity-30" />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {query || activeType !== 'all' ? 'No matching resources' : 'No resources uploaded yet'}
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            {canUpload ? 'Be the first to upload study materials' : 'Faculty will upload resources soon'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => <ResourceCard key={item._id} item={item} />)}
        </div>
      )}
    </div>
  );
}
