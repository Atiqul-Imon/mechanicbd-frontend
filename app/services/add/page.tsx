'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE, post } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';

const CATEGORY_OPTIONS = [
  { value: 'HVAC', label: 'HVAC', icon: '❄️', description: 'Heating, ventilation, and air conditioning services' },
  { value: 'Electrical', label: 'Electrical', icon: '⚡', description: 'Electrical repairs and installations' },
  { value: 'Plumbing', label: 'Plumbing', icon: '🚰', description: 'Plumbing and water system services' },
  { value: 'Appliances', label: 'Appliances', icon: '🔌', description: 'Home appliance repair and maintenance' },
  { value: 'Carpentry', label: 'Carpentry', icon: '🔨', description: 'Woodwork and furniture services' },
  { value: 'Painting', label: 'Painting', icon: '🎨', description: 'Interior and exterior painting services' },
  { value: 'Cleaning', label: 'Cleaning', icon: '🧹', description: 'Professional cleaning services' },
  { value: 'Other', label: 'Other', icon: '🛠️', description: 'Other specialized services' }
];

const SERVICE_AREAS = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'
];

export default function AddServicePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    basePrice: '',
    serviceArea: '',
    estimatedDuration: '',
    specialRequirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-light)] to-[var(--color-bg-warm)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-light)] to-[var(--color-bg-warm)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Authentication Required</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">You must be logged in to add a service.</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-dark)] transition-all duration-200 transform hover:scale-105"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!form.title.trim()) return 'Service title is required';
    if (!form.description.trim()) return 'Service description is required';
    if (!form.category) return 'Please select a category';
    if (!form.basePrice || Number(form.basePrice) <= 0) return 'Please enter a valid base price';
    if (!form.serviceArea.trim()) return 'Service area is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    
    try {
      const response = await post('/services', {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        basePrice: Number(form.basePrice),
        serviceArea: form.serviceArea.trim(),
        estimatedDuration: form.estimatedDuration ? Number(form.estimatedDuration) * 60 : undefined, // Convert hours to minutes
        requirements: form.specialRequirements ? [form.specialRequirements] : undefined
      });
      
      setSuccess('Service added successfully! Your service is pending admin approval and will be visible to customers once approved.');
      setForm({ title: '', description: '', category: '', basePrice: '', serviceArea: '', estimatedDuration: '', specialRequirements: '' });
      setCurrentStep(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && (!form.title || !form.category)) {
      setError('Please fill in the service title and category to continue');
      return;
    }
    setCurrentStep(currentStep + 1);
    setError('');
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-light)] to-[var(--color-bg-warm)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)]">
            <li>
              <button
                onClick={() => router.push('/')}
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                Home
              </button>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <button
                onClick={() => router.push('/services')}
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                Services
              </button>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[var(--color-primary)] font-medium">Add Service</span>
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-primary)] rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-2">Add New Service</h1>
          <p className="text-[var(--color-text-secondary)] text-lg">Create a professional service listing to reach more customers</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Basic Info</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Details</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">
                    Service Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Professional AC Installation Service"
                    maxLength={100}
                    required
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {form.title.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {CATEGORY_OPTIONS.map((category) => (
                      <label
                        key={category.value}
                        className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                          form.category === category.value
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                            : 'border-gray-200 hover:border-[var(--color-primary)]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={form.category === category.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <div className="font-semibold text-[var(--color-text-main)]">
                              {category.label}
                            </div>
                            <div className="text-xs text-[var(--color-text-secondary)]">
                              {category.description}
                            </div>
                          </div>
                        </div>
                        {form.category === category.value && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!form.title || !form.category}
                    className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-dark)] transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Service Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">
                    Service Description *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 resize-none"
                    rows={4}
                    placeholder="Describe your service in detail. Include what you offer, your expertise, and what customers can expect..."
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {form.description.length}/1000 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">
                      Base Price (BDT) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)]">৳</span>
                      <input
                        name="basePrice"
                        type="number"
                        min="0"
                        value={form.basePrice}
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">
                      Service Area *
                    </label>
                    <select
                      name="serviceArea"
                      value={form.serviceArea}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select service area</option>
                      {SERVICE_AREAS.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">
                      Estimated Duration (hours)
                    </label>
                    <input
                      name="estimatedDuration"
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={form.estimatedDuration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">
                      Special Requirements
                    </label>
                    <input
                      name="specialRequirements"
                      value={form.specialRequirements}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Customer must provide materials"
                    />
                  </div>
                </div>

                {/* Error and Success Messages */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-red-700 font-medium">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-700 font-medium">{success}</span>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-[var(--color-text-main)] rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-dark)] transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Adding Service...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Service</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4 flex items-center">
            <svg className="w-5 h-5 text-[var(--color-primary)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tips for a Great Service Listing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--color-text-secondary)]">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 flex-shrink-0"></div>
              <span>Be specific about what you offer and your expertise</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 flex-shrink-0"></div>
              <span>Set competitive pricing based on market rates</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 flex-shrink-0"></div>
              <span>Include any special requirements or materials needed</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 flex-shrink-0"></div>
              <span>Your service will be reviewed by admin before going live</span>
            </div>
          </div>
        </div>

        {/* Success State */}
        {success && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Service Added Successfully!</h3>
            <p className="text-green-700 mb-4">{success}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setForm({ title: '', description: '', category: '', basePrice: '', serviceArea: '', estimatedDuration: '', specialRequirements: '' });
                  setCurrentStep(1);
                  setSuccess('');
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200"
              >
                Add Another Service
              </button>
              <button
                onClick={() => router.push('/dashboard/mechanic')}
                className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[var(--color-primary-dark)] transition-all duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 