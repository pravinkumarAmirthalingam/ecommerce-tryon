import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  LogOut, 
  Menu,
  X,
  Home
} from 'lucide-react';
import { authAPI } from '../../services/api';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authAPI.logout();
    navigate('/auth/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package }
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#111111] border-r border-[#333333]">
      <div className="p-6 border-b border-[#333333] flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-wider uppercase">Admin Panel</h2>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden text-luxury-textSecondary hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-luxury-gold/10 text-luxury-gold' 
                  : 'text-luxury-textSecondary hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium tracking-wide uppercase text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#333333] space-y-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-luxury-textSecondary hover:bg-white/5 hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium tracking-wide uppercase text-sm">Go to Store</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium tracking-wide uppercase text-sm">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-bg flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar for mobile */}
        <header className="bg-[#111111] border-b border-[#333333] h-16 flex items-center justify-between px-4 lg:hidden">
          <h1 className="text-xl font-bold text-white tracking-wider uppercase">Admin</h1>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-luxury-textSecondary hover:text-white p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
