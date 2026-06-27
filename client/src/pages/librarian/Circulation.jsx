import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { getActive, getOverdue, checkout, returnBook, renewLoan } from '../../services/circulationService';
import { getBooks } from '../../services/bookService';
import { getMembers } from '../../services/memberService';
import toast from 'react-hot-toast';
import { ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react';

export default function LibCirculation() {
  const [tab, setTab]         = useState('active');
  const [loans, setLoans]     = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoad]    = useState(true);
  const [modal, setModal]     = useState(null); // 'checkout' | 'return'

  // checkout form state
  const [books, setBooks]   = useState([]);
  const [members, setMems]  = useState([]);
  const [selBook, setSelBook] = useState('');
  const [selMember, setSelMem] = useState('');

  const loadData = () => {
    setLoad(true);
    Promise.all([getActive(), getOverdue()])
      .then(([a, o]) => { setLoans(a.data.data); setOverdue(o.data.data); })
      .finally(() => setLoad(false));
  };

  useEffect(() => {
    loadData();
    getBooks({ available: 'true' }).then(r => setBooks(r.data.data));
    getMembers().then(r => setMems(r.data.data));
  }, []);

  const handleCheckout = async () => {
    if (!selBook || !selMember) { toast.error('Select book and member'); return; }
    try {
      await checkout({ book_id: selBook, user_id: selMember });
      toast.success('Book checked out!');
      setModal(null); setSelBook(''); setSelMem('');
      loadData();
      getBooks({ available: 'true' }).then(r => setBooks(r.data.data));
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const handleReturn = async (loan_id) => {
    if (!confirm('Confirm return?')) return;
    try {
      const r = await returnBook(loan_id);
      const fine = r.data.data.fine_amount;
      toast.success(fine > 0 ? `Returned. Fine ₹${fine} added.` : 'Returned successfully!');
      loadData();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const handleRenew = async (loan_id) => {
    try {
      const r = await renewLoan(loan_id);
      toast.success(r.data.message);
      loadData();
    } catch (e) { toast.error(e.response?.data?.message || 'Already renewed / not eligible'); }
  };

  const display = tab === 'active' ? loans : overdue;

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-serif text-stone-800">Circulation Desk</h2>
        <button onClick={() => setModal('checkout')}
          className="flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-800">
          <ArrowDownCircle size={16}/> Check Out Book
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        {[['active', `Active (${loans.length})`], ['overdue', `Overdue (${overdue.length})`]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${tab===t ? 'bg-red-900 text-white' : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <Loader/> : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs text-stone-500 uppercase border-b">
              <tr>
                {['Book','Member','Issued','Due Date', tab==='overdue'?'Days Overdue':'Renewed','Actions'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {display.map(l => {
                const isOverdue = new Date(l.due_date) < new Date();
                return (
                  <tr key={l.id} className={`hover:bg-stone-50 ${isOverdue ? 'bg-red-50/30':''}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-800">{l.title}</p>
                      <p className="text-xs text-stone-400">{l.author}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-stone-700">{l.member_name}</p>
                      <p className="text-xs text-stone-400 font-mono">{l.college_id}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{new Date(l.issued_at).toLocaleDateString('en-IN')}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${isOverdue?'text-red-600':'text-stone-600'}`}>
                      {new Date(l.due_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      {tab==='overdue'
                        ? <span className="text-red-600 font-medium">{l.days_overdue}d</span>
                        : <span className={`text-xs ${l.renewed?'text-stone-400':'text-green-600'}`}>{l.renewed?'Yes':'No'}</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleReturn(l.id)}
                          className="flex items-center gap-1 text-xs bg-green-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-green-700 transition">
                          <ArrowUpCircle size={12}/> Return
                        </button>
                        {!l.renewed && tab==='active' && (
                          <button onClick={() => handleRenew(l.id)}
                            className="flex items-center gap-1 text-xs bg-stone-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-stone-700 transition">
                            <RefreshCw size={12}/> Renew
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {display.length===0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-stone-400">
                  {tab==='overdue' ? '✓ No overdue books!' : 'No active loans'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal === 'checkout' && (
        <Modal title="Check Out Book" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-stone-500 mb-1">Select Member</label>
              <select value={selMember} onChange={e => setSelMem(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-800">
                <option value="">— Choose member —</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.college_id || m.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Select Book (available only)</label>
              <select value={selBook} onChange={e => setSelBook(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-800">
                <option value="">— Choose book —</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>{b.title} — {b.author} ({b.avail_copies} left)</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-stone-400">Loan period: 14 days · Max 3 active loans per member · Unpaid fines block checkout</p>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button onClick={() => setModal(null)} className="px-4 py-2 text-sm border border-stone-300 rounded-lg text-stone-600">Cancel</button>
            <button onClick={handleCheckout} className="px-4 py-2 text-sm bg-red-900 text-white rounded-lg hover:bg-red-800">Confirm Checkout</button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
