import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-luxury-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-luxury-secondary rounded-2xl shadow-2xl overflow-hidden border border-gray-800 transition-all">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-wider text-luxury-textPrimary mb-2">
              LUX<span className="text-luxury-gold">URY</span>
            </h1>
            <p className="text-luxury-textSecondary text-sm uppercase tracking-widest">
              Exclusive Access
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
