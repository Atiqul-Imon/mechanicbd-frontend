'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api, { get, del } from '../../../utils/api';
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
  isPaid?: boolean;
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
  };
}

function CustomerDashboardContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleNote, setRescheduleNote] = useState('');
  const [processingRefund, setProcessingRefund] = useState(false);
  const [processingReschedule, setProcessingReschedule] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

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

  const handleRefundRequest = async () => {
    if (!selectedBooking || !refundReason || !refundAmount) return;
    
    setProcessingRefund(true);
    try {
      await api.post(`/bookings/${selectedBooking._id}/refund`, {
        reason: refundReason,
        amount: parseFloat(refundAmount)
      });
      
      // Update booking in state
      setBookings(bookings.map(b => 
        b._id === selectedBooking._id 
          ? { 
              ...b, 
              refund: {
                refundStatus: 'requested',
                refundAmount: parseFloat(refundAmount),
                refundReason
              }
            }
          : b
      ));
      
      setRefundModalOpen(false);
      setSelectedBooking(null);
      setRefundReason('');
      setRefundAmount('');
      alert('Refund request submitted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to request refund');
    } finally {
      setProcessingRefund(false);
    }
  };

  const handleRescheduleRequest = async () => {
    if (!selectedBooking || !newDate || !newTime) return;
    
    setProcessingReschedule(true);
    try {
      await api.post(`/bookings/${selectedBooking._id}/reschedule`, {
        newDate,
        newTime,
        note: rescheduleNote
      });
      
      // Update booking in state
      setBookings(bookings.map(b => 
        b._id === selectedBooking._id 
          ? { 
              ...b, 
              reschedule: {
                status: 'requested',
                newDate,
                newTime,
                note: rescheduleNote
              }
            }
          : b
      ));
      
      setRescheduleModalOpen(false);
      setSelectedBooking(null);
      setNewDate('');
      setNewTime('');
      setRescheduleNote('');
      alert('Reschedule request submitted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to request reschedule');
    } finally {
      setProcessingReschedule(false);
    }
  };

  const handleRemoveBooking = async (id: string) => {
    if (!confirm('Are you sure you want to remove this booking? This action cannot be undone.')) return;
    setRemovingId(id);
    try {
      await del(`/bookings/${id}`);
      setBookings(bookings => bookings.filter(b => b._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove booking');
    } finally {
      setRemovingId(null);
    }
  };

  const openRefundModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setRefundAmount(booking.totalAmount.toString());
    setRefundModalOpen(true);
  };

  const openRescheduleModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewDate(booking.scheduledDate);
    setNewTime(booking.scheduledTime);
    setRescheduleModalOpen(true);
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
                    <h2 className="text-xl font-semibold text-[var(--color-primary-dark)]">
                      {booking.service ? booking.service.title : <i>Service missing</i>}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                      <span className="text-sm text-[var(--color-primary)]">৳{booking.totalAmount}</span>
                    </div>
                    {/* Show warning if service is missing */}
                    {!booking.service && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded text-sm flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        This service has been removed by the admin. You can remove this booking.
                      </div>
                    )}
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
                  <div className="text-right">
                    <div className="text-sm text-[var(--color-text-muted)]">{new Date(booking.scheduledDate).toISOString().slice(0, 10)} {booking.scheduledTime}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">with {booking.mechanic?.fullName || <i>Unknown mechanic</i>}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
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
                  
                  {/* Refund request button */}
                  {booking.status === 'completed' && booking.paymentStatus === 'paid' && 
                   (!booking.refund || booking.refund.refundStatus === 'none') && (
                    <button
                      onClick={() => openRefundModal(booking)}
                      className="bg-orange-100 text-orange-900 px-4 py-2 rounded-lg font-medium hover:bg-orange-200 transition"
                    >
                      Request Refund
                    </button>
                  )}
                  
                  {/* Reschedule request button */}
                  {['confirmed', 'pending'].includes(booking.status) && 
                   (!booking.reschedule || booking.reschedule.status === 'none') && (
                    <button
                      onClick={() => openRescheduleModal(booking)}
                      className="bg-purple-100 text-purple-900 px-4 py-2 rounded-lg font-medium hover:bg-purple-200 transition"
                    >
                      Reschedule
                    </button>
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
                  
                  {/* Remove button for orphaned bookings */}
                  {!booking.service && (
                    <button
                      onClick={() => handleRemoveBooking(booking._id)}
                      className="bg-red-100 text-red-900 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition disabled:opacity-50"
                      disabled={removingId === booking._id}
                    >
                      {removingId === booking._id ? 'Removing...' : 'Remove'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refund Request Modal */}
        {refundModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold mb-4">Request Refund</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Refund Amount (৳)</label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reason</label>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="Explain why you need a refund"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setRefundModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefundRequest}
                  disabled={processingRefund || !refundReason || !refundAmount}
                  className="flex-1 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50"
                >
                  {processingRefund ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Request Modal */}
        {rescheduleModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold mb-4">Request Reschedule</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Note (Optional)</label>
                  <textarea
                    value={rescheduleNote}
                    onChange={(e) => setRescheduleNote(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={2}
                    placeholder="Explain why you need to reschedule"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setRescheduleModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleRequest}
                  disabled={processingReschedule || !newDate || !newTime}
                  className="flex-1 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50"
                >
                  {processingReschedule ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
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