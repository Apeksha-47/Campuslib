import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome, ${user.name}!`);
      if (user.role === 'admin')     navigate('/admin/dashboard');
      else if (user.role === 'librarian') navigate('/librarian/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-800 font-serif">CampusLib</h1>
          <p className="text-stone-500 text-sm mt-1">College Library Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-800"
              placeholder="you@college.edu"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Password</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-800"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-red-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-800 transition disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-xs text-stone-400 mt-6">
          First login? Use your College ID as password.
        </p>
      </div>
    </div>
  );
}
