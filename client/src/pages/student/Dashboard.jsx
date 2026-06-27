import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { getMyLoans } from '../../services/circulationService';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loans, setLoans]   = useState([]);
  const [fines, setFines]   = useState([]);
  const [loading, setLoad]  = useState(true);

  useEffect(() => {
    Promise.all([getMyLoans(), api.get('/fines/my-fines')])
      .then(([l, f]) => { setLoans(l.data.data); setFines(f.data.data); })
      .finally(() => setLoad(false));
  }, []);

  const active   = loans.filter(l => l.status === 'active');
  const overdue  = loans.filter(l => new Date(l.due_date) < new Date() && l.status === 'active');
  const unpaid   = fines.filter(f => !f.paid).reduce((s, f) => s + parseFloat(f.amount), 0);

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-serif text-stone-800">Welcome, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-stone-500 text-sm mt-1">{user?.college_id} · {user?.department}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Books Borrowed"   value={active.length}           color="text-amber-700" />
        <StatCard label="Overdue"          value={overdue.length}          color={overdue.length > 0 ? 'text-red-600' : 'text-green-600'} />
        <StatCard label="Total Borrowed"   value={loans.length}            />
        <StatCard label="Pending Fines"    value={`₹${unpaid.toFixed(2)}`} color={unpaid > 0 ? 'text-red-700' : 'text-green-600'} />
      </div>

      {loading ? <Loader /> : (
        <>
          {overdue.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700 font-semibold text-sm mb-1">⚠ You have {overdue.length} overdue book{overdue.length > 1 ? 's' : ''}!</p>
              <p className="text-red-500 text-xs">Please return them to the library. Fines are accumulating at ₹2/day.</p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-stone-200">
            <div className="px-5 py-4 border-b border-stone-100">
              <h3 className="font-semibold text-stone-700">Currently Borrowed</h3>
            </div>
            {active.length === 0 ? (
              <p className="px-5 py-10 text-center text-stone-400 text-sm">You have no active loans</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-xs text-stone-500 uppercase border-b">
                  <tr>{['Book','Author','Due Date','Status'].map(h=>(
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {active.map(l => {
                    const od = new Date(l.due_date) < new Date();
                    return (
                      <tr key={l.id} className={od ? 'bg-red-50/40' : 'hover:bg-stone-50'}>
                        <td className="px-4 py-3 font-medium text-stone-800">{l.title}</td>
                        <td className="px-4 py-3 text-stone-500">{l.author}</td>
                        <td className={`px-4 py-3 font-medium ${od ? 'text-red-600' : 'text-stone-600'}`}>
                          {new Date(l.due_date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3"><Badge status={od ? 'overdue' : 'active'} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
