import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    section: 'ISE 4A',
    designation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Account creation failed. Please verify details and try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form className="card w-full max-w-md space-y-3" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold">Create ISE Nexus Account</h1>
        <input required value={form.name} className="w-full rounded-xl border p-2" placeholder="Full Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required value={form.email} type="email" className="w-full rounded-xl border p-2" placeholder="Official Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required value={form.password} minLength={6} type="password" className="w-full rounded-xl border p-2" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input value={form.designation} className="w-full rounded-xl border p-2" placeholder="Designation (optional)" onChange={(e) => setForm({ ...form, designation: e.target.value })} />
        <select value={form.role} className="w-full rounded-xl border p-2" onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="lab_instructor">Lab Instructor</option>
          <option value="department_admin">Department Admin</option>
          <option value="hod">HOD</option>
          <option value="admin">Admin</option>
          <option value="principal">Principal</option>
        </select>
        <select value={form.section} className="w-full rounded-xl border p-2" onChange={(e) => setForm({ ...form, section: e.target.value })}>
          <option>ISE 4A</option><option>ISE 4B</option>
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand-500 p-2 text-white disabled:opacity-60">{loading ? 'Creating Account...' : 'Create Account'}</button>
        <p className="text-sm">Already have account? <Link className="text-brand-600" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
