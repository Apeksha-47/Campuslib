import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { getMyLoans } from '../../services/circulationService';

export default function StudentMyLoans() {
  const [loans, setLoans]  = useState([]);
  const [loading, setLoad] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    getMyLoans().then(r => { setLoans(r.data.data); setLoad(false); });
  }, []);

  const display = loans.filter(l => {
    if (filter === 'active')   return l.status === 'active';
    if (filter === 'returned') return l.status === 'returned';
    return true;
  });

  return (
    <Layout>
      <h2 className="text-2xl font-bold font-serif text-stone-800 mb-6">My Loans</h2>

      <div className="flex gap-2 mb-5">
        {[['active','Active'],['returned','Returned'],['all','All']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${filter===v ? 'bg-red-900 text-white' : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-50'}`}>
            {l}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs text-stone-500 uppercase border-b">
              <tr>{['Book','Author','Issued','Due Date','Returned','Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {display.map(l => {
                const od = l.status === 'active' && new Date(l.due_date) < new Date();
                return (
                  <tr key={l.id} className={od ? 'bg-red-50/30' : 'hover:bg-stone-50'}>
                    <td className="px-4 py-3 font-medium text-stone-800">{l.title}</td>
                    <td className="px-4 py-3 text-stone-500">{l.author}</td>
                    <td className="px-4 py-3 text-stone-400 text-xs">{new Date(l.issued_at).toLocaleDateString('en-IN')}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${od ? 'text-red-600' : 'text-stone-600'}`}>
                      {new Date(l.due_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-stone-400 text-xs">
                      {l.returned_at ? new Date(l.returned_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={od ? 'overdue' : l.status} />
                    </td>
                  </tr>
                );
              })}
              {display.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-stone-400">No loans found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
