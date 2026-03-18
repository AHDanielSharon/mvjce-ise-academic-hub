import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ portal: 'student', usn: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isStudentPortal = form.portal === 'student';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isStudentPortal) {
        await login({ portal: 'student', usn: form.usn, password: form.password });
      } else {
        await login({ portal: form.portal, email: form.email.trim().toLowerCase(), password: form.password });
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form className="card w-full max-w-md space-y-4" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold">Welcome to ISE Nexus</h1>
        <p className="text-sm text-slate-500">Student login requires USN + your password.</p>

        <select className="w-full rounded-xl border p-2" value={form.portal} onChange={(e) => setForm({ ...form, portal: e.target.value })}>
          <option value="student">Student Portal (USN + Password)</option>
          <option value="teacher">Teacher Portal</option>
          <option value="management">Management Portal</option>
        </select>

        {isStudentPortal ? (
          <>
            <input className="w-full rounded-xl border p-2" placeholder="USN (example: 1MJ24IS016 / 1MVJ24IS016)" value={form.usn} onChange={(e) => setForm({ ...form, usn: e.target.value.toUpperCase() })} />
            <input type={showPassword ? 'text' : 'password'} className="w-full rounded-xl border p-2" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </>
        ) : (
          <>
            <input className="w-full rounded-xl border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type={showPassword ? 'text' : 'password'} className="w-full rounded-xl border p-2" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </>
        )}

        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} /> Show password</label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-xl bg-brand-500 p-2 text-white">Sign In</button>
        <p className="text-sm">Need account? <Link className="text-brand-600" to="/register">Student Onboarding</Link></p>
      </form>
    </div>
  );
}
