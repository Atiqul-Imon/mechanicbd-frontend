'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { get, post } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';
import PageLoader from '../../../components/PageLoader';
import ErrorMessage from '../../../components/ErrorMessage';

interface Service {
  _id: string;
  title: string;
  description: string;
  basePrice: number;
  category: string;
  serviceArea: string;
  mechanic: {
    _id: string;
    fullName: string;
    profilePhoto?: string;
    averageRating?: number;
    totalReviews?: number;
  };
}

interface BookingForm {
  scheduledDate: string;
  scheduledTime: string;
  serviceLocation: string;
  customerNotes: string;
  serviceRequirements: string;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<BookingForm>({
    scheduledDate: '',
    scheduledTime: '',
    serviceLocation: '',
    customerNotes: '',
    serviceRequirements: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchService = async () => {
      if (!params.serviceId) return;
      
      setLoading(true);
      setError('');
      try {
        const response = await get(`/services/${params.serviceId}`);
        setService(response.data.data.service);
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setFormData(prev => ({
          ...prev,
          scheduledDate: tomorrow.toISOString().split('T')[0]
        }));
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch service details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.serviceId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    // Frontend validation
    if (!formData.scheduledDate || !formData.scheduledTime || !formData.serviceLocation) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const bookingData = {
        serviceId: service._id,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        serviceLocation: { address: formData.serviceLocation }, // Always send as object
        customerNotes: formData.customerNotes,
        serviceRequirements: formData.serviceRequirements
      };

      const response = await post('/bookings', bookingData);
      router.push(`/booking/confirmation/${response.data.data.booking._id}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <ErrorMessage
        title="Authentication Required"
        message="Please login to book this service."
        icon="🔒"
        backUrl="/login"
        backText="Login"
      />
    );
  }

  if (loading) {
    return <PageLoader message="Loading service details..." />;
  }

  if (error && !service) {
    return (
      <ErrorMessage
        title="Failed to Load Service"
        message={error}
        icon="❌"
        backUrl="/services"
        backText="Back to Services"
      />
    );
  }

  if (!service) {
    return (
      <ErrorMessage
        title="Service Not Found"
        message="The service you're looking for doesn't exist."
        icon="🔍"
        backUrl="/services"
        backText="Back to Services"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
            <li><Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/services" className="hover:text-[var(--color-primary)] transition-colors">Services</Link></li>
            <li>/</li>
            <li><Link href={`/services/${service._id}`} className="hover:text-[var(--color-primary)] transition-colors">{service.title}</Link></li>
            <li>/</li>
            <li className="text-[var(--color-text-main)]">Book Service</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-6">Book Service</h1>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date and Time Selection */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="scheduledDate" className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="scheduledDate"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="scheduledTime" className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
                      Preferred Time *
                    </label>
                    <select
                      id="scheduledTime"
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    >
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Service Location */}
                <div>
                  <label htmlFor="serviceLocation" className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
                    Service Location *
                  </label>
                  <textarea
                    id="serviceLocation"
                    name="serviceLocation"
                    value={formData.serviceLocation}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Enter your full address where the service will be performed"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>

                {/* Service Requirements */}
                <div>
                  <label htmlFor="serviceRequirements" className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
                    Service Requirements
                  </label>
                  <textarea
                    id="serviceRequirements"
                    name="serviceRequirements"
                    value={formData.serviceRequirements}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe any specific requirements or details about the service needed"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>

                {/* Customer Notes */}
                <div>
                  <label htmlFor="customerNotes" className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="customerNotes"
                    name="customerNotes"
                    value={formData.customerNotes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any additional information you'd like to share with the mechanic"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[var(--color-primary)] text-white py-4 rounded-lg font-semibold hover:bg-[var(--color-primary-dark)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {submitting ? 'Creating Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Service Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-[var(--color-text-main)] mb-4">Service Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-[var(--color-text-main)]">{service.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{service.category}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text-secondary)]">Base Price:</span>
                    <span className="text-2xl font-bold text-[var(--color-primary)]">৳{service.basePrice}</span>
                  </div>
                </div>
                
                <div className="bg-[var(--color-bg-surface)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text-main)] mb-2">Mechanic</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                      <span className="text-[var(--color-primary)] font-semibold">
                        {service.mechanic.fullName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-text-main)]">{service.mechanic.fullName}</p>
                      {service.mechanic.averageRating && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-[var(--color-text-secondary)]">
                            {service.mechanic.averageRating.toFixed(1)} ({service.mechanic.totalReviews} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-[var(--color-text-muted)]">
                  <p>• Free consultation included</p>
                  <p>• Professional service guarantee</p>
                  <p>• 24/7 customer support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 