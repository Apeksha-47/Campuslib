import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { getMembers, createMember, updateMember } from '../../services/memberService';
import { Plus, Search, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

const empty = { name:'', email:'', college_id:'', department:'', phone:'', role:'student' };

export default function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [q, setQ]             = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState(empty);
  const [editId, setEditId]   = useState(null);

  const load = (query='') => {
    setLoading(true);
    getMembers({ q: query }).then(r => { setMembers(r.data.data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = (m) => { setForm(m); setEditId(m.id); setModal(true); };

  const handleSave = async () => {
    try {
      if (editId) { await updateMember(editId, form); toast.success('Member updated'); }
      else        { await createMember(form);          toast.success('Member added — default password is College ID'); }
      setModal(false); load(q);
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-serif text-stone-800">Members</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-800">
          <Plus size={16}/> Add Member
        </button>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/>
        <input value={q} onChange={e => { setQ(e.target.value); load(e.target.value); }}
          placeholder="Search name, email, roll no…"
          className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-red-800"/>
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs text-stone-500 uppercase tracking-wide border-b">
              <tr>
                {['Name','College ID','Dept','Email','Role','Status',''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-800">{m.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-500">{m.college_id || '—'}</td>
                  <td className="px-4 py-3 text-stone-500">{m.department || '—'}</td>
                  <td className="px-4 py-3 text-stone-500">{m.email}</td>
                  <td className="px-4 py-3"><Badge status={m.role}/></td>
                  <td className="px-4 py-3"><Badge status={m.is_active ? 'active' : 'returned'}/></td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(m)} className="text-stone-400 hover:text-blue-600"><Pencil size={15}/></button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-stone-400">No members found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={editId ? 'Edit Member' : 'Add Member'} onClose={() => setModal(false)}>
          <div className="grid grid-cols-2 gap-3">
            {[['name','Full Name'],['email','Email'],['college_id','College ID / Roll No'],['department','Department'],['phone','Phone']].map(([key,label]) => (
              <div key={key} className={key==='email'||key==='name' ? 'col-span-2':''}>
                <label className="block text-xs text-stone-500 mb-1">{label}</label>
                <input value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-800"/>
              </div>
            ))}
            {!editId && (
              <div>
                <label className="block text-xs text-stone-500 mb-1">Role</label>
                <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-800">
                  <option value="student">Student</option>
                  <option value="librarian">Librarian</option>
                </select>
              </div>
            )}
            {editId && (
              <div>
                <label className="block text-xs text-stone-500 mb-1">Status</label>
                <select value={form.is_active} onChange={e=>setForm({...form,is_active:e.target.value==='true'})}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-800">
                  <option value="true">Active</option>
                  <option value="false">Suspended</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button onClick={()=>setModal(false)} className="px-4 py-2 text-sm text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-red-900 text-white rounded-lg hover:bg-red-800">Save</button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
