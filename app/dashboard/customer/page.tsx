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
  mechanic: {
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
  paymentStatus: string;
}

function CustomerDashboardContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await get('/bookings');
        setBookings(response.data.data.bookings);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    setCancelingId(id);
    try {
      await api.patch(`/bookings/${id}/cancel`, {});
      setBookings(bookings => bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-900';
      case 'in_progress': return 'bg-purple-100 text-purple-900';
      case 'completed': return 'bg-green-100 text-green-900';
      case 'cancelled': return 'bg-red-100 text-red-900';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid': return 'bg-green-100 text-green-900';
      case 'pending': return 'bg-yellow-100 text-yellow-900';
      case 'failed': return 'bg-red-100 text-red-900';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  if (loading) return <PageLoader message="Loading your bookings..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-[var(--color-primary)]">My Bookings</h1>
        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">You haven't made any bookings yet. Browse services to get started!</p>
            <Link href="/services" className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition">Browse Services</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map(booking => (
              <div key={booking._id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-[var(--color-primary-dark)]">{booking.service.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                      <span className="text-sm text-[var(--color-text-secondary)]">৳{booking.totalAmount}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[var(--color-text-muted)]">{new Date(booking.scheduledDate).toISOString().slice(0, 10)} {booking.scheduledTime}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">with {booking.mechanic.fullName}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Link href={`/dashboard/customer/booking/${booking._id}`} className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition">View Details</Link>
                  
                  {booking.status === 'confirmed' && booking.paymentStatus === 'pending' && (
                    <Link href={`/payment/${booking._id}`} className="bg-green-100 text-green-900 px-4 py-2 rounded-lg font-medium hover:bg-green-200 transition">
                      Pay Now
                    </Link>
                  )}
                  
                  {booking.status === 'completed' && booking.paymentStatus === 'pending' && (
                    <Link href={`/payment/${booking._id}`} className="bg-red-100 text-red-900 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition">
                      Pay Required
                    </Link>
                  )}
                  
                  {booking.status === 'completed' && booking.paymentStatus === 'paid' && (
                    <Link href={`/services/${booking.service._id}`} className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition">
                      Leave Review
                    </Link>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="bg-red-100 text-red-900 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition disabled:opacity-50"
                      disabled={cancelingId === booking._id}
                    >
                      {cancelingId === booking._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerDashboardContent />
    </ProtectedRoute>
  );
} 