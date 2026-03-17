import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const demoAccounts = [
  { label: 'Student', email: 'student.ise@mvjce.edu.in', password: 'password123' },
  { label: 'Teacher', email: 'anupama.p@mvjce.edu.in', password: 'password123' },
  { label: 'HOD', email: 'hod.ise@mvjce.edu.in', password: 'password123' }
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', portal: 'any' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email.trim().toLowerCase(), form.password, form.portal);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form className="card w-full max-w-md space-y-4" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold">Welcome to ISE Nexus</h1>
        <p className="text-sm text-slate-500">Sign in with your already created account credentials.</p>
        <select className="w-full rounded-xl border p-2" value={form.portal} onChange={(e) => setForm({ ...form, portal: e.target.value })}>
          <option value="any">Auto-detect (Recommended)</option>
          <option value="student">Student Portal</option>
          <option value="teacher">Teacher Portal</option>
          <option value="management">Management Portal</option>
        </select>
        <input className="w-full rounded-xl border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <div className="space-y-2">
          <input type={showPassword ? 'text' : 'password'} className="w-full rounded-xl border p-2" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} /> Show password</label>
        </div>
        <div className="rounded-xl border p-2 text-xs text-slate-500">
          Demo login password: <b>password123</b>
          <div className="mt-2 flex flex-wrap gap-2">
            {demoAccounts.map((acc) => (
              <button key={acc.label} type="button" className="rounded border px-2 py-1" onClick={() => setForm((f) => ({ ...f, email: acc.email, password: acc.password }))}>{acc.label}</button>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-xl bg-brand-500 p-2 text-white">Sign In</button>
        <p className="text-sm">New here? <Link className="text-brand-600" to="/register">Create account</Link></p>
      </form>
    </div>
  );
}
