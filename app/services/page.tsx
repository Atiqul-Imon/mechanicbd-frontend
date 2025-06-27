'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { get } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import PageLoader from '../../components/PageLoader';
import ErrorMessage from '../../components/ErrorMessage';

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
  { id: 'all', name: 'All Services', icon: '🔧' },
  { id: 'HVAC', name: 'HVAC', icon: '❄️' },
  { id: 'Electrical', name: 'Electrical', icon: '⚡' },
  { id: 'Plumbing', name: 'Plumbing', icon: '🚰' },
  { id: 'Appliances', name: 'Appliances', icon: '🏠' },
  { id: 'Carpentry', name: 'Carpentry', icon: '🔨' },
  { id: 'Painting', name: 'Painting', icon: '🎨' },
  { id: 'Cleaning', name: 'Cleaning', icon: '🧹' }
];

export default function ServicesPage() {
  const { user, isAuthenticated } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await get('/services');
        setServices(response.data.data.services);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch services';
        setError(errorMessage);
        // Fallback to mock data for development
        setServices(mockServices);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Filter services based on category and search
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <PageLoader message="Loading services..." />;
  }
  
  if (error && services.length === 0) {
    return (
      <ErrorMessage
        title="Failed to Load Services"
        message={error}
        icon="🔧"
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
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>
            {isAuthenticated && (user?.role === 'mechanic' || user?.role === 'admin') && (
              <Link 
                href="/services/add" 
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-[var(--color-primary-dark)] hover:text-accent transition-all duration-200 font-medium whitespace-nowrap"
              >
                Add Service
              </Link>
            )}
          </div>
          
          {/* Category Filter */}
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
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-[var(--color-text-main)] mb-2">No services found</h3>
            <p className="text-[var(--color-text-secondary)] mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Check back later for available services.'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary-dark)]/5 flex items-center justify-center">
                  <span className="text-6xl">🔧</span>
                </div>
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
        )}
      </div>
    </div>
  );
} 