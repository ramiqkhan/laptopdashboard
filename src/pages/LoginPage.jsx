import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const VALID_EMAIL = "i";
  const VALID_PASSWORD = "123";

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.email === VALID_EMAIL && formData.password === VALID_PASSWORD) {
      // --- CRITICAL UPDATE: Set auth state ---
      localStorage.setItem('isLoggedIn', 'true'); 
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2 text-sm">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
              <input 
                type="text"
                required
                placeholder="Enter email"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-slate-800"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <a href="#" className="text-xs font-medium text-[#D4AF37] hover:underline">Forgot?</a>
            </div>
            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-slate-800"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 animate-pulse text-center">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 text-green-600 text-sm p-4 rounded-xl border border-green-100 text-center">
              Successfully logged in! Redirecting...
            </div>
          )}

          <button 
            type="submit"
            disabled={success}
            className={`w-full ${success ? 'bg-slate-400' : 'bg-[#D4AF37] hover:bg-[#b8962d]'} text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#D4AF37]/30 flex items-center justify-center gap-2 group transition-all active:scale-[0.98]`}
          >
            {success ? 'Loading...' : 'Sign In'}
            {!success && <FaArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-8">
          Don't have an account? <a href="#" className="text-[#D4AF37] font-semibold hover:underline">Sign up</a>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;