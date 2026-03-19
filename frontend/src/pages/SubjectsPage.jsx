import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { BookOpen, ChevronRight, Code2, Users, Clock } from 'lucide-react';

const SUBJECT_COLORS = ['#6366f1','#d946ef','#10b981','#f59e0b','#ef4444','#06b6d4','#8b5cf6','#ec4899'];
const colorFor = (code) => SUBJECT_COLORS[(code?.charCodeAt(0) || 0) % SUBJECT_COLORS.length];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/subjects').then(res => { setSubjects(res.data || []); setLoading(false); });
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
          <BookOpen size={18} style={{ color: '#6366f1' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Subject Hub</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>4th Semester · ISE · {subjects.length} subjects</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-36" />)}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {subjects.map((s, i) => {
            const color = colorFor(s.code);
            return (
              <Link key={s._id} to={`/subjects/${s._id}`}
                className="card card-hover group block animate-slide-up cursor-pointer"
                style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
                    <BookOpen size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold leading-snug" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                          {s.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="badge" style={{ background: color + '18', color }}>
                            <Code2 size={9} /> {s.code}
                          </span>
                          {s.credits && (
                            <span className="badge badge-muted">
                              <Clock size={9} /> {s.credits} credits
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={16} className="flex-shrink-0 transition-transform group-hover:translate-x-1"
                        style={{ color: 'var(--text-muted)', marginTop: 4 }} />
                    </div>
                    {s.description && (
                      <p className="mt-2 text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>{s.description}</p>
                    )}
                    {s.faculty && (
                      <p className="mt-2 flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Users size={10} /> {s.faculty}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
