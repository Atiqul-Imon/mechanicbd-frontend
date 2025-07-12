'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { post } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = form.identifier.includes('@')
        ? { email: form.identifier, password: form.password }
        : { phoneNumber: form.identifier, password: form.password };
      const response = await post('/auth/login', data);
      login(response.data.token, response.data.data.user);
      // Handle robust redirect
      const redirect = searchParams.get('redirect');
      if (redirect && redirect.startsWith('/')) {
        router.replace(redirect);
      } else {
        router.replace('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-background-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary">Welcome Back</h2>
            <p className="mt-2 text-text-secondary">Sign in to your Mechanic BD account</p>
          </div>
          
          {error && (
            <div className="bg-warning/10 border border-warning/20 text-warning px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-text-primary text-sm font-semibold mb-2">
                Email or Phone Number
              </label>
              <input
                type="text"
                name="identifier"
                value={form.identifier}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Enter email or phone number"
                autoComplete="username"
                required
              />
            </div>
            
            <div>
              <label className="block text-text-primary text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <a href="/register" className="text-primary hover:text-primary-dark font-semibold">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 