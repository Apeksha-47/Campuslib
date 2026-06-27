import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { getBooks, createBook, updateBook, deleteBook } from '../../services/bookService';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const empty = { isbn:'', title:'', author:'', publisher:'', year:'', genre:'Fiction', dewey_class:'', total_copies:1 };
const GENRES = ['Fiction','Non-Fiction','Science Fiction','History','Biography','Reference','Science','Technology','Philosophy','Other'];

export default function ManageBooks() {
  const [books, setBooks]   = useState([]);
  const [q, setQ]           = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null); // null | 'add' | 'edit'
  const [form, setForm]     = useState(empty);
  const [editId, setEditId] = useState(null);

  const load = (query='') => {
    setLoading(true);
    getBooks({ q: query }).then(r => { setBooks(r.data.data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(empty); setEditId(null); setModal('form'); };
  const openEdit = (b) => { setForm({ ...b, total_copies: b.total_copies }); setEditId(b.id); setModal('form'); };

  const handleSave = async () => {
    try {
      if (editId) { await updateBook(editId, form); toast.success('Book updated'); }
      else        { await createBook(form);          toast.success('Book added'); }
      setModal(null); load(q);
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this book?')) return;
    try { await deleteBook(id); toast.success('Deleted'); load(q); }
    catch (e) { toast.error(e.response?.data?.message || 'Cannot delete'); }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-serif text-stone-800">Book Catalog</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-800 transition">
          <Plus size={16}/> Add Book
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/>
          <input value={q} onChange={e => { setQ(e.target.value); load(e.target.value); }}
            placeholder="Search title, author, ISBN…"
            className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-red-800"/>
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs text-stone-500 uppercase tracking-wide border-b">
              <tr>
                {['Title','Author','ISBN','Genre','Copies','Status',''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {books.map(b => (
                <tr key={b.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-800">{b.title}</td>
                  <td className="px-4 py-3 text-stone-600">{b.author}</td>
                  <td className="px-4 py-3 text-stone-400 font-mono text-xs">{b.isbn || '—'}</td>
                  <td className="px-4 py-3 text-stone-500">{b.genre}</td>
                  <td className="px-4 py-3 text-stone-600">{b.avail_copies}/{b.total_copies}</td>
                  <td className="px-4 py-3"><Badge status={b.avail_copies > 0 ? 'available' : 'borrowed'}/></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(b)} className="text-stone-400 hover:text-blue-600"><Pencil size={15}/></button>
                      <button onClick={() => handleDelete(b.id)} className="text-stone-400 hover:text-red-600"><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-stone-400">No books found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal === 'form' && (
        <Modal title={editId ? 'Edit Book' : 'Add New Book'} onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 gap-3">
            {[['title','Title',false],['author','Author',false],['isbn','ISBN',false],['publisher','Publisher',false],['year','Year',false],['dewey_class','Dewey Class',false]].map(([key,label]) => (
              <div key={key}>
                <label className="block text-xs text-stone-500 mb-1">{label}</label>
                <input value={form[key] || ''} onChange={e => setForm({...form,[key]:e.target.value})}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-800"/>
              </div>
            ))}
            <div>
              <label className="block text-xs text-stone-500 mb-1">Genre</label>
              <select value={form.genre} onChange={e => setForm({...form,genre:e.target.value})}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-800">
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Copies</label>
              <input type="number" min={1} value={form.total_copies} onChange={e => setForm({...form,total_copies:e.target.value})}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-800"/>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-red-900 text-white rounded-lg hover:bg-red-800">Save</button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
