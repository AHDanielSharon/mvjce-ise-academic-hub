import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', usn: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password must match.');
      return;
    }

    setLoading(true);
    try {
      await register({ role: 'student', name: form.name, usn: form.usn, password: form.password });
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Account creation failed. Please verify exact Name and USN.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form className="card w-full max-w-md space-y-3" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold">ISE 4A Student Onboarding</h1>
        <p className="text-sm text-slate-500">Only approved students can create account. Enter exact Name + USN and set your own password.</p>
        <input required value={form.name} className="w-full rounded-xl border p-2" placeholder="Full Name (exact)" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required value={form.usn} className="w-full rounded-xl border p-2" placeholder="USN (example: 1MJ24IS016 / 1MVJ24IS016)" onChange={(e) => setForm({ ...form, usn: e.target.value.toUpperCase() })} />
        <input required minLength={6} type={showPassword ? 'text' : 'password'} value={form.password} className="w-full rounded-xl border p-2" placeholder="Set Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input required minLength={6} type={showPassword ? 'text' : 'password'} value={form.confirmPassword} className="w-full rounded-xl border p-2" placeholder="Confirm Password" onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} /> Show password</label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand-500 p-2 text-white disabled:opacity-60">{loading ? 'Verifying...' : 'Create Account & Login'}</button>
        <p className="text-sm">Already onboarded? <Link className="text-brand-600" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
