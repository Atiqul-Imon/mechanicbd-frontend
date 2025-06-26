'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { get } from '../../../utils/api';
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

export default function ServiceDetailPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
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
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch service details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.id]);

  if (loading) {
    return <PageLoader message="Loading service details..." />;
  }

  if (error) {
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
            <li className="text-[var(--color-text-main)]">{service.title}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Service Header */}
          <div className="h-64 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary-dark)]/10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">🔧</div>
              <h1 className="text-3xl font-bold text-[var(--color-text-main)]">{service.title}</h1>
            </div>
          </div>

          <div className="p-8">
            {/* Service Info */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <span className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium rounded-full">
                    {service.category}
                  </span>
                  <span className="flex items-center text-[var(--color-text-secondary)]">
                    📍 {service.serviceArea}
                  </span>
                </div>
                
                <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mb-4">Service Description</h2>
                <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">{service.description}</p>
                
                <div className="bg-[var(--color-bg-surface)] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">Service Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[var(--color-text-muted)]">Category:</span>
                      <p className="font-medium text-[var(--color-text-main)]">{service.category}</p>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-muted)]">Service Area:</span>
                      <p className="font-medium text-[var(--color-text-main)]">{service.serviceArea}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-[var(--color-bg-surface)] rounded-lg p-6 h-fit">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">৳{service.basePrice}</div>
                  <div className="text-[var(--color-text-secondary)]">Base Price</div>
                </div>
                
                {isAuthenticated ? (
                  <Link
                    href={`/book/${service._id}`}
                    className="block w-full bg-[var(--color-primary)] text-white text-center py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-200 font-medium mb-4 transform hover:scale-105"
                  >
                    Book Now
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full bg-[var(--color-primary)] text-white text-center py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-200 font-medium mb-4 transform hover:scale-105"
                  >
                    Login to Book
                  </Link>
                )}
                
                <div className="text-center text-sm text-[var(--color-text-muted)]">
                  Free consultation included
                </div>
              </div>
            </div>

            {/* Mechanic Info */}
            {service.mechanic && (
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-semibold text-[var(--color-text-main)] mb-6">About the Mechanic</h3>
                <div className="bg-[var(--color-bg-surface)] rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                      <span className="text-[var(--color-primary)] font-semibold text-xl">
                        {service.mechanic.fullName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-[var(--color-text-main)]">{service.mechanic.fullName}</h4>
                      {service.mechanic.averageRating && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1 font-medium">{service.mechanic.averageRating.toFixed(1)}</span>
                          </div>
                          <span className="text-[var(--color-text-muted)]">({service.mechanic.totalReviews} reviews)</span>
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