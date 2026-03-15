import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', section: 'ISE 4A' });

  const onSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form className="card w-full max-w-md space-y-3" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold">Register</h1>
        <input className="w-full rounded-xl border p-2" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full rounded-xl border p-2" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="w-full rounded-xl border p-2" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="w-full rounded-xl border p-2" onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option><option value="teacher">Teacher</option><option value="admin">Admin</option>
        </select>
        <select className="w-full rounded-xl border p-2" onChange={(e) => setForm({ ...form, section: e.target.value })}>
          <option>ISE 4A</option><option>ISE 4B</option>
        </select>
        <button type="submit" className="w-full rounded-xl bg-brand-500 p-2 text-white">Create Account</button>
        <p className="text-sm">Already have account? <Link className="text-brand-600" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
