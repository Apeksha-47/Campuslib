import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';
import { getDashboard } from '../../services/reportService';
import { getActive } from '../../services/circulationService';

export default function LibDashboard() {
  const [stats, setStats]  = useState(null);
  const [active, setActive] = useState([]);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    Promise.all([getDashboard(), getActive()])
      .then(([s, a]) => { setStats(s.data.data); setActive(a.data.data); })
      .finally(() => setLoad(false));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold font-serif text-stone-800 mb-6">Librarian Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Loans"  value={stats?.active_loans}  color="text-amber-700"/>
        <StatCard label="Overdue"       value={stats?.overdue_loans} color="text-red-600"/>
        <StatCard label="Total Books"   value={stats?.total_books}/>
        <StatCard label="Unpaid Fines"  value={stats ? `₹${stats.unpaid_fines}`:null} color="text-red-700"/>
      </div>

      <div className="bg-white rounded-xl border border-stone-200">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-semibold text-stone-700">Active Loans</h3>
          <span className="text-xs text-stone-400">{active.length} total</span>
        </div>
        {loading ? <Loader/> : (
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs text-stone-500 uppercase border-b">
              <tr>{['Book','Member','College ID','Due Date','Status'].map(h=>(
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {active.slice(0,10).map(l => {
                const overdue = new Date(l.due_date) < new Date();
                return (
                  <tr key={l.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-800">{l.title}</td>
                    <td className="px-4 py-3 text-stone-600">{l.member_name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-400">{l.college_id}</td>
                    <td className={`px-4 py-3 text-sm ${overdue?'text-red-600 font-medium':'text-stone-500'}`}>
                      {new Date(l.due_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${overdue?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>
                        {overdue ? 'Overdue' : 'Active'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {active.length===0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-stone-400">No active loans</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
