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
  paymentStatus: string;
  customerRating?: number;
  refund?: {
    refundStatus: string;
    refundAmount?: number;
    refundReason?: string;
  };
  reschedule?: {
    status: string;
    newDate?: string;
    newTime?: string;
    note?: string;
    requestedBy?: string;
  };
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
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rescheduleResponse, setRescheduleResponse] = useState('');
  const [processingReschedule, setProcessingReschedule] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await get('/bookings/mechanic');
      setBookings(response.data.data.bookings);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

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

  const handleCompleteService = async (bookingId: string) => {
    if (!confirm('Are you sure you want to mark this service as completed?')) {
      return;
    }

    setCompletingId(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/complete`, {});
      fetchBookings(); // Refresh the list
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to complete service');
    } finally {
      setCompletingId(null);
    }
  };

  const handleRescheduleResponse = async (action: 'accept' | 'decline') => {
    if (!selectedBooking) return;
    
    setProcessingReschedule(true);
    try {
      await api.patch(`/bookings/${selectedBooking._id}/reschedule`, {
        action,
        note: rescheduleResponse
      });
      
      // Update booking in state
      setBookings(bookings.map(b => 
        b._id === selectedBooking._id 
          ? { 
              ...b, 
              reschedule: {
                ...b.reschedule,
                status: action === 'accept' ? 'accepted' : 'declined'
              },
              // Update scheduled date/time if accepted
              ...(action === 'accept' && b.reschedule ? {
                scheduledDate: b.reschedule.newDate,
                scheduledTime: b.reschedule.newTime
              } : {})
            }
          : b
      ));
      
      setRescheduleModalOpen(false);
      setSelectedBooking(null);
      setRescheduleResponse('');
      alert(`Reschedule ${action}ed successfully!`);
    } catch (err: any) {
      alert(err.response?.data?.message || `Failed to ${action} reschedule`);
    } finally {
      setProcessingReschedule(false);
    }
  };

  const openRescheduleModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setRescheduleModalOpen(true);
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-900';
      case 'unpaid': return 'bg-yellow-100 text-yellow-900';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  const getRefundStatusBadge = (refundStatus: string) => {
    switch (refundStatus) {
      case 'requested': return 'bg-yellow-100 text-yellow-900';
      case 'approved': return 'bg-blue-100 text-blue-900';
      case 'rejected': return 'bg-red-100 text-red-900';
      case 'processed': return 'bg-green-100 text-green-900';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  const getRescheduleStatusBadge = (rescheduleStatus: string) => {
    switch (rescheduleStatus) {
      case 'requested': return 'bg-yellow-100 text-yellow-900';
      case 'accepted': return 'bg-green-100 text-green-900';
      case 'declined': return 'bg-red-100 text-red-900';
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
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                        <span className="text-sm font-medium text-[var(--color-primary)]">৳{booking.totalAmount}</span>
                        {/* Show refund status if exists */}
                        {booking.refund && booking.refund.refundStatus !== 'none' && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRefundStatusBadge(booking.refund.refundStatus)}`}>
                            Refund: {booking.refund.refundStatus}
                          </span>
                        )}
                        {/* Show reschedule status if exists */}
                        {booking.reschedule && booking.reschedule.status !== 'none' && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRescheduleStatusBadge(booking.reschedule.status)}`}>
                            Reschedule: {booking.reschedule.status}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[var(--color-text-muted)]">
                        {new Date(booking.scheduledDate).toISOString().slice(0, 10)}
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
                    
                    <div className="flex gap-2 flex-wrap">
                      <Link 
                        href={`/dashboard/mechanic/booking/${booking._id}`}
                        className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition"
                      >
                        View Details
                      </Link>
                      
                      {/* Reschedule response buttons */}
                      {booking.reschedule && booking.reschedule.status === 'requested' && 
                       booking.reschedule.requestedBy !== user?._id && (
                        <button
                          onClick={() => openRescheduleModal(booking)}
                          className="bg-purple-100 text-purple-900 px-4 py-2 rounded-lg font-medium hover:bg-purple-200 transition"
                        >
                          Respond to Reschedule
                        </button>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCompleteService(booking._id)}
                          className="bg-green-100 text-green-900 px-4 py-2 rounded-lg font-medium hover:bg-green-200 transition disabled:opacity-50"
                          disabled={completingId === booking._id}
                        >
                          {completingId === booking._id ? 'Completing...' : 'Complete Service'}
                        </button>
                      )}
                      {booking.status === 'in_progress' && (
                        <button
                          onClick={() => handleCompleteService(booking._id)}
                          className="bg-green-100 text-green-900 px-4 py-2 rounded-lg font-medium hover:bg-green-200 transition disabled:opacity-50"
                          disabled={completingId === booking._id}
                        >
                          {completingId === booking._id ? 'Completing...' : 'Complete Service'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reschedule Response Modal */}
        {rescheduleModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold mb-4">Respond to Reschedule Request</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Customer wants to reschedule from:
                </p>
                <p className="font-medium">
                  {new Date(selectedBooking.scheduledDate).toISOString().slice(0, 10)} at {selectedBooking.scheduledTime}
                </p>
                <p className="text-sm text-gray-600 mb-2 mt-2">To:</p>
                <p className="font-medium">
                  {selectedBooking.reschedule?.newDate && new Date(selectedBooking.reschedule.newDate).toISOString().slice(0, 10)} at {selectedBooking.reschedule?.newTime}
                </p>
                {selectedBooking.reschedule?.note && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Note:</p>
                    <p className="text-sm bg-gray-50 p-2 rounded">{selectedBooking.reschedule.note}</p>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Your Response Note (Optional)</label>
                <textarea
                  value={rescheduleResponse}
                  onChange={(e) => setRescheduleResponse(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows={2}
                  placeholder="Add a note to your response"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRescheduleModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRescheduleResponse('decline')}
                  disabled={processingReschedule}
                  className="flex-1 bg-red-100 text-red-900 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition disabled:opacity-50"
                >
                  {processingReschedule ? 'Processing...' : 'Decline'}
                </button>
                <button
                  onClick={() => handleRescheduleResponse('accept')}
                  disabled={processingReschedule}
                  className="flex-1 bg-green-100 text-green-900 px-4 py-2 rounded-lg font-medium hover:bg-green-200 transition disabled:opacity-50"
                >
                  {processingReschedule ? 'Processing...' : 'Accept'}
                </button>
              </div>
            </div>
          </div>
        )}
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