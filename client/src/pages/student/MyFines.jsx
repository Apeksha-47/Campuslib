import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

export default function StudentMyFines() {
  const [fines, setFines]  = useState([]);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    api.get('/fines/my-fines').then(r => { setFines(r.data.data); setLoad(false); });
  }, []);

  const unpaid = fines.filter(f => !f.paid).reduce((s, f) => s + parseFloat(f.amount), 0);
  const paid   = fines.filter(f => f.paid).reduce((s, f) => s + parseFloat(f.amount), 0);

  return (
    <Layout>
      <h2 className="text-2xl font-bold font-serif text-stone-800 mb-6">My Fines</h2>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs text-red-500 font-medium uppercase">Pending</p>
          <p className="text-2xl font-bold text-red-700 font-serif mt-1">₹{unpaid.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs text-green-600 font-medium uppercase">Paid</p>
          <p className="text-2xl font-bold text-green-700 font-serif mt-1">₹{paid.toFixed(2)}</p>
        </div>
      </div>

      {unpaid > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
          💡 Please visit the library desk to clear your pending fines. Unpaid fines block future checkouts.
        </div>
      )}

      {loading ? <Loader /> : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs text-stone-500 uppercase border-b">
              <tr>{['Book','Fine Amount','Issued On','Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {fines.map(f => (
                <tr key={f.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-800">{f.title}</td>
                  <td className="px-4 py-3 font-bold text-red-600">₹{f.amount}</td>
                  <td className="px-4 py-3 text-stone-400 text-xs">{new Date(f.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${f.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {f.paid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {fines.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-stone-400">✓ No fines on your account</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
