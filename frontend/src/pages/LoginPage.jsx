import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { GraduationCap, Eye, EyeOff, ArrowRight, Shield, Lock, User, Hash } from 'lucide-react';

const COLLEGE = 'MVJ College of Engineering, Bengaluru';
const DEPT = 'Department of Information Science Engineering';
const CLASS = 'ISE 4A — 4th Semester (Even) 2026';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [portal, setPortal] = useState('student');
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [staffNames, setStaffNames] = useState([]);

  useEffect(() => {
    api.get('/auth/staff-names').then(r => setStaffNames(r.data || [])).catch(() => {});
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (portal === 'student') {
        await login({ portal: 'student', usn: usn.trim().toUpperCase(), password });
      } else {
        await login({ portal, name: staffName, code: staffCode.trim() });
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isStaff = portal !== 'student';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #0f172a 40%, #1a0f3a 100%)' }}>
      {/* Header bar */}
      <div className="border-b px-6 py-3 flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)' }}>
            <GraduationCap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>ISE Nexus</p>
            <p style={{ fontSize: 9, color: '#64748b' }}>MVJCE Academic Portal</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p style={{ fontSize: 10, color: '#64748b' }}>{COLLEGE}</p>
          <p style={{ fontSize: 10, color: '#64748b' }}>{CLASS}</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* College Branding */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
              <GraduationCap size={30} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>ISE Nexus</h1>
            <p style={{ color: '#94a3b8', fontSize: 13 }}>{DEPT}</p>
            <p style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>{COLLEGE}</p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)' }}>

            {/* Portal Toggle */}
            <div className="mb-5 grid grid-cols-3 rounded-xl p-1 gap-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
              {[
                { val: 'student', label: 'Student', icon: User },
                { val: 'teacher', label: 'Teacher', icon: GraduationCap },
                { val: 'management', label: 'HOD/Admin', icon: Shield },
              ].map(({ val, label, icon: Icon }) => (
                <button key={val} type="button"
                  onClick={() => { setPortal(val); setError(''); }}
                  className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all"
                  style={{
                    fontFamily: 'Space Grotesk',
                    background: portal === val ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'transparent',
                    color: portal === val ? 'white' : '#64748b',
                  }}>
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {portal === 'student' ? (
                <>
                  {/* Student: USN + password */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium" style={{ color: '#94a3b8' }}>
                      <Hash size={11} /> University Seat Number (USN)
                    </label>
                    <input
                      required autoFocus
                      placeholder="e.g. 1MJ24IS016"
                      value={usn}
                      onChange={e => setUsn(e.target.value.toUpperCase())}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white', fontFamily: 'JetBrains Mono', letterSpacing: '0.05em' }}
                    />
                    <p style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>
                      As per official ISE 4A records — 1MJ24IS001 to 1MJ24IS057
                    </p>
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium" style={{ color: '#94a3b8' }}>
                      <Lock size={11} /> Password
                    </label>
                    <div className="relative">
                      <input required
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white', paddingRight: '3rem' }}
                      />
                      <button type="button" onClick={() => setShowPassword(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }}>
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Teacher/HOD: Name (dropdown) + Secret Code */}
                  <div className="rounded-xl p-3 mb-1" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#818cf8' }}>
                      <Shield size={12} />
                      <span className="font-medium">Secure staff portal — name + secret code required</span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium" style={{ color: '#94a3b8' }}>
                      <User size={11} /> Your Name
                    </label>
                    <select required value={staffName} onChange={e => setStaffName(e.target.value)}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: staffName ? 'white' : '#64748b' }}>
                      <option value="">— Select your name —</option>
                      {staffNames.map(s => (
                        <option key={s.name} value={s.name} style={{ background: '#1e293b', color: 'white' }}>
                          {s.name} ({s.designation})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium" style={{ color: '#94a3b8' }}>
                      <Lock size={11} /> Your Secret Code
                    </label>
                    <div className="relative">
                      <input required
                        type={showCode ? 'text' : 'password'}
                        placeholder="Enter your secret code (given by HOD)"
                        value={staffCode}
                        onChange={e => setStaffCode(e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white', paddingRight: '3rem', fontFamily: 'JetBrains Mono', letterSpacing: '0.05em' }}
                      />
                      <button type="button" onClick={() => setShowCode(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }}>
                        {showCode ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <p style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>
                      Contact Dr. Raja Meyyan (HOD) if you don't have your code
                    </p>
                  </div>
                </>
              )}

              {error && (
                <div className="rounded-xl px-3 py-2.5 text-xs" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                  ⚠ {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="btn btn-primary btn-lg w-full justify-center"
                style={{ opacity: loading ? 0.7 : 1 }}>
                {loading
                  ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Signing in…</span>
                  : <span className="flex items-center gap-2">Sign In <ArrowRight size={15} /></span>
                }
              </button>
            </form>

            {portal === 'student' && (
              <p className="mt-4 text-center text-xs" style={{ color: '#475569' }}>
                First time?{' '}
                <Link to="/register" style={{ color: '#818cf8' }} className="font-medium hover:underline">
                  Create your account
                </Link>
              </p>
            )}

            {isStaff && (
              <p className="mt-4 text-center text-xs" style={{ color: '#475569' }}>
                Staff accounts are pre-configured. Contact HOD for your secret code.
              </p>
            )}
          </div>

          {/* Security notice */}
          <p className="mt-4 text-center text-xs" style={{ color: '#1e293b' }}>
            🔒 This portal is exclusively for ISE 4A students and faculty — MVJ College 2026
          </p>
        </div>
      </div>
    </div>
  );
}
