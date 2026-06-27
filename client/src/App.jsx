import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';

// Admin
import AdminDashboard      from './pages/admin/Dashboard';
import AdminManageBooks    from './pages/admin/ManageBooks';
import AdminManageMembers  from './pages/admin/ManageMembers';
import AdminReports        from './pages/admin/Reports';

// Librarian
import LibDashboard   from './pages/librarian/Dashboard';
import LibCatalog     from './pages/librarian/Catalog';
import LibCirculation from './pages/librarian/Circulation';
import LibMembers     from './pages/librarian/Members';
import LibFines       from './pages/librarian/Fines';

// Student
import StudentDashboard from './pages/student/Dashboard';
import StudentMyLoans   from './pages/student/MyLoans';
import StudentMyFines   from './pages/student/MyFines';
import StudentSearch    from './pages/student/SearchBooks';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading…</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin')     return <Navigate to="/admin/dashboard" />;
  if (user.role === 'librarian') return <Navigate to="/librarian/dashboard" />;
  return <Navigate to="/student/dashboard" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomeRedirect />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/books"     element={<PrivateRoute roles={['admin']}><AdminManageBooks /></PrivateRoute>} />
          <Route path="/admin/members"   element={<PrivateRoute roles={['admin']}><AdminManageMembers /></PrivateRoute>} />
          <Route path="/admin/reports"   element={<PrivateRoute roles={['admin']}><AdminReports /></PrivateRoute>} />

          {/* Librarian */}
          <Route path="/librarian/dashboard"   element={<PrivateRoute roles={['admin','librarian']}><LibDashboard /></PrivateRoute>} />
          <Route path="/librarian/catalog"     element={<PrivateRoute roles={['admin','librarian']}><LibCatalog /></PrivateRoute>} />
          <Route path="/librarian/circulation" element={<PrivateRoute roles={['admin','librarian']}><LibCirculation /></PrivateRoute>} />
          <Route path="/librarian/members"     element={<PrivateRoute roles={['admin','librarian']}><LibMembers /></PrivateRoute>} />
          <Route path="/librarian/fines"       element={<PrivateRoute roles={['admin','librarian']}><LibFines /></PrivateRoute>} />

          {/* Student */}
          <Route path="/student/dashboard" element={<PrivateRoute roles={['student']}><StudentDashboard /></PrivateRoute>} />
          <Route path="/student/loans"     element={<PrivateRoute roles={['student']}><StudentMyLoans /></PrivateRoute>} />
          <Route path="/student/fines"     element={<PrivateRoute roles={['student']}><StudentMyFines /></PrivateRoute>} />
          <Route path="/student/search"    element={<PrivateRoute roles={['student']}><StudentSearch /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
