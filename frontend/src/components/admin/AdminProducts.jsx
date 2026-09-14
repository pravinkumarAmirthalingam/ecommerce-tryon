import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, Package } from 'lucide-react';
import { productAPI } from '../../services/api';
import ProductForm from './ProductForm';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        console.error('Failed to delete product', err);
        alert('Failed to delete product');
      }
    }
  };

  const handleOpenForm = (product = null) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    fetchProducts();
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-wider uppercase text-white">Products Management</h1>
        <button 
          onClick={() => handleOpenForm()}
          className="bg-luxury-gold text-black px-4 py-2 rounded-lg flex items-center justify-center hover:bg-[#A68A56] transition-colors shadow-sm font-medium tracking-wide uppercase text-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-[#111111] rounded-xl shadow-sm border border-[#333333] overflow-hidden">
        <div className="p-4 border-b border-[#333333]">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-luxury-textSecondary" />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] text-white border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold placeholder-gray-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A] text-luxury-textSecondary text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Size</th>
                <th className="p-4 font-medium">Color</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-luxury-textSecondary">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-luxury-gold" />
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-luxury-textSecondary">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] overflow-hidden border border-[#333333] flex-shrink-0">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 m-3 text-[#A0A0A0]" />
                          )}
                        </div>
                        <span className="font-medium text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#A0A0A0]">₹{Number(product.price).toFixed(2)}</td>
                    <td className="p-4 text-[#A0A0A0]">{product.size || '-'}</td>
                    <td className="p-4 text-[#A0A0A0] capitalize">{product.color || '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenForm(product)}
                          className="p-2 text-luxury-gold hover:bg-luxury-gold/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <ProductForm 
          product={editingProduct} 
          onClose={handleCloseForm} 
          onSuccess={handleFormSuccess} 
        />
      )}
    </div>
  );
};

export default AdminProducts;
