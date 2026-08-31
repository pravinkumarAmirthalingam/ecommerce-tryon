import React, { useEffect, useState } from 'react';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { productAPI } from '../../services/api';

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
        const products = await productAPI.getAllProducts();
        setStats(prev => ({ ...prev, totalProducts: products.length }));
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500' },
    { title: 'Total Orders', value: '124', icon: ShoppingBag, color: 'bg-green-500' },
    { title: 'Customers', value: '45', icon: Users, color: 'bg-purple-500' },
    { title: 'Revenue', value: '$12,450', icon: DollarSign, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Welcome to Admin Portal</h2>
        <p className="text-gray-600">
          Use the sidebar to manage your store's catalog and view data. 
          Currently, the Products module is fully functional, allowing you to add, edit, and delete products, as well as upload their images.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
