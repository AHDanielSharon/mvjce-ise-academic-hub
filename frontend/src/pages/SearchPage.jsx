import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Search, BookOpen, ClipboardList, FileText, Megaphone, MessageSquare, Loader2 } from 'lucide-react';

const TYPE_CONFIG = {
  subject: { icon: BookOpen, color: '#6366f1', label: 'Subject', link: (r) => `/subjects/${r._id}` },
  assignment: { icon: ClipboardList, color: '#f59e0b', label: 'Assignment', link: () => '/assignments' },
  resource: { icon: FileText, color: '#10b981', label: 'Resource', link: () => '/resources' },
  announcement: { icon: Megaphone, color: '#d946ef', label: 'Announcement', link: () => '/announcements' },
  forum: { icon: MessageSquare, color: '#06b6d4', label: 'Forum Post', link: () => '/forum' },
};

const SUGGESTIONS = [
  'ADA algorithm', 'Advanced Java', 'DBMS notes', 'question paper', 'lab program', 'timetable',
];

function highlight(text, query) {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase() ? <mark key={i}>{p}</mark> : p
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q = query) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get('/search', { params: { q } });
      setResults(res.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleKey = (e) => {
    if (e.key === 'Enter') doSearch();
  };

  const grouped = results.reduce((acc, r) => {
    const type = r.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
          <Search size={18} style={{ color: '#6366f1' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Smart Search</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Search across subjects, resources, assignments, forum</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            autoFocus
            placeholder="Search everything — ADA, DBMS, notes, assignments…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            style={{ paddingLeft: '3rem', paddingRight: '7rem', fontSize: '1rem', height: '3rem' }}
          />
          <button onClick={() => doSearch()} className="btn btn-primary btn-sm absolute right-2 top-1/2 -translate-y-1/2">
            Search
          </button>
        </div>

        {/* Suggestions */}
        {!searched && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Try searching for:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => { setQuery(s); doSearch(s); }}
                  className="badge badge-muted cursor-pointer hover:badge-brand transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3" style={{ color: 'var(--text-muted)' }}>
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Searching across all modules…</span>
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="card flex flex-col items-center py-16 text-center">
          <Search size={40} strokeWidth={1} className="mb-3 opacity-30" />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No results for "{query}"</p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Try different keywords or browse specific sections</p>
        </div>
      )}

      {!loading && Object.entries(grouped).map(([type, items]) => {
        const cfg = TYPE_CONFIG[type] || { icon: FileText, color: '#6366f1', label: type, link: () => '/' };
        const Icon = cfg.icon;
        return (
          <div key={type} className="card animate-slide-up">
            <div className="mb-3 flex items-center gap-2">
              <Icon size={15} style={{ color: cfg.color }} />
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                {cfg.label} ({items.length})
              </span>
            </div>
            <div className="space-y-2">
              {items.map((r) => (
                <Link key={r._id} to={cfg.link(r)}
                  className="block rounded-xl p-3 transition-all hover:shadow-sm"
                  style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}>
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    {highlight(r.title || r.name || r.question || '—', query)}
                  </p>
                  {(r.description || r.content) && (
                    <p className="mt-0.5 text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                      {highlight((r.description || r.content || '').slice(0, 120), query)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
