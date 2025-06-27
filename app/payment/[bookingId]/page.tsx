'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { get, post } from '../../../utils/api';
import ProtectedRoute from '../../../components/ProtectedRoute';
import PaymentMethodSelector from '../../../components/PaymentMethodSelector';
import PaymentInstructions from '../../../components/PaymentInstructions';
import PaymentVerification from '../../../components/PaymentVerification';
import PageLoader from '../../../components/PageLoader';
import ErrorMessage from '../../../components/ErrorMessage';
import { 
  CheckCircle, 
  Payment, 
  Receipt, 
  ArrowBack,
  Timer
} from '@mui/icons-material';
import Link from 'next/link';

interface Booking {
  _id: string;
  bookingNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  service: {
    title: string;
    basePrice: number;
  };
  mechanic: {
    fullName: string;
    phoneNumber: string;
  };
  scheduledDate: string;
  scheduledTime: string;
}

interface Payment {
  _id: string;
  paymentId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  expiresAt: string;
  paymentTiming?: 'before_service' | 'after_service';
  mfsDetails: {
    receiverNumber: string;
  };
}

type PaymentStep = 'method' | 'instructions' | 'verification' | 'success';

function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [currentStep, setCurrentStep] = useState<PaymentStep>('method');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentTiming, setPaymentTiming] = useState<'before_service' | 'after_service'>('before_service');

  useEffect(() => {
    const fetchBooking = async () => {
      if (!params.bookingId) return;
      
      setLoading(true);
      setError('');
      try {
        const response = await get(`/bookings/${params.bookingId}`);
        const bookingData = response.data.data.booking;
        
        // Check if user owns this booking
        if (bookingData.customer._id !== user?._id) {
          setError('You can only pay for your own bookings');
          return;
        }
        
        // Arogga-style: Allow payment for confirmed bookings (not just pending)
        if (bookingData.status === 'cancelled') {
          setError('Cannot pay for cancelled bookings');
          return;
        }
        
        // Check if already paid
        if (bookingData.paymentStatus === 'paid') {
          setError('This booking has already been paid for');
          return;
        }
        
        setBooking(bookingData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchBooking();
    }
  }, [params.bookingId, isAuthenticated, user]);

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleCreatePayment = async () => {
    if (!selectedMethod || !senderNumber) {
      setPaymentError('Please select a payment method and enter your phone number');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(senderNumber)) {
      setPaymentError('Please enter a valid Bangladesh phone number');
      return;
    }

    setCreatingPayment(true);
    setPaymentError('');

    try {
      const response = await post('/payments', {
        bookingId: params.bookingId,
        paymentMethod: selectedMethod,
        senderNumber
      });

      setPayment(response.data.data.payment);
      setPaymentTiming(response.data.data.paymentInstructions.timing);
      setCurrentStep('instructions');
    } catch (err: any) {
      setPaymentError(err.response?.data?.message || 'Failed to create payment');
    } finally {
      setCreatingPayment(false);
    }
  };

  const handleVerificationSuccess = (paymentData: Payment) => {
    setPayment(paymentData);
    setCurrentStep('success');
  };

  const handleVerificationError = (error: string) => {
    setPaymentError(error);
  };

  const handleBackToInstructions = () => {
    setCurrentStep('instructions');
    setPaymentError('');
  };

  const handleNewPayment = () => {
    setCurrentStep('method');
    setSelectedMethod('');
    setSenderNumber('');
    setPayment(null);
    setPaymentError('');
  };

  if (loading) {
    return <PageLoader message="Loading payment details..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Payment Error"
        message={error}
        icon="❌"
        backUrl="/dashboard/customer"
        backText="Back to Dashboard"
      />
    );
  }

  if (!booking) {
    return (
      <ErrorMessage
        title="Booking Not Found"
        message="The booking you're looking for doesn't exist."
        icon="🔍"
        backUrl="/dashboard/customer"
        backText="Back to Dashboard"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/customer"
            className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors mb-4"
          >
            <ArrowBack />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">
            Payment for Booking #{booking.bookingNumber}
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Complete your payment to confirm your booking
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 'method' ? 'bg-[var(--color-primary)] text-white' : 
                ['instructions', 'verification', 'success'].includes(currentStep) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <Payment />
              </div>
              <div className={`w-16 h-1 ${
                ['instructions', 'verification', 'success'].includes(currentStep) ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
            </div>
            
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 'instructions' ? 'bg-[var(--color-primary)] text-white' : 
                ['verification', 'success'].includes(currentStep) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <Receipt />
              </div>
              <div className={`w-16 h-1 ${
                ['verification', 'success'].includes(currentStep) ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
            </div>
            
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 'verification' ? 'bg-[var(--color-primary)] text-white' : 
                currentStep === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <CheckCircle />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Timing Info (Arogga-style) */}
        {paymentTiming && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="font-semibold text-blue-900">
                {paymentTiming === 'before_service' ? 'Early Payment' : 'Post-Service Payment'}
              </h3>
            </div>
            <p className="text-sm text-blue-700">
              {paymentTiming === 'before_service' 
                ? 'You\'re paying before service completion. This is optional but convenient!'
                : 'Service completed! Payment is now required to leave reviews and complete the booking.'
              }
            </p>
          </div>
        )}

        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text-main)] mb-4">
            Booking Summary
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Service</p>
              <p className="font-medium text-[var(--color-text-main)]">{booking.service.title}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Mechanic</p>
              <p className="font-medium text-[var(--color-text-main)]">{booking.mechanic.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Scheduled Date</p>
              <p className="font-medium text-[var(--color-text-main)]">
                {new Date(booking.scheduledDate).toISOString().slice(0, 10)} at {booking.scheduledTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Total Amount</p>
              <p className="text-2xl font-bold text-[var(--color-primary)]">৳{booking.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Payment Status</p>
              <p className={`font-medium ${
                booking.paymentStatus === 'paid' ? 'text-green-600' : 
                booking.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Steps */}
        {currentStep === 'method' && (
          <div className="space-y-6">
            <PaymentMethodSelector
              selectedMethod={selectedMethod}
              onMethodSelect={handleMethodSelect}
            />
            
            {selectedMethod && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
                  Your Phone Number
                </h3>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="01XXXXXXXXX"
                    required
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Enter the phone number associated with your {selectedMethod} account
                  </p>
                </div>
                
                {paymentError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{paymentError}</p>
                  </div>
                )}
                
                <button
                  onClick={handleCreatePayment}
                  disabled={creatingPayment || !selectedMethod || !senderNumber}
                  className="w-full mt-4 bg-[var(--color-primary)] text-white py-3 px-4 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingPayment ? 'Creating Payment...' : 'Continue to Payment'}
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 'instructions' && payment && (
          <div className="space-y-6">
            <PaymentInstructions
              paymentMethod={payment.paymentMethod}
              receiverNumber={payment.mfsDetails.receiverNumber}
              amount={payment.amount}
              expiresAt={new Date(payment.expiresAt)}
              paymentId={payment.paymentId}
              timing={paymentTiming}
            />
            
            <div className="flex gap-4">
              <button
                onClick={handleNewPayment}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Change Payment Method
              </button>
              <button
                onClick={() => setCurrentStep('verification')}
                className="flex-1 bg-[var(--color-primary)] text-white py-3 px-4 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                I've Made the Payment
              </button>
            </div>
          </div>
        )}

        {currentStep === 'verification' && payment && (
          <div className="space-y-6">
            <PaymentVerification
              paymentId={payment.paymentId}
              amount={payment.amount}
              paymentMethod={payment.paymentMethod}
              onVerificationSuccess={handleVerificationSuccess}
              onVerificationError={handleVerificationError}
            />
            
            <button
              onClick={handleBackToInstructions}
              className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Back to Instructions
            </button>
          </div>
        )}

        {currentStep === 'success' && payment && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600 text-4xl" />
            </div>
            
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-4">
              Payment Successful!
            </h2>
            
            <p className="text-[var(--color-text-secondary)] mb-6">
              Your payment has been verified and your booking is now confirmed.
            </p>
            
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-600">Payment ID:</span>
                  <p className="font-mono font-medium">{payment.paymentId}</p>
                </div>
                <div>
                  <span className="text-green-600">Amount:</span>
                  <p className="font-medium">৳{payment.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Link
                href="/dashboard/customer"
                className="flex-1 bg-[var(--color-primary)] text-white py-3 px-4 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                View My Bookings
              </Link>
              <Link
                href="/services"
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Book Another Service
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentPageWrapper() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <PaymentPage />
    </ProtectedRoute>
  );
} 