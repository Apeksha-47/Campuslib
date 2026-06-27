import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import StatCard from '../../components/common/StatCard';
import { getDashboard, getPopular, getCirculation } from '../../services/reportService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [popular, setPop]   = useState([]);
  const [monthly, setMon]   = useState([]);

  useEffect(() => {
    getDashboard().then(r => setStats(r.data.data));
    getPopular().then(r => setPop(r.data.data));
    getCirculation().then(r => setMon(r.data.data));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold font-serif text-stone-800 mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Books"   value={stats?.total_books}   />
        <StatCard label="Members"       value={stats?.total_members} />
        <StatCard label="Active Loans"  value={stats?.active_loans}  color="text-amber-700" />
        <StatCard label="Overdue"       value={stats?.overdue_loans} color="text-red-600" />
        <StatCard label="Unpaid Fines"  value={stats ? `₹${stats.unpaid_fines}` : null} color="text-red-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-700 mb-4">Monthly Circulation</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="checkouts" fill="#7c2d12" name="Checkouts" radius={[3,3,0,0]} />
              <Bar dataKey="returns"   fill="#d97706" name="Returns"   radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-700 mb-4">Most Borrowed Books</h3>
          <div className="space-y-3">
            {popular.map((b, i) => (
              <div key={b.id} className="flex items-center gap-3">
                <span className="text-xs font-mono text-stone-400 w-4">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{b.title}</p>
                  <p className="text-xs text-stone-400">{b.author}</p>
                </div>
                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {b.borrow_count}x
                </span>
              </div>
            ))}
            {popular.length === 0 && <p className="text-sm text-stone-400">No data yet</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
