import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Settings, BookOpen, Users, GraduationCap, Plus, Trash2, Save, X, FlaskConical } from 'lucide-react';

const TABS = [
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'faculty', label: 'Faculty', icon: GraduationCap },
  { id: 'users', label: 'Users', icon: Users },
];

const SUBJECT_FIELDS = ['name','code','credits','description','faculty'];
const emptySubject = { name:'', code:'', credits:3, description:'', faculty:'' };
const emptyFaculty = { facultyName:'', designation:'', department:'ISE', section:'ISE 4A', subjects:[], email:'', phone:'', isClassCoordinator:false };

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [users, setUsers] = useState({ all:[], grouped:{} });
  const [subjectForm, setSubjectForm] = useState(emptySubject);
  const [facultyForm, setFacultyForm] = useState(emptyFaculty);
  const [status, setStatus] = useState('');

  const loadSubjects = () => api.get('/subjects').then(r => setSubjects(r.data));
  const loadFaculty = () => api.get('/faculty').then(r => setFaculty(r.data));
  const loadUsers = () => api.get('/users').then(r => setUsers(r.data));

  useEffect(() => {
    loadSubjects(); loadFaculty(); loadUsers();
  }, []);

  const toast = (msg) => { setStatus(msg); setTimeout(() => setStatus(''), 3000); };

  const addSubject = async (e) => {
    e.preventDefault();
    await api.post('/subjects', subjectForm);
    setSubjectForm(emptySubject);
    loadSubjects();
    toast('✓ Subject created.');
  };

  const deleteSubject = async (id) => {
    await api.delete(`/subjects/${id}`);
    loadSubjects();
    toast('✓ Subject deleted.');
  };

  const addFaculty = async (e) => {
    e.preventDefault();
    await api.post('/faculty', { ...facultyForm, subjects: facultyForm.subjects ? facultyForm.subjects.split(',').map(s=>s.trim()) : [] });
    setFacultyForm(emptyFaculty);
    loadFaculty();
    toast('✓ Faculty added.');
  };

  const deleteFaculty = async (id) => {
    await api.delete(`/faculty/${id}`);
    loadFaculty();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
          <Settings size={18} style={{ color: '#6366f1' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Academic Controls</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage subjects, faculty, and user accounts</p>
        </div>
      </div>

      {status && (
        <div className="rounded-xl px-4 py-3 text-sm"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>
          {status}
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex gap-1 rounded-2xl p-1" style={{ background: 'var(--surface-muted)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? 'var(--surface)' : 'transparent',
              color: tab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              fontFamily: 'Space Grotesk',
            }}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Subjects Tab */}
      {tab === 'subjects' && (
        <div className="space-y-4">
          <form onSubmit={addSubject} className="card space-y-3">
            <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Add Subject</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Subject Name</label>
                <input required placeholder="e.g. Advanced Java" value={subjectForm.name}
                  onChange={e => setSubjectForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Subject Code</label>
                <input required placeholder="e.g. 18CS402" value={subjectForm.code}
                  onChange={e => setSubjectForm(f => ({ ...f, code: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Credits</label>
                <input type="number" min={1} max={6} value={subjectForm.credits}
                  onChange={e => setSubjectForm(f => ({ ...f, credits: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Faculty</label>
                <input placeholder="Faculty name" value={subjectForm.faculty}
                  onChange={e => setSubjectForm(f => ({ ...f, faculty: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Description</label>
                <textarea placeholder="Short description" value={subjectForm.description}
                  onChange={e => setSubjectForm(f => ({ ...f, description: e.target.value }))} rows={2} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm"><Plus size={14} /> Add Subject</button>
          </form>

          <div className="card">
            <h2 className="mb-3 font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Subjects ({subjects.length})</h2>
            {subjects.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>No subjects yet</p>
            ) : (
              <table className="data-table">
                <thead><tr><th>Code</th><th>Name</th><th>Credits</th><th>Faculty</th><th></th></tr></thead>
                <tbody>
                  {subjects.map(s => (
                    <tr key={s._id}>
                      <td style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>{s.code}</td>
                      <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{s.name}</td>
                      <td>{s.credits}</td>
                      <td>{s.faculty || '—'}</td>
                      <td>
                        <button onClick={() => deleteSubject(s._id)} className="btn btn-ghost btn-icon btn-sm">
                          <Trash2 size={13} style={{ color: '#ef4444' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Faculty Tab */}
      {tab === 'faculty' && (
        <div className="space-y-4">
          <form onSubmit={addFaculty} className="card space-y-3">
            <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Add Faculty</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                <input required placeholder="Dr. Name" value={facultyForm.facultyName}
                  onChange={e => setFacultyForm(f => ({ ...f, facultyName: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Designation</label>
                <input placeholder="Assistant Professor" value={facultyForm.designation}
                  onChange={e => setFacultyForm(f => ({ ...f, designation: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Section</label>
                <select value={facultyForm.section} onChange={e => setFacultyForm(f => ({ ...f, section: e.target.value }))}>
                  <option>ISE 4A</option>
                  <option>ISE 4B</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Email</label>
                <input type="email" placeholder="name@mvjce.edu.in" value={facultyForm.email}
                  onChange={e => setFacultyForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Subjects (comma-separated)</label>
                <input placeholder="ADA, Advanced Java, DBMS" value={facultyForm.subjects}
                  onChange={e => setFacultyForm(f => ({ ...f, subjects: e.target.value }))} />
              </div>
              <label className="md:col-span-2 flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={facultyForm.isClassCoordinator}
                  onChange={e => setFacultyForm(f => ({ ...f, isClassCoordinator: e.target.checked }))}
                  style={{ width: 'auto', background: 'transparent', border: 'none', padding: 0 }} />
                Class Coordinator
              </label>
            </div>
            <button type="submit" className="btn btn-primary btn-sm"><Plus size={14} /> Add Faculty</button>
          </form>

          <div className="card">
            <h2 className="mb-3 font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Faculty ({faculty.length})</h2>
            <div className="space-y-2">
              {faculty.map(f => (
                <div key={f._id} className="flex items-center justify-between rounded-xl p-3"
                  style={{ background: 'var(--surface-muted)' }}>
                  <div>
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{f.facultyName}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{f.designation} · {f.section}</p>
                  </div>
                  <button onClick={() => deleteFaculty(f._id)} className="btn btn-ghost btn-icon btn-sm">
                    <Trash2 size={13} style={{ color: '#ef4444' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="card">
          <h2 className="mb-3 font-semibold" style={{ fontFamily: 'Space Grotesk' }}>
            Registered Users ({users.all?.length || 0})
          </h2>
          <div className="space-y-4">
            {['students','teachers','admins'].map(group => {
              const groupData = users.grouped?.[group] || [];
              if (!groupData.length) return null;
              return (
                <div key={group}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                    {group} ({groupData.length})
                  </p>
                  <table className="data-table">
                    <thead><tr><th>Name</th><th>USN / Email</th><th>Section</th><th>Role</th></tr></thead>
                    <tbody>
                      {groupData.map(u => (
                        <tr key={u._id}>
                          <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{u.name}</td>
                          <td style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>{u.usn || u.email}</td>
                          <td>{u.section || '—'}</td>
                          <td><span className="badge badge-muted">{u.role?.replace('_',' ')}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
