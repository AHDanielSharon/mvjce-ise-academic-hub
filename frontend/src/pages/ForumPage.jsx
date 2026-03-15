import { useEffect, useState } from 'react';
import api from '../api/client';

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [question, setQuestion] = useState({ title: '', question: '', tags: '' });

  const load = () => api.get('/forum').then((res) => setPosts(res.data));
  useEffect(() => { load(); }, []);

  const createPost = async (e) => {
    e.preventDefault();
    await api.post('/forum', { ...question, tags: question.tags.split(',').map((tag) => tag.trim()).filter(Boolean) });
    setQuestion({ title: '', question: '', tags: '' });
    load();
  };

  const answer = async (id, content) => {
    if (!content) return;
    await api.post(`/forum/${id}/answers`, { content });
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Collaborative Doubt Forum</h1>
      <form onSubmit={createPost} className="card grid gap-2">
        <input className="rounded-xl border p-2" placeholder="Question title" value={question.title} onChange={(e) => setQuestion({ ...question, title: e.target.value })} required />
        <textarea className="rounded-xl border p-2" placeholder="Describe your doubt" value={question.question} onChange={(e) => setQuestion({ ...question, question: e.target.value })} required />
        <input className="rounded-xl border p-2" placeholder="Tags (comma separated)" value={question.tags} onChange={(e) => setQuestion({ ...question, tags: e.target.value })} />
        <button className="rounded-xl bg-brand-500 px-3 py-2 text-white">Post Question</button>
      </form>
      {posts.map((post) => (
        <div key={post._id} className="card">
          <h2 className="font-semibold">{post.title}</h2>
          <p className="text-sm">{post.question}</p>
          <p className="mb-2 mt-1 text-xs text-slate-500">Asked by {post.createdBy?.name}</p>
          <div className="space-y-2">
            {post.answers.map((ans) => <p key={ans._id} className={`rounded-lg p-2 text-sm ${ans.isHelpful ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-slate-100 dark:bg-slate-800'}`}>{ans.content} — {ans.answeredBy?.name}</p>)}
          </div>
          <button className="mt-2 rounded-lg bg-slate-900 px-3 py-1 text-xs text-white dark:bg-slate-100 dark:text-slate-900" onClick={() => answer(post._id, window.prompt('Your answer'))}>Add Answer</button>
        </div>
      ))}
    </div>
  );
}
