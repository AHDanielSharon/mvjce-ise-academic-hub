import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight, Info, Hash, User, Lock } from 'lucide-react';

// Full ISE 4A student list — for the helpful hint
const STUDENT_COUNT = 53;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', usn: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await register({ name: form.name.trim(), usn: form.usn.trim().toUpperCase(), password: form.password, role: 'student' });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check your name and USN exactly match college records.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #0f172a 40%, #1a0f3a 100%)' }}>
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg,#6366f1,#d946ef)' }}>
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>ISE Nexus</p>
            <p style={{ fontSize: 11, color: '#64748b' }}>Student Registration — ISE 4A Sem 4</p>
          </div>
        </div>

        <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)' }}>
          <div>
            <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>Create your account</h2>
            <p style={{ fontSize: 12, color: '#64748b' }}>Use your exact name and USN as per official college records</p>
          </div>

          {/* Important notice */}
          <div className="rounded-xl p-3" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className="flex items-start gap-2">
              <Info size={13} style={{ color: '#818cf8', flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>
                <p className="font-medium mb-1" style={{ color: '#818cf8' }}>Important — Name must match exactly:</p>
                <p>Enter your full name exactly as listed in the official ISE 4A roll call (e.g. <code style={{ fontFamily: 'JetBrains Mono', background: 'rgba(255,255,255,0.1)', padding: '1px 5px', borderRadius: 4 }}>ARCHANA C</code>)</p>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium" style={{ color: '#94a3b8' }}>
                <User size={11} /> Full Name (exactly as in college records)
              </label>
              <input required
                placeholder="e.g. ARCHANA C"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value.toUpperCase() }))}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white', textTransform: 'uppercase' }}
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium" style={{ color: '#94a3b8' }}>
                <Hash size={11} /> USN (University Seat Number)
              </label>
              <input required
                placeholder="e.g. 1MJ24IS016"
                value={form.usn}
                onChange={e => setForm(f => ({ ...f, usn: e.target.value.toUpperCase() }))}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white', fontFamily: 'JetBrains Mono', letterSpacing: '0.05em' }}
              />
              <p style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>Format: 1MJ24IS001 — 1MJ24IS057</p>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium" style={{ color: '#94a3b8' }}>
                <Lock size={11} /> Password (min 6 characters)
              </label>
              <input required type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white' }}
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium" style={{ color: '#94a3b8' }}>
                <Lock size={11} /> Confirm Password
              </label>
              <input required type="password"
                placeholder="Re-enter password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white' }}
              />
            </div>

            {error && (
              <div className="rounded-xl px-3 py-2.5 text-xs" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full justify-center"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating account…' : <><ArrowRight size={15} /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-xs" style={{ color: '#475569' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: '#818cf8' }} className="font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs" style={{ color: '#1e293b' }}>
          Only {STUDENT_COUNT} officially enrolled ISE 4A students can register
        </p>
      </div>
    </div>
  );
}
