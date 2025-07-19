import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navbar';
import Footer from '../components/Footer';

interface LoginPageProps {
  onLoginSuccess: () => void; 
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', form: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState('');

  const validateEmail = (email: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email) ? '' : 'Invalid email format';
  };

  const validatePassword = (password: string) => {
    return password.length >= 6 ? '' : 'Password must be at least 6 characters';
  };

  const validateLoginForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({ email: emailError, password: passwordError, form: '' });
    return !(emailError || passwordError);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setErrors(prev => ({ ...prev, form: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLoginForm()) {
        setErrors(prev => ({ ...prev, form: 'Please correct the errors in the form.' }));
        return;
    }

    setLoading(true);
    setErrors(prev => ({ ...prev, form: '' }));
    setToast(''); 

    try {
      const res = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        throw new Error(`Server responded with status ${res.status}, but no valid JSON. Please try again.`);
      }

      if (!res.ok) {
        throw new Error(data?.message || `Login failed with status: ${res.status}`);
      }

      localStorage.setItem('token', data.token);
      setToast('Login successful!'); 
      onLoginSuccess();

    } catch (err: any) {
      setErrors(prev => ({ ...prev, form: err.message || 'An unexpected error occurred. Please try again.' }));
      setToast(''); 
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out';

  const buttonClass =
    'w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out shadow-md focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mt-12 space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-center text-purple-700">Login to Zeen</h2>
            <p className="text-sm text-center text-gray-500 mt-2">Enter your credentials to continue</p>
          </div>

          {errors.form && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-400 rounded-md text-sm">
              {errors.form}
            </div>
          )}

          {toast && (
            <div className="p-3 bg-green-50 text-green-700 border border-green-400 rounded-md text-sm animate-fadeIn">
              {toast}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                autoFocus
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-10`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-purple-600 font-bold hover:text-purple-800 focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className={`${buttonClass} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            Don't have an account?{' '}
            <button
              type="button" 
              onClick={() => navigate('/signup')} 
              className="text-purple-600 font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}