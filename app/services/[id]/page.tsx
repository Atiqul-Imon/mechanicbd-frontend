'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { get } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';

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

export default function ServiceDetailPage() {
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      if (!params.id) return;
      
      setLoading(true);
      setError('');
      try {
        const response = await get(`/services/${params.id}`);
        setService(response.data.data.service);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch service details');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/services" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-gray-600 mb-4">The service you're looking for doesn't exist.</p>
          <Link href="/services" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-red-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/services" className="hover:text-red-600">Services</Link></li>
            <li>/</li>
            <li className="text-gray-900">{service.title}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Service Header */}
          <div className="h-64 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">🔧</div>
              <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
            </div>
          </div>

          <div className="p-8">
            {/* Service Info */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <span className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                    {service.category}
                  </span>
                  <span className="flex items-center text-gray-600">
                    📍 {service.serviceArea}
                  </span>
                </div>
                
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <p className="font-medium">{service.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Service Area:</span>
                      <p className="font-medium">{service.serviceArea}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-red-50 rounded-lg p-6 h-fit">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-red-600 mb-2">৳{service.basePrice}</div>
                  <div className="text-gray-600">Base Price</div>
                </div>
                
                {isAuthenticated ? (
                  <Link
                    href={`/book/${service._id}`}
                    className="block w-full bg-red-600 text-white text-center py-3 rounded-lg hover:bg-red-700 transition-colors font-medium mb-4"
                  >
                    Book Now
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full bg-red-600 text-white text-center py-3 rounded-lg hover:bg-red-700 transition-colors font-medium mb-4"
                  >
                    Login to Book
                  </Link>
                )}
                
                <div className="text-center text-sm text-gray-500">
                  Free consultation included
                </div>
              </div>
            </div>

            {/* Mechanic Info */}
            {service.mechanic && (
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">About the Mechanic</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold text-xl">
                        {service.mechanic.fullName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{service.mechanic.fullName}</h4>
                      {service.mechanic.averageRating && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1 font-medium">{service.mechanic.averageRating.toFixed(1)}</span>
                          </div>
                          <span className="text-gray-500">({service.mechanic.totalReviews} reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 