import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { getBooks } from '../../services/bookService';
import { Search, Filter } from 'lucide-react';

const GENRES = ['All','Fiction','Non-Fiction','Science Fiction','History','Biography','Reference','Science','Technology','Philosophy','Other'];

export default function StudentSearch() {
  const [books, setBooks]   = useState([]);
  const [q, setQ]           = useState('');
  const [genre, setGenre]   = useState('All');
  const [avail, setAvail]   = useState(false);
  const [loading, setLoad]  = useState(false);

  const load = (query = q, g = genre, a = avail) => {
    setLoad(true);
    const params = {};
    if (query) params.q = query;
    if (g !== 'All') params.genre = g;
    if (a) params.available = 'true';
    getBooks(params).then(r => { setBooks(r.data.data); setLoad(false); });
  };

  useEffect(() => { load(); }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold font-serif text-stone-800 mb-6">Search Books</h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input value={q} onChange={e => { setQ(e.target.value); load(e.target.value); }}
            placeholder="Search by title, author, or ISBN…"
            className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-red-800" />
        </div>
        <select value={genre} onChange={e => { setGenre(e.target.value); load(q, e.target.value); }}
          className="border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-800 bg-white">
          {GENRES.map(g => <option key={g}>{g}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-stone-600 bg-white border border-stone-300 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-stone-50">
          <input type="checkbox" checked={avail} onChange={e => { setAvail(e.target.checked); load(q, genre, e.target.checked); }} />
          Available only
        </label>
      </div>

      {loading ? <Loader /> : (
        <>
          <p className="text-xs text-stone-400 mb-3">{books.length} book{books.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map(b => (
              <div key={b.id} className="bg-white rounded-xl border border-stone-200 p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-stone-800 text-sm leading-tight">{b.title}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{b.author}</p>
                  </div>
                  <Badge status={b.avail_copies > 0 ? 'available' : 'borrowed'} />
                </div>
                <div className="flex flex-wrap gap-2 mt-3 text-xs text-stone-400">
                  {b.genre && <span className="bg-stone-100 px-2 py-0.5 rounded">{b.genre}</span>}
                  {b.year  && <span>{b.year}</span>}
                  {b.dewey_class && <span className="font-mono">{b.dewey_class}</span>}
                </div>
                <p className="text-xs text-stone-400 mt-2">
                  {b.avail_copies} of {b.total_copies} {b.total_copies === 1 ? 'copy' : 'copies'} available
                </p>
              </div>
            ))}
            {books.length === 0 && (
              <div className="col-span-3 text-center py-16 text-stone-400">No books found</div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
