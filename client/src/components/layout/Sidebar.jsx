import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Users, ArrowLeftRight, AlertTriangle, BarChart2, LogOut, Search, FileText, Home } from 'lucide-react';

const adminLinks = [
  { to: '/admin/dashboard', icon: Home,          label: 'Dashboard' },
  { to: '/admin/books',     icon: BookOpen,       label: 'Books' },
  { to: '/admin/members',   icon: Users,          label: 'Members' },
  { to: '/admin/reports',   icon: BarChart2,      label: 'Reports' },
];

const libLinks = [
  { to: '/librarian/dashboard',   icon: Home,           label: 'Dashboard' },
  { to: '/librarian/catalog',     icon: BookOpen,       label: 'Catalog' },
  { to: '/librarian/circulation', icon: ArrowLeftRight, label: 'Circulation' },
  { to: '/librarian/members',     icon: Users,          label: 'Members' },
  { to: '/librarian/fines',       icon: AlertTriangle,  label: 'Fines' },
];

const studentLinks = [
  { to: '/student/dashboard', icon: Home,    label: 'Dashboard' },
  { to: '/student/search',    icon: Search,  label: 'Search Books' },
  { to: '/student/loans',     icon: FileText,label: 'My Loans' },
  { to: '/student/fines',     icon: AlertTriangle, label: 'My Fines' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'admin' ? adminLinks : user?.role === 'librarian' ? libLinks : studentLinks;

  return (
    <aside className="w-56 bg-stone-900 min-h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="px-5 py-5 border-b border-stone-700">
        <h1 className="text-amber-400 font-bold text-lg tracking-wide font-serif">CampusLib</h1>
        <p className="text-stone-400 text-xs mt-0.5 capitalize">{user?.role} Portal</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
               ${isActive ? 'bg-red-900 text-white' : 'text-stone-400 hover:text-white hover:bg-stone-800'}`
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-stone-700">
        <div className="text-stone-300 text-xs font-medium mb-1 truncate">{user?.name}</div>
        <div className="text-stone-500 text-xs truncate mb-3">{user?.email}</div>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2 text-stone-400 hover:text-red-400 text-xs transition">
          <LogOut size={14}/> Sign out
        </button>
      </div>
    </aside>
  );
}
