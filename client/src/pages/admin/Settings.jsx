import Layout from '../../components/layout/Layout';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuth();
  const [current, setCurrent] = useState('');
  const [newPass, setNew] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleChange = async () => {
    if (newPass !== confirm) { toast.error('Passwords do not match'); return; }
    try {
      await api.put('/auth/password', { current, newPass });
      toast.success('Password changed!');
      setCurrent(''); setNew(''); setConfirm('');
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold font-serif text-stone-800 mb-6">Settings</h2>
      <div className="bg-white rounded-xl border border-stone-200 p-6 max-w-md">
        <h3 className="font-semibold text-stone-700 mb-4">Change Password</h3>
        <div className="space-y-3">
          {[['Current Password', current, setCurrent], ['New Password', newPass, setNew], ['Confirm New Password', confirm, setConfirm]].map(([label, val, setter]) => (
            <div key={label}>
              <label className="block text-xs text-stone-500 mb-1">{label}</label>
              <input type="password" value={val} onChange={e => setter(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-800"/>
            </div>
          ))}
          <button onClick={handleChange} className="w-full bg-red-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-800 mt-2">
            Change Password
          </button>
        </div>
      </div>
    </Layout>
  );
}
