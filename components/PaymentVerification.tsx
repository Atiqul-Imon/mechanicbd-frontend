'use client';
import { useState } from 'react';
import { 
  VerifiedUser, 
  Receipt, 
  CheckCircle, 
  Error
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

interface PaymentVerificationProps {
  paymentId: string;
  amount: number;
  paymentMethod: string;
  onVerificationSuccess: (payment: any) => void;
  onVerificationError: (error: string) => void;
}

export default function PaymentVerification({
  paymentId,
  amount,
  paymentMethod,
  onVerificationSuccess,
  onVerificationError
}: PaymentVerificationProps) {
  const [transactionId, setTransactionId] = useState('');
  const [transactionReference, setTransactionReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          paymentId,
          transactionId,
          transactionReference
        })
      });

      const data = await response.json();

      if (response.ok) {
        onVerificationSuccess(data.data.payment);
      } else {
        setError(data.message || 'Verification failed');
        onVerificationError(data.message || 'Verification failed');
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      onVerificationError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const methodNames = {
    bkash: 'bKash',
    nagad: 'Nagad',
    rocket: 'Rocket',
    upay: 'Upay',
    tap: 'Tap',
    sure_cash: 'Sure Cash'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-full">
          <VerifiedUser className="text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[var(--color-text-main)]">
            Verify Your Payment
          </h3>
          <p className="text-[var(--color-text-secondary)]">
            Enter your transaction details to complete the payment
          </p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <Receipt className="text-sm" />
          <span className="font-medium">Payment Summary</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-600">Payment ID:</span>
            <p className="font-mono font-medium">{paymentId}</p>
          </div>
          <div>
            <span className="text-blue-600">Amount:</span>
            <p className="font-medium">৳{amount.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-blue-600">Method:</span>
            <p className="font-medium">{methodNames[paymentMethod as keyof typeof methodNames]}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction ID */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
            Transaction ID *
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            placeholder="Enter transaction ID from your receipt"
            required
            disabled={isSubmitting}
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            This is the unique ID from your {methodNames[paymentMethod as keyof typeof methodNames]} transaction
          </p>
        </div>

        {/* Transaction Reference */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
            Transaction Reference *
          </label>
          <input
            type="text"
            value={transactionReference}
            onChange={(e) => setTransactionReference(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            placeholder="Enter transaction reference"
            required
            disabled={isSubmitting}
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            This is the reference number you used in the payment message
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <Error className="text-sm" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !transactionId || !transactionReference}
          className="w-full bg-[var(--color-primary)] text-white py-3 px-4 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={16} color="inherit" />
              Verifying Payment...
            </>
          ) : (
            <>
              <CheckCircle />
              Verify Payment
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-yellow-100 rounded-full">
            <Receipt className="text-yellow-600 text-sm" />
          </div>
          <div>
            <p className="text-sm text-yellow-800 font-medium mb-1">
              Where to find these details:
            </p>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>Transaction ID:</strong> Found in your {methodNames[paymentMethod as keyof typeof methodNames]} app transaction history</li>
              <li>• <strong>Transaction Reference:</strong> The reference you included in your payment message</li>
              <li>• Both details are also available in your payment receipt SMS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 