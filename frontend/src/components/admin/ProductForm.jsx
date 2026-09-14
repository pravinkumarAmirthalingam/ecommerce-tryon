import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Loader2 } from 'lucide-react';
import { productAPI } from '../../services/api';

const ProductForm = ({ product, onClose, onSuccess }) => {
  const isEditing = !!product;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    size: 'M',
    color: '',
    imageUrl: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        size: product.size || 'M',
        color: product.color || '',
        imageUrl: product.imageUrl || ''
      });
      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      }
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let savedProduct;
      
      // 1. Save product details
      if (isEditing) {
        savedProduct = await productAPI.updateProduct(product.id, formData);
      } else {
        savedProduct = await productAPI.createProduct(formData);
      }

      // 2. Upload image if a new file was selected
      if (imageFile) {
        await productAPI.uploadProductImage(savedProduct.id, imageFile);
      }

      onSuccess();
    } catch (err) {
      console.error('Failed to save product', err);
      let errorMessage = 'Failed to save product';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#111111] rounded-xl shadow-xl w-full max-w-2xl overflow-hidden my-auto border border-[#333333]">
        <div className="flex items-center justify-between p-6 border-b border-[#333333]">
          <h2 className="text-xl font-bold tracking-wider uppercase text-white">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button 
            onClick={onClose}
            className="text-luxury-textSecondary hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Col: Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white mb-1 uppercase tracking-wide">Product Image</label>
              <div 
                className="border-2 border-dashed border-[#333333] rounded-xl h-64 flex flex-col items-center justify-center relative overflow-hidden bg-[#1A1A1A] hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => document.getElementById('imageUpload').click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-8 h-8 text-luxury-gold mx-auto mb-2" />
                    <p className="text-sm text-luxury-textSecondary tracking-wide uppercase">Click to upload</p>
                    <p className="text-xs text-[#A0A0A0] mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input 
                  id="imageUpload"
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Right Col: Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1 uppercase tracking-wide">Product Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-[#333333] bg-[#1A1A1A] text-white rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all placeholder-[#555555]"
                  placeholder="e.g. Black Slim Fit Shirt"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1 uppercase tracking-wide">Price (₹)</label>
                <input 
                  type="number" 
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-[#333333] bg-[#1A1A1A] text-white rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all placeholder-[#555555]"
                  placeholder="29.99"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1 uppercase tracking-wide">Size</label>
                  <select 
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#333333] bg-[#1A1A1A] text-white rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all appearance-none"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1 uppercase tracking-wide">Color</label>
                  <input 
                    type="text" 
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#333333] bg-[#1A1A1A] text-white rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all placeholder-[#555555]"
                    placeholder="e.g. Black"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-[#333333] pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-[#333333] text-luxury-textSecondary rounded-lg hover:bg-white/5 transition-colors font-medium tracking-wide uppercase text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-luxury-gold text-black rounded-lg hover:bg-[#A68A56] transition-colors flex items-center shadow-sm disabled:opacity-70 font-medium tracking-wide uppercase text-sm"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save Product</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
