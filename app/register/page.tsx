'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { post } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import PasswordInput from '../../components/PasswordInput';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', email: '', password: '', role: 'customer', skills: [], experience: '', hourlyRate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'select-multiple') {
      const options = (e.target as HTMLSelectElement).options;
      const values = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          values.push(options[i].value);
        }
      }
      setForm({ ...form, [name]: values });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Prepare payload
      const payload: any = { ...form };
      if (form.role !== 'mechanic') {
        if ('skills' in payload) delete payload.skills;
        if ('experience' in payload) delete payload.experience;
        if ('hourlyRate' in payload) delete payload.hourlyRate;
      }
      const response = await post('/auth/register', payload);
      login(response.data.token, response.data.data.user);
      // Handle robust redirect
      const redirect = searchParams.get('redirect');
      if (redirect && redirect.startsWith('/')) {
        router.replace(redirect);
      } else {
        router.replace('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-background-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary">Create Account</h2>
            <p className="mt-2 text-text-secondary">Join Mechanic BD and get started</p>
          </div>
          
          {error && (
            <div className="bg-warning/10 border border-warning/20 text-warning px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-text-primary text-sm font-semibold mb-2">
                Register as *
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              >
                <option value="customer">Customer</option>
                <option value="mechanic">Mechanic</option>
              </select>
            </div>
            
            <div>
              <label className="block text-text-primary text-sm font-semibold mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-text-primary text-sm font-semibold mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="e.g., 01712345678"
                required
              />
            </div>
            
            <div>
              <label className="block text-text-primary text-sm font-semibold mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Enter your email"
              />
            </div>
            
            <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              label="Password *"
              autoComplete="new-password"
              required
            />
            
            {/* Mechanic-specific fields */}
            {form.role === 'mechanic' && (
              <>
                <div>
                  <label className="block text-text-primary text-sm font-semibold mb-2">
                    Skills (select multiple)
                  </label>
                  <select
                    name="skills"
                    multiple
                    value={form.skills}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    required
                  >
                    <option value="HVAC">HVAC</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Painting">Painting</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-text-primary text-sm font-semibold mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="e.g., 5"
                    min={0}
                    max={50}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-text-primary text-sm font-semibold mb-2">
                    Hourly Rate (BDT) *
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={form.hourlyRate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="e.g., 500"
                    min={0}
                    required
                  />
                </div>
              </>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:text-primary-dark font-semibold">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 