import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Use a fallback image if imageUrl is null or empty
  // Assuming 192x256 proportions for shirts
  const imageUrl = product.imageUrl || 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
  
  return (
    <Link to={`/products/${product.id}`} className="group block h-full">
      <div className="h-full flex flex-col bg-[#0a0a0a] rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-luxury-gold/50 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(200,169,106,0.12)]">
        
        {/* Image Container with Overflow Hidden for Zoom Effect */}
        <div className="aspect-[3/4] overflow-hidden bg-[#111] relative">
          <img 
            src={imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
        
        {/* Product Details */}
        <div className="p-5 flex flex-col flex-grow justify-between">
          <div>
            <h3 className="text-lg font-medium text-luxury-textPrimary group-hover:text-luxury-gold transition-colors line-clamp-2">
              {product.name}
            </h3>
            {product.color && (
              <p className="text-sm text-luxury-textSecondary mt-1 capitalize">
                {product.color}
              </p>
            )}
          </div>
          
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-800/50">
            <p className="text-xl tracking-wider font-semibold text-white">
              ${Number(product.price).toFixed(2)}
            </p>
            {product.size && (
              <span className="text-xs tracking-widest font-mono uppercase bg-gray-900 border border-gray-700 rounded px-2 py-1 text-gray-300">
                {product.size}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
