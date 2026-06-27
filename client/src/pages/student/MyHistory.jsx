import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { getMyLoans } from '../../services/circulationService';

export default function MyHistory() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    getMyLoans().then(r => { setLoans(r.data.data.filter(l => l.status === 'returned')); setLoad(false); });
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold font-serif text-stone-800 mb-6">Borrowing History</h2>
      {loading ? <Loader /> : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs text-stone-500 uppercase border-b">
              <tr>{['Book','Author','Issued','Returned','Status'].map(h=>(
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loans.map(l=>(
                <tr key={l.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-800">{l.title}</td>
                  <td className="px-4 py-3 text-stone-500">{l.author}</td>
                  <td className="px-4 py-3 text-stone-400 text-xs">{new Date(l.issued_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 text-stone-400 text-xs">{l.returned_at ? new Date(l.returned_at).toLocaleDateString('en-IN') : '—'}</td>
                  <td className="px-4 py-3"><Badge status="returned"/></td>
                </tr>
              ))}
              {loans.length===0&&<tr><td colSpan={5} className="px-4 py-10 text-center text-stone-400">No history yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
