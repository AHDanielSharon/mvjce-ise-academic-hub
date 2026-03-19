import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { BookOpen, ChevronLeft, FileText, ClipboardList, MessageSquare, Code2, Clock, Users, ExternalLink } from 'lucide-react';

const COLOR = '#6366f1';

export default function SubjectDetailPage() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [resources, setResources] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/subjects/${id}`),
      api.get('/resources'),
      api.get('/assignments'),
    ]).then(([sRes, rRes, aRes]) => {
      setSubject(sRes.data);
      setResources((rRes.data || []).filter(r => r.subject?._id === id || r.subject === id));
      setAssignments((aRes.data || []).filter(a => a.subject?._id === id || a.subject === id));
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="space-y-4">
      <div className="skeleton h-32" />
      <div className="skeleton h-64" />
    </div>
  );

  if (!subject) return (
    <div className="card text-center py-16">
      <p style={{ color: 'var(--text-muted)' }}>Subject not found.</p>
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <Link to="/subjects" className="flex items-center gap-1 text-sm" style={{ color: '#6366f1' }}>
        <ChevronLeft size={14} /> Back to subjects
      </Link>

      {/* Hero */}
      <div className="rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${COLOR}, #4f46e5)` }}>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <BookOpen size={24} className="text-white" />
          </div>
          <div>
            <p className="text-indigo-200 text-sm font-medium">{subject.code}</p>
            <h1 className="text-2xl font-bold text-white mt-1" style={{ fontFamily: 'Space Grotesk' }}>{subject.name}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {subject.credits && <span className="badge bg-white/20 text-white"><Clock size={10} /> {subject.credits} credits</span>}
              {subject.faculty && <span className="badge bg-white/20 text-white"><Users size={10} /> {subject.faculty}</span>}
            </div>
          </div>
        </div>
        {subject.description && (
          <p className="mt-4 text-indigo-200 text-sm">{subject.description}</p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Resources */}
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={16} style={{ color: '#10b981' }} />
              <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk' }}>Resources ({resources.length})</h2>
            </div>
            <Link to="/resources" className="text-xs" style={{ color: '#6366f1' }}>View all</Link>
          </div>
          {resources.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>No resources yet</p>
          ) : (
            <div className="space-y-2">
              {resources.map(r => (
                <div key={r._id} className="flex items-center gap-3 rounded-xl p-2.5"
                  style={{ background: 'var(--surface-muted)' }}>
                  <FileText size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{r.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.type}</p>
                  </div>
                  {(r.fileUrl || r.linkUrl) && (
                    <a href={r.fileUrl || r.linkUrl} target="_blank" rel="noreferrer"
                      className="btn btn-ghost btn-icon flex-shrink-0">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assignments */}
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList size={16} style={{ color: '#f59e0b' }} />
              <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk' }}>Assignments ({assignments.length})</h2>
            </div>
            <Link to="/assignments" className="text-xs" style={{ color: '#6366f1' }}>View all</Link>
          </div>
          {assignments.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>No assignments yet</p>
          ) : (
            <div className="space-y-2">
              {assignments.map(a => (
                <div key={a._id} className="rounded-xl p-2.5" style={{ background: 'var(--surface-muted)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Due: {new Date(a.deadline).toLocaleDateString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
