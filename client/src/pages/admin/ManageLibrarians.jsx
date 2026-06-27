import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { getMembers, createMember } from '../../services/memberService';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageLibrarians() {
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoad] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', college_id:'', department:'', phone:'', role:'librarian' });

  const load = () => { setLoad(true); getMembers().then(r => { setLibrarians(r.data.data.filter(m => m.role === 'librarian')); setLoad(false); }); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try { await createMember({ ...form, role: 'librarian' }); toast.success('Librarian added'); setModal(false); load(); }
    catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-serif text-stone-800">Librarians</h2>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-800">
          <Plus size={16}/> Add Librarian
        </button>
      </div>
      {loading ? <Loader /> : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs text-stone-500 uppercase border-b">
              <tr>{['Name','Email','College ID','Department','Status'].map(h=><th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {librarians.map(l=>(
                <tr key={l.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-800">{l.name}</td>
                  <td className="px-4 py-3 text-stone-500">{l.email}</td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-400">{l.college_id||'—'}</td>
                  <td className="px-4 py-3 text-stone-500">{l.department||'—'}</td>
                  <td className="px-4 py-3"><Badge status={l.is_active?'active':'returned'}/></td>
                </tr>
              ))}
              {librarians.length===0&&<tr><td colSpan={5} className="px-4 py-10 text-center text-stone-400">No librarians yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <Modal title="Add Librarian" onClose={() => setModal(false)}>
          <div className="grid grid-cols-2 gap-3">
            {[['name','Full Name'],['email','Email'],['college_id','Staff ID'],['department','Department'],['phone','Phone']].map(([k,l])=>(
              <div key={k} className={k==='name'||k==='email'?'col-span-2':''}>
                <label className="block text-xs text-stone-500 mb-1">{l}</label>
                <input value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-800"/>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button onClick={()=>setModal(false)} className="px-4 py-2 text-sm border border-stone-300 rounded-lg text-stone-600">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-red-900 text-white rounded-lg hover:bg-red-800">Save</button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
