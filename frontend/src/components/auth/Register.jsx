import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { authAPI } from '../../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await authAPI.register(name, email, password);
      setSuccess("Account created successfully. Redirecting to login...");
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        // Backend returns a string error for duplicate email sometimes
        setError(typeof err.response.data === 'string' ? err.response.data : "Registration failed.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      <div className="space-y-4">
        
        <div>
          <label className="block text-luxury-textSecondary text-sm mb-2 font-medium">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-800 text-luxury-textPrimary rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-colors"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-luxury-textSecondary text-sm mb-2 font-medium">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-800 text-luxury-textPrimary rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-colors"
              placeholder="you@example.com"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-luxury-textSecondary text-sm mb-2 font-medium">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-800 text-luxury-textPrimary rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800/50 text-red-200 text-sm rounded-lg p-3 text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 border border-green-800/50 text-green-200 text-sm rounded-lg p-3 text-center">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || success}
        className="w-full bg-transparent border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black font-semibold rounded-lg py-3 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
        {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
      </button>

      <div className="text-center mt-6">
        <p className="text-luxury-textSecondary text-sm">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-luxury-gold hover:text-luxury-goldHover transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Register;
