'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { get } from '../../../../utils/api';
import Link from 'next/link';
import PageLoader from '../../../../components/PageLoader';
import ErrorMessage from '../../../../components/ErrorMessage';

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
  };
  customer: {
    _id: string;
    fullName: string;
    phoneNumber: string;
  };
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  totalAmount: number;
  serviceLocation: string;
  customerNotes?: string;
  serviceRequirements?: string;
  createdAt: string;
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      if (!params.bookingId) return;
      
      setLoading(true);
      setError('');
      try {
        const response = await get(`/bookings/${params.bookingId}`);
        setBooking(response.data.data.booking);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch booking details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [params.bookingId]);

  if (loading) {
    return <PageLoader message="Loading booking details..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Booking"
        message={error}
        icon="❌"
        backUrl="/dashboard/customer"
        backText="Go to Dashboard"
      />
    );
  }

  if (!booking) {
    return (
      <ErrorMessage
        title="Booking Not Found"
        message="The booking you&apos;re looking for doesn&apos;t exist."
        icon="🔍"
        backUrl="/dashboard/customer"
        backText="Go to Dashboard"
      />
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-900';
      case 'confirmed': return 'bg-blue-100 text-blue-900';
      case 'in_progress': return 'bg-purple-100 text-purple-900';
      case 'completed': return 'bg-green-100 text-green-900';
      case 'cancelled': return 'bg-red-100 text-red-900';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Your service has been successfully booked. We&apos;ll keep you updated on the progress.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Booking Details</h2>
              
              <div className="space-y-6">
                {/* Booking Number and Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-main)]">Booking #{booking.bookingNumber}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Created on {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Service Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">Service Information</h4>
                  <div className="bg-[var(--color-bg-surface)] rounded-lg p-4">
                    <h5 className="font-medium text-[var(--color-text-main)]">{booking.service.title}</h5>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-2">{booking.service.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--color-text-secondary)]">Base Price:</span>
                      <span className="text-xl font-bold text-[var(--color-primary)]">৳{booking.service.basePrice}</span>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">Schedule</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-[var(--color-text-secondary)]">Date:</span>
                      <p className="font-medium text-[var(--color-text-main)]">
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-[var(--color-text-secondary)]">Time:</span>
                      <p className="font-medium text-[var(--color-text-main)]">
                        {booking.scheduledTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">Service Location</h4>
                  <p className="text-[var(--color-text-main)]">{booking.serviceLocation}</p>
                </div>

                {/* Additional Information */}
                {(booking.serviceRequirements || booking.customerNotes) && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">Additional Information</h4>
                    {booking.serviceRequirements && (
                      <div className="mb-4">
                        <span className="text-sm text-[var(--color-text-secondary)]">Service Requirements:</span>
                        <p className="text-[var(--color-text-main)]">{booking.serviceRequirements}</p>
                      </div>
                    )}
                    {booking.customerNotes && (
                      <div>
                        <span className="text-sm text-[var(--color-text-secondary)]">Notes:</span>
                        <p className="text-[var(--color-text-main)]">{booking.customerNotes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mechanic Information & Next Steps */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mechanic Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[var(--color-text-main)] mb-4">Your Mechanic</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                  <span className="text-[var(--color-primary)] font-semibold text-xl">
                    {booking.mechanic.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--color-text-main)]">{booking.mechanic.fullName}</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">{booking.mechanic.phoneNumber}</p>
                </div>
              </div>
              <button className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-200 transform hover:scale-105">
                Contact Mechanic
              </button>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[var(--color-text-main)] mb-4">What&apos;s Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-main)]">Confirmation</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">We&apos;ll confirm your booking within 2 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-main)]">Mechanic Contact</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">Your mechanic will contact you before arrival</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-main)]">Service Delivery</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">Professional service at your location</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[var(--color-text-main)] mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Service Price:</span>
                  <span className="font-medium">৳{booking.service.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Consultation:</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-[var(--color-text-main)]">Total:</span>
                    <span className="text-2xl font-bold text-[var(--color-primary)]">৳{booking.totalAmount}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-3">
                Payment will be collected after service completion
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/dashboard/customer"
                className="block w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-200 text-center font-medium transform hover:scale-105"
              >
                View My Bookings
              </Link>
              <Link
                href="/services"
                className="block w-full bg-white text-[var(--color-primary)] py-3 rounded-lg border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200 text-center font-medium transform hover:scale-105"
              >
                Book Another Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 