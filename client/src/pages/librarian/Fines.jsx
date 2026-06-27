import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function LibFines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoad] = useState(true);
  const [filter, setFilter] = useState('unpaid');

  const load = () => { setLoad(true); api.get('/fines').then(r=>{setFines(r.data.data);setLoad(false);}); };
  useEffect(() => { load(); }, []);

  const markPaid = async (id) => {
    try { await api.put(`/fines/${id}/pay`); toast.success('Marked as paid'); load(); }
    catch { toast.error('Error'); }
  };
  const waive = async (id) => {
    try { await api.put(`/fines/${id}/waive`); toast.success('Fine waived'); load(); }
    catch { toast.error('Error'); }
  };

  const display = fines.filter(f => filter==='all' ? true : filter==='unpaid' ? !f.paid : f.paid);
  const totalUnpaid = fines.filter(f=>!f.paid).reduce((s,f)=>s+parseFloat(f.amount),0);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-serif text-stone-800">Fines</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm">
          Total Unpaid: <span className="font-bold text-red-700">₹{totalUnpaid.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {[['unpaid','Unpaid'],['paid','Paid'],['all','All']].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition
              ${filter===v?'bg-red-900 text-white':'bg-white border border-stone-300 text-stone-600 hover:bg-stone-50'}`}>{l}</button>
        ))}
      </div>

      {loading?<Loader/>:(
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs text-stone-500 uppercase border-b">
              <tr>{['Member','Book','Amount','Date','Status','Actions'].map(h=><th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {display.map(f=>(
                <tr key={f.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-800">{f.name}</p>
                    <p className="text-xs text-stone-400 font-mono">{f.college_id}</p>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{f.title}</td>
                  <td className="px-4 py-3 font-bold text-red-700">₹{f.amount}</td>
                  <td className="px-4 py-3 text-stone-400 text-xs">{new Date(f.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${f.paid?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                      {f.paid?'Paid':'Unpaid'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!f.paid && (
                      <div className="flex gap-2">
                        <button onClick={()=>markPaid(f.id)} className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700">Mark Paid</button>
                        <button onClick={()=>waive(f.id)} className="text-xs bg-stone-500 text-white px-2.5 py-1 rounded-lg hover:bg-stone-600">Waive</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {display.length===0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-stone-400">No fines</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
