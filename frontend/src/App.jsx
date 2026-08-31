import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from './components/auth/AuthLayout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';

// A simple protected route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

// Admin route wrapper
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  if (role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Navigation Layout wrapper for protected pages
const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    window.location.href = '/auth/login';
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-luxury-bg/90 backdrop-blur-md border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <h1 className="text-2xl font-bold tracking-widest uppercase text-white">
              LUX<span className="text-luxury-gold">URY</span>
            </h1>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest border border-gray-800 rounded px-4 py-2 text-luxury-textSecondary hover:text-white hover:border-gray-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route index element={<Navigate to="login" replace />} />
        </Route>

        {/* Protected Application Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/products/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProductDetails />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
