import React, { useEffect, useState } from 'react';
import { Package, ShoppingBag, Users, IndianRupee } from 'lucide-react';
import { productAPI, userAPI, orderAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, users, orders] = await Promise.all([
          productAPI.getAllProducts(),
          userAPI.getAllUsers(),
          orderAPI.getAllOrders()
        ]);
        
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        setStats({ 
          totalProducts: products.length,
          totalCustomers: users.length,
          totalOrders: orders.length,
          revenue: totalRevenue
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-luxury-gold border-luxury-gold/30 bg-luxury-gold/10' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-luxury-gold border-luxury-gold/30 bg-luxury-gold/10' },
    { title: 'Customers', value: stats.totalCustomers, icon: Users, color: 'text-luxury-gold border-luxury-gold/30 bg-luxury-gold/10' },
    { title: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, icon: IndianRupee, color: 'text-luxury-gold border-luxury-gold/30 bg-luxury-gold/10' },
  ];

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold tracking-wider uppercase text-white">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-[#111111] rounded-xl shadow-sm border border-[#333333] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-luxury-textSecondary mb-1 tracking-wide uppercase">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg border ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#111111] rounded-xl shadow-sm border border-[#333333] p-6 mt-8">
        <h2 className="text-lg font-semibold text-luxury-gold tracking-widest uppercase mb-4">Welcome to Admin Portal</h2>
        <p className="text-luxury-textSecondary leading-relaxed">
          Use the sidebar to manage your store's catalog and view data. 
          Currently, the Products module is fully functional, allowing you to add, edit, and delete products, as well as upload their images.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
