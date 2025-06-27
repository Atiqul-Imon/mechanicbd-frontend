'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE, post } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';

const CATEGORY_OPTIONS = [
  'HVAC', 'Electrical', 'Plumbing', 'Appliances', 'Carpentry', 'Painting', 'Cleaning', 'Other'
];

export default function AddServicePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    basePrice: '',
    serviceArea: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isAuthenticated) {
    return <div className="text-center mt-10 text-red-500">You must be logged in to add a service.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    // Minimal client-side validation
    if (!form.title || !form.description || !form.category || !form.basePrice || !form.serviceArea) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    // Debug log
    console.log('Submitting payload:', {
      title: form.title,
      description: form.description,
      category: form.category,
      basePrice: Number(form.basePrice),
      serviceArea: form.serviceArea
    });
    try {
      const response = await post('/services', {
        title: form.title,
        description: form.description,
        category: form.category,
        basePrice: Number(form.basePrice),
        serviceArea: form.serviceArea
      });
      setSuccess('Service added successfully!');
      setForm({ title: '', description: '', category: '', basePrice: '', serviceArea: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  // Helper to display duration in min/hours
  const getDurationDisplay = (min: string) => {
    const val = Number(min);
    if (!val || val < 15) return '';
    if (val < 60) return `${val} minutes`;
    return `${(val / 60).toFixed(val % 60 === 0 ? 0 : 1)} hours`;
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add New Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" maxLength={100} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} maxLength={1000} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Select category</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Base Price</label>
          <input name="basePrice" type="number" min="0" value={form.basePrice} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Service Area</label>
          <input name="serviceArea" value={form.serviceArea} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800" disabled={loading}>
          {loading ? 'Adding...' : 'Add Service'}
        </button>
      </form>
    </div>
  );
} 