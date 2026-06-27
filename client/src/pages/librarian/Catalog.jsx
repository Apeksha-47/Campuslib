import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { getBooks, createBook, updateBook } from '../../services/bookService';
import { Plus, Search, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

const GENRES = ['Fiction','Non-Fiction','Science Fiction','History','Biography','Reference','Science','Technology','Philosophy','Other'];
const empty = { isbn:'',title:'',author:'',publisher:'',year:'',genre:'Fiction',dewey_class:'',total_copies:1 };

export default function LibCatalog() {
  const [books,setBooks]=useState([]);
  const [q,setQ]=useState('');
  const [loading,setLoad]=useState(true);
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState(empty);
  const [editId,setEditId]=useState(null);

  const load=(query='')=>{setLoad(true);getBooks({q:query}).then(r=>{setBooks(r.data.data);setLoad(false);});};
  useEffect(()=>{load();},[]);

  const handleSave=async()=>{
    try{
      if(editId){await updateBook(editId,form);toast.success('Updated');}
      else{await createBook(form);toast.success('Book added');}
      setModal(false);load(q);
    }catch(e){toast.error(e.response?.data?.message||'Error');}
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-serif text-stone-800">Catalog</h2>
        <button onClick={()=>{setForm(empty);setEditId(null);setModal(true);}} className="flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-800">
          <Plus size={16}/> Add Book
        </button>
      </div>
      <div className="relative max-w-sm mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/>
        <input value={q} onChange={e=>{setQ(e.target.value);load(e.target.value);}} placeholder="Search…"
          className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-red-800"/>
      </div>
      {loading?<Loader/>:(
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs text-stone-500 uppercase border-b">
              <tr>{['Title','Author','Genre','Copies','Status',''].map(h=><th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {books.map(b=>(
                <tr key={b.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-800">{b.title}</td>
                  <td className="px-4 py-3 text-stone-600">{b.author}</td>
                  <td className="px-4 py-3 text-stone-500">{b.genre}</td>
                  <td className="px-4 py-3 text-stone-600">{b.avail_copies}/{b.total_copies}</td>
                  <td className="px-4 py-3"><Badge status={b.avail_copies>0?'available':'borrowed'}/></td>
                  <td className="px-4 py-3"><button onClick={()=>{setForm(b);setEditId(b.id);setModal(true);}} className="text-stone-400 hover:text-blue-600"><Pencil size={15}/></button></td>
                </tr>
              ))}
              {books.length===0&&<tr><td colSpan={6} className="px-4 py-10 text-center text-stone-400">No books found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {modal&&(
        <Modal title={editId?'Edit Book':'Add Book'} onClose={()=>setModal(false)}>
          <div className="grid grid-cols-2 gap-3">
            {[['title','Title'],['author','Author'],['isbn','ISBN'],['publisher','Publisher'],['year','Year'],['dewey_class','Dewey']].map(([k,l])=>(
              <div key={k}><label className="block text-xs text-stone-500 mb-1">{l}</label>
              <input value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-800"/></div>
            ))}
            <div><label className="block text-xs text-stone-500 mb-1">Genre</label>
            <select value={form.genre} onChange={e=>setForm({...form,genre:e.target.value})}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-800">
              {GENRES.map(g=><option key={g}>{g}</option>)}</select></div>
            <div><label className="block text-xs text-stone-500 mb-1">Copies</label>
            <input type="number" min={1} value={form.total_copies} onChange={e=>setForm({...form,total_copies:e.target.value})}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-800"/></div>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button onClick={()=>setModal(false)} className="px-4 py-2 text-sm border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-red-900 text-white rounded-lg hover:bg-red-800">Save</button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
