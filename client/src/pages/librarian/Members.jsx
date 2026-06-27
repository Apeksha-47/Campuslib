import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { getMembers } from '../../services/memberService';
import { Search } from 'lucide-react';

export default function LibMembers() {
  const [members, setMembers] = useState([]);
  const [q, setQ]             = useState('');
  const [loading, setLoad]    = useState(true);

  const load = (query='') => { setLoad(true); getMembers({q:query}).then(r=>{setMembers(r.data.data);setLoad(false);}); };
  useEffect(() => { load(); }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold font-serif text-stone-800 mb-6">Members</h2>
      <div className="relative max-w-sm mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/>
        <input value={q} onChange={e=>{setQ(e.target.value);load(e.target.value);}} placeholder="Search…"
          className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-red-800"/>
      </div>
      {loading?<Loader/>:(
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs text-stone-500 uppercase border-b">
              <tr>{['Name','College ID','Dept','Email','Status'].map(h=><th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {members.map(m=>(
                <tr key={m.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-800">{m.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-500">{m.college_id||'—'}</td>
                  <td className="px-4 py-3 text-stone-500">{m.department||'—'}</td>
                  <td className="px-4 py-3 text-stone-500">{m.email}</td>
                  <td className="px-4 py-3"><Badge status={m.is_active?'active':'returned'}/></td>
                </tr>
              ))}
              {members.length===0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-stone-400">No members found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
