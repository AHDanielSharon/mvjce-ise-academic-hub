import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Plus, Send, CheckCircle2, Tag, ThumbsUp, Clock, ChevronDown, ChevronUp, Search } from 'lucide-react';

const COLORS = ['#6366f1','#d946ef','#10b981','#f59e0b','#ef4444','#06b6d4'];
function tagColor(tag) { return COLORS[tag.charCodeAt(0) % COLORS.length]; }

function PostCard({ post, onAnswer }) {
  const [expanded, setExpanded] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleAnswer = async () => {
    if (!answerText.trim()) return;
    setSubmitting(true);
    await onAnswer(post._id, answerText);
    setAnswerText('');
    setSubmitting(false);
  };

  return (
    <div className="card card-hover animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)' }}>
            {post.createdBy?.name?.[0] || 'U'}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold leading-snug" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              {post.title}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Asked by <span className="font-medium">{post.createdBy?.name}</span>
              {post.createdAt && <> · {new Date(post.createdAt).toLocaleDateString()}</>}
            </p>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <span className="badge badge-muted">
            <MessageSquare size={10} /> {post.answers?.length || 0}
          </span>
          <button onClick={() => setExpanded(s => !s)} className="btn btn-ghost btn-icon">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map(tag => (
            <span key={tag} className="badge" style={{ background: tagColor(tag) + '20', color: tagColor(tag) }}>
              <Tag size={9} /> {tag}
            </span>
          ))}
        </div>
      )}

      {/* Expanded */}
      {expanded && (
        <div className="mt-4 space-y-3 animate-slide-up">
          <div className="rounded-xl p-3 text-sm" style={{ background: 'var(--surface-muted)', color: 'var(--text-secondary)' }}>
            {post.question}
          </div>

          {/* Answers */}
          {post.answers?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Answers</p>
              {post.answers.map(ans => (
                <div key={ans._id} className="flex items-start gap-3 rounded-xl p-3"
                  style={{
                    background: ans.isHelpful ? 'rgba(16,185,129,0.08)' : 'var(--surface-muted)',
                    border: ans.isHelpful ? '1.5px solid rgba(16,185,129,0.25)' : '1px solid var(--border)',
                  }}>
                  {ans.isHelpful && <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />}
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{ans.content}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>— {ans.answeredBy?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Answer Input */}
          <div className="flex gap-2">
            <input
              placeholder="Write your answer…"
              value={answerText}
              onChange={e => setAnswerText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAnswer()}
              style={{ flex: 1 }}
            />
            <button onClick={handleAnswer} disabled={submitting || !answerText.trim()}
              className="btn btn-primary btn-sm flex-shrink-0">
              {submitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ title: '', question: '', tags: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const res = await api.get('/forum');
    setPosts(res.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const createPost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await api.post('/forum', {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setForm({ title: '', question: '', tags: '' });
    setShowForm(false);
    setSubmitting(false);
    load();
  };

  const answer = async (id, content) => {
    await api.post(`/forum/${id}/answers`, { content });
    load();
  };

  const filtered = posts.filter(p =>
    `${p.title} ${p.question} ${(p.tags || []).join(' ')}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <MessageSquare size={18} style={{ color: '#6366f1' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Doubt Forum</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{posts.length} questions · help each other learn</p>
          </div>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn btn-primary btn-sm">
          <Plus size={14} /> Ask Question
        </button>
      </div>

      {/* New Question Form */}
      {showForm && (
        <form onSubmit={createPost} className="card space-y-3 animate-slide-up border-2" style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
          <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Post a Question</h2>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Question Title</label>
            <input placeholder="What's your doubt? Be specific." value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Detailed Description</label>
            <textarea placeholder="Explain what you've tried, what you're stuck on, and any error messages…"
              value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
              rows={4} required style={{ resize: 'vertical' }} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Tags (comma-separated)</label>
            <input placeholder="e.g. ADA, sorting, graph theory" value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Posting…' : <><Send size={14} /> Post Question</>}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input placeholder="Search questions, tags, topics…" value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ paddingLeft: '2.5rem' }} />
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <MessageSquare size={40} strokeWidth={1} className="mb-3 opacity-30" />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {query ? 'No matching questions' : 'Be the first to ask!'}
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            {query ? 'Try different search terms' : 'Start a conversation with your classmates'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post, i) => (
            <PostCard key={post._id} post={post} onAnswer={answer} />
          ))}
        </div>
      )}
    </div>
  );
}
