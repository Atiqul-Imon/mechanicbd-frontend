'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api, { get } from '../../../utils/api';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Link from 'next/link';
import PageLoader from '../../../components/PageLoader';
import ErrorMessage from '../../../components/ErrorMessage';

interface Booking {
  _id: string;
  bookingNumber: string;
  service: {
    _id: string;
    title: string;
    category: string;
    basePrice: number;
  };
  customer: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    profilePhoto?: string;
  };
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  totalAmount: number;
  customerRating?: number;
}

interface Stats {
  totalBookings: number;
  completedBookings: number;
  totalEarnings: number;
  avgRating: number;
  pendingBookings: number;
  inProgressBookings: number;
}

function MechanicDashboardContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const [bookingsRes, statsRes] = await Promise.all([
          get('/bookings/mechanic'),
          get('/users/stats')
        ]);
        setBookings(bookingsRes.data.data.bookings);
        setStats(statsRes.data.data.stats);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(bookings => bookings.map(b => 
        b._id === bookingId ? { ...b, status: newStatus } : b
      ));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-900';
      case 'confirmed': return 'bg-blue-100 text-blue-900';
      case 'in_progress': return 'bg-purple-100 text-purple-900';
      case 'completed': return 'bg-green-100 text-green-900';
      case 'cancelled': return 'bg-red-100 text-red-900';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  const getStatusActions = (status: string, bookingId: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate(bookingId, 'confirmed')}
              className="bg-blue-100 text-blue-900 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition disabled:opacity-50"
              disabled={updatingId === bookingId}
            >
              {updatingId === bookingId ? 'Updating...' : 'Accept'}
            </button>
            <button
              onClick={() => handleStatusUpdate(bookingId, 'cancelled')}
              className="bg-red-100 text-red-900 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-200 transition disabled:opacity-50"
              disabled={updatingId === bookingId}
            >
              Decline
            </button>
          </div>
        );
      case 'confirmed':
        return (
          <button
            onClick={() => handleStatusUpdate(bookingId, 'in_progress')}
            className="bg-purple-100 text-purple-900 px-3 py-1 rounded-lg text-sm font-medium hover:bg-purple-200 transition disabled:opacity-50"
            disabled={updatingId === bookingId}
          >
            {updatingId === bookingId ? 'Updating...' : 'Start Work'}
          </button>
        );
      case 'in_progress':
        return (
          <button
            onClick={() => handleStatusUpdate(bookingId, 'completed')}
            className="bg-green-100 text-green-900 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition disabled:opacity-50"
            disabled={updatingId === bookingId}
          >
            {updatingId === bookingId ? 'Updating...' : 'Mark Complete'}
          </button>
        );
      default:
        return null;
    }
  };

  if (loading) return <PageLoader message="Loading your dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Mechanic Dashboard</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">Welcome back, {user?.fullName}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Total Bookings</p>
                <p className="text-2xl font-bold text-[var(--color-primary-dark)]">{stats?.totalBookings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Total Earnings</p>
                <p className="text-2xl font-bold text-[var(--color-primary-dark)]">৳{stats?.totalEarnings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Average Rating</p>
                <p className="text-2xl font-bold text-[var(--color-primary-dark)]">{stats?.avgRating?.toFixed(1) || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Pending</p>
                <p className="text-2xl font-bold text-[var(--color-primary-dark)]">{stats?.pendingBookings || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-primary-dark)]">My Bookings</h2>
            <Link href="/services" className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition">
              Manage Services
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">You haven't received any bookings yet. Make sure your services are active!</p>
              <Link href="/services" className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition">
                Manage Services
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map(booking => (
                <div key={booking._id} className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[var(--color-primary-dark)]">{booking.service.title}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-2">{booking.service.category}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                        <span className="text-sm font-medium text-[var(--color-primary)]">৳{booking.totalAmount}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[var(--color-text-muted)]">
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-[var(--color-text-muted)]">
                        {booking.scheduledTime}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {booking.customer.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">{booking.customer.fullName}</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">{booking.customer.phoneNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link 
                        href={`/dashboard/mechanic/booking/${booking._id}`}
                        className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition"
                      >
                        View Details
                      </Link>
                      {getStatusActions(booking.status, booking._id)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MechanicDashboard() {
  return (
    <ProtectedRoute allowedRoles={['mechanic']}>
      <MechanicDashboardContent />
    </ProtectedRoute>
  );
} 