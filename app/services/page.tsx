'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { get } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import PageLoader from '../../components/PageLoader';
import ErrorMessage from '../../components/ErrorMessage';
import AdvancedSearch from '../../components/AdvancedSearch';

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

interface SearchFilters {
  q: string;
  category: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  maxRating: string;
  sortBy: string;
  sortOrder: string;
  priceType: string;
  availability: string;
}

// Mock data for development
const mockServices: Service[] = [
  {
    _id: '1',
    title: 'Professional AC Repair & Maintenance',
    description: 'Expert AC repair, maintenance, and installation services. We handle all major brands with quick response times and guaranteed work.',
    basePrice: 1200,
    category: 'HVAC',
    serviceArea: 'Dhaka, Gulshan',
    mechanic: { _id: 'm1', fullName: 'Ahmed Khan', averageRating: 4.8, totalReviews: 127 },
  },
  {
    _id: '2',
    title: 'Electrical Wiring & Installation',
    description: 'Complete electrical wiring solutions for homes and offices. Licensed electrician with 10+ years experience.',
    basePrice: 800,
    category: 'Electrical',
    serviceArea: 'Dhaka, Banani',
    mechanic: { _id: 'm2', fullName: 'Rahim Ali', averageRating: 4.6, totalReviews: 95 },
  },
  {
    _id: '3',
    title: 'Plumbing & Pipe Repair',
    description: 'Emergency plumbing services, pipe repair, faucet installation, and drain cleaning. Available 24/7.',
    basePrice: 600,
    category: 'Plumbing',
    serviceArea: 'Dhaka, Dhanmondi',
    mechanic: { _id: 'm3', fullName: 'Karim Hassan', averageRating: 4.9, totalReviews: 203 },
  }
];

const categories = [
  { id: 'all', name: 'All Services' },
  { id: 'HVAC', name: 'HVAC' },
  { id: 'Electrical', name: 'Electrical' },
  { id: 'Plumbing', name: 'Plumbing' },
  { id: 'Appliances', name: 'Appliances' },
  { id: 'Carpentry', name: 'Carpentry' },
  { id: 'Painting', name: 'Painting' },
  { id: 'Cleaning', name: 'Cleaning' }
];

export default function ServicesPage() {
  const { user, isAuthenticated } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    q: '',
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    maxRating: '',
    sortBy: 'relevance',
    sortOrder: 'desc',
    priceType: '',
    availability: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    fetchServices();
  }, [searchFilters, selectedCategory]);

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add search filters
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      // Add category filter
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      // Add pagination
      params.append('page', pagination.currentPage.toString());
      params.append('limit', '12');
      
      const response = await get(`/services/search?${params.toString()}`);
      console.log('Services API response:', response);
      
      if (response.data && response.data.data && response.data.data.services) {
        setServices(response.data.data.services);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: response.data.data.services.length,
          hasNext: false,
          hasPrev: false
        });
      } else {
        console.error('Invalid response structure:', response);
        setError('Invalid response structure from API');
        setServices(mockServices);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch services';
      console.error('Services API error:', err);
      setError(errorMessage);
      // Fallback to mock data for development
      setServices(mockServices);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleClear = () => {
    setSearchFilters({
      q: '',
      category: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      maxRating: '',
      sortBy: 'relevance',
      sortOrder: 'desc',
      priceType: '',
      availability: ''
    });
    setSelectedCategory('all');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  if (loading && services.length === 0) {
    return <PageLoader message="Loading services..." />;
  }
  
  if (error && services.length === 0) {
    return (
      <ErrorMessage
        title="Failed to Load Services"
        message={error}
        backUrl="/"
        backText="Go Home"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins !text-white drop-shadow-lg">
              Find Professional Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-accent font-hind">
              দক্ষ এবং বিশ্বস্ত মেকানিকদের সাথে আপনার সমস্যা সমাধান করুন
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Advanced Search Component */}
        <AdvancedSearch 
          onSearch={handleSearch}
          onClear={handleClear}
          initialFilters={searchFilters}
        />
        
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-white text-[var(--color-text-main)] hover:bg-[var(--color-primary)] hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Add Service Button */}
        {isAuthenticated && (user?.role === 'mechanic' || user?.role === 'admin') && (
          <div className="mb-6">
            <Link 
              href="/services/add" 
              className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 font-medium whitespace-nowrap"
            >
              Add Service
            </Link>
          </div>
        )}
        
        {/* Results Summary */}
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-[var(--color-text-secondary)]">
              Showing {services.length} of {pagination.totalItems} services
              {searchFilters.q && (
                <span> for "{searchFilters.q}"</span>
              )}
            </div>
            {pagination.totalPages > 1 && (
              <div className="text-sm text-[var(--color-text-secondary)]">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
            )}
          </div>
        )}
        
        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-[var(--color-text-main)] mb-2">No services found</h3>
            <p className="text-[var(--color-text-secondary)] mb-4">
              {searchFilters.q || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Check back later for available services.'
              }
            </p>
            {(searchFilters.q || selectedCategory !== 'all') && (
              <button
                onClick={handleClear}
                className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1">
                  <div className="h-48 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary-dark)]/5"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-medium rounded-full">
                        {service.category}
                      </span>
                      <span className="text-2xl font-bold text-accent">৳{service.basePrice}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--color-text-main)] mb-2">{service.title}</h3>
                    <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)] mb-4">
                      <span>📍 {service.serviceArea}</span>
                    </div>
                    {service.mechanic && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                          <span className="text-[var(--color-primary)] font-semibold text-sm">
                            {service.mechanic.fullName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text-main)]">{service.mechanic.fullName}</p>
                          {service.mechanic.averageRating && (
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-xs text-[var(--color-text-muted)]">{service.mechanic.averageRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <Link 
                      href={`/services/${service._id}`} 
                      className="block w-full bg-[var(--color-primary)] !text-white text-center py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-200 font-medium transform hover:scale-105"
                    >
                      View Details & Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1;
                    const isCurrent = page === pagination.currentPage;
                    const isNearCurrent = Math.abs(page - pagination.currentPage) <= 1;
                    
                    if (isCurrent || isNearCurrent || page === 1 || page === pagination.totalPages) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            isCurrent
                              ? 'bg-[var(--color-primary)] text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === 2 || page === pagination.totalPages - 1) {
                      return <span key={page} className="px-2 text-gray-500">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 