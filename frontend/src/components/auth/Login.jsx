import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { authAPI } from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await authAPI.login(email, password);
      // Redirect based on role
      if (data.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response) {
        if (typeof err.response.data === 'string' && err.response.data.length < 100) {
          setError(err.response.data);
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response.status === 403 || err.response.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        setError("Network Error: Could not reach the server. Please ensure the backend is running.");
      } else {
        setError("An unexpected error occurred during login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-4">
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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-luxury-gold hover:bg-luxury-goldHover text-black font-semibold rounded-lg py-3 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Authenticating...' : 'Sign In'}
        {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
      </button>

      <div className="text-center mt-6">
        <p className="text-luxury-textSecondary text-sm">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-luxury-gold hover:text-luxury-goldHover transition-colors font-medium">
            Register here
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Login;
