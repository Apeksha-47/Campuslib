import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/common/Loader';
import { getOverdue } from '../../services/circulationService';
import { getPopular } from '../../services/reportService';

export default function AdminReports() {
  const [overdue, setOverdue] = useState([]);
  const [popular, setPopular] = useState([]);
  const [tab, setTab]         = useState('overdue');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOverdue(), getPopular()])
      .then(([o, p]) => { setOverdue(o.data.data); setPopular(p.data.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold font-serif text-stone-800 mb-6">Reports</h2>
      <div className="flex gap-2 mb-5">
        {['overdue','popular'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition
              ${tab===t ? 'bg-red-900 text-white' : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-50'}`}>
            {t === 'overdue' ? 'Overdue Books' : 'Popular Books'}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : tab === 'overdue' ? (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs text-stone-500 uppercase border-b">
              <tr>{['Book','Member','College ID','Due Date','Days Overdue'].map(h=>(
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {overdue.map(r => (
                <tr key={r.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-800">{r.title}</td>
                  <td className="px-4 py-3 text-stone-600">{r.member_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-400">{r.college_id}</td>
                  <td className="px-4 py-3 text-stone-500">{new Date(r.due_date).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 text-red-600 font-medium">{r.days_overdue} days</td>
                </tr>
              ))}
              {overdue.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-stone-400 text-green-600">✓ No overdue books</td></tr>}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs text-stone-500 uppercase border-b">
              <tr>{['#','Title','Author','Times Borrowed'].map(h=>(
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {popular.map((b,i) => (
                <tr key={b.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-stone-400 font-mono text-xs">{i+1}</td>
                  <td className="px-4 py-3 font-medium text-stone-800">{b.title}</td>
                  <td className="px-4 py-3 text-stone-600">{b.author}</td>
                  <td className="px-4 py-3"><span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-medium">{b.borrow_count}x</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
