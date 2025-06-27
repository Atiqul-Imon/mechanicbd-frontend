'use client';
import { useState } from 'react';
import { 
  ContentCopy, 
  CheckCircle, 
  Phone, 
  Message, 
  Timer,
  Warning
} from '@mui/icons-material';

interface PaymentInstructionsProps {
  paymentMethod: string;
  receiverNumber: string;
  amount: number;
  expiresAt: Date;
  paymentId: string;
  timing?: 'before_service' | 'after_service';
}

const methodInstructions = {
  bkash: [
    'Open bKash app on your phone',
    'Go to "Send Money"',
    'Enter receiver number:',
    'Enter amount:',
    'Add transaction reference in message:',
    'Complete the transaction'
  ],
  nagad: [
    'Open Nagad app on your phone',
    'Go to "Send Money"',
    'Enter receiver number:',
    'Enter amount:',
    'Add transaction reference in message:',
    'Complete the transaction'
  ],
  rocket: [
    'Open Rocket app on your phone',
    'Go to "Send Money"',
    'Enter receiver number:',
    'Enter amount:',
    'Add transaction reference in message:',
    'Complete the transaction'
  ],
  upay: [
    'Open Upay app on your phone',
    'Go to "Send Money"',
    'Enter receiver number:',
    'Enter amount:',
    'Add transaction reference in message:',
    'Complete the transaction'
  ],
  tap: [
    'Open Tap app on your phone',
    'Go to "Send Money"',
    'Enter receiver number:',
    'Enter amount:',
    'Add transaction reference in message:',
    'Complete the transaction'
  ],
  sure_cash: [
    'Open Sure Cash app on your phone',
    'Go to "Send Money"',
    'Enter receiver number:',
    'Enter amount:',
    'Add transaction reference in message:',
    'Complete the transaction'
  ]
};

const methodNames = {
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
  upay: 'Upay',
  tap: 'Tap',
  sure_cash: 'Sure Cash'
};

export default function PaymentInstructions({
  paymentMethod,
  receiverNumber,
  amount,
  expiresAt,
  paymentId,
  timing = 'before_service'
}: PaymentInstructionsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isExpired = new Date() > expiresAt;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--color-primary)]/10 rounded-full">
          <Phone className="text-[var(--color-primary)]" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[var(--color-text-main)]">
            {methodNames[paymentMethod as keyof typeof methodNames]} Payment Instructions
          </h3>
          <p className="text-[var(--color-text-secondary)]">
            Follow these steps to complete your payment
          </p>
        </div>
      </div>

      {isExpired && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <Warning />
            <span className="font-medium">Payment Expired</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            This payment has expired. Please create a new payment.
          </p>
        </div>
      )}

      {/* Payment Timing Info */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-blue-900">
            {timing === 'before_service' ? 'Early Payment' : 'Post-Service Payment'}
          </span>
        </div>
        <p className="text-xs text-blue-700">
          {timing === 'before_service' 
            ? 'You\'re paying before service completion. This is optional but convenient!'
            : 'Service completed! Payment is now required to leave reviews and complete the booking.'
          }
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Instructions */}
        <div>
          <h4 className="font-semibold text-[var(--color-text-main)] mb-3">
            Step-by-step Instructions
          </h4>
          <ol className="space-y-2">
            {methodInstructions[paymentMethod as keyof typeof methodInstructions]?.map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="text-[var(--color-text-secondary)]">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Payment Details */}
        <div>
          <h4 className="font-semibold text-[var(--color-text-main)] mb-3">
            Payment Details
          </h4>
          <div className="space-y-3">
            {/* Receiver Number */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Receiver Number</p>
                  <p className="font-mono font-medium text-[var(--color-text-main)]">
                    {receiverNumber}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(receiverNumber, 'receiver')}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {copiedField === 'receiver' ? (
                    <CheckCircle className="text-green-600 text-sm" />
                  ) : (
                    <ContentCopy className="text-gray-500 text-sm" />
                  )}
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Amount</p>
                  <p className="font-mono font-medium text-[var(--color-text-main)]">
                    ৳{amount.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(amount.toString(), 'amount')}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {copiedField === 'amount' ? (
                    <CheckCircle className="text-green-600 text-sm" />
                  ) : (
                    <ContentCopy className="text-gray-500 text-sm" />
                  )}
                </button>
              </div>
            </div>

            {/* Transaction Reference */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Transaction Reference</p>
                  <p className="font-mono font-medium text-[var(--color-text-main)] text-sm">
                    {paymentId}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(paymentId, 'reference')}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {copiedField === 'reference' ? (
                    <CheckCircle className="text-green-600 text-sm" />
                  ) : (
                    <ContentCopy className="text-gray-500 text-sm" />
                  )}
                </button>
              </div>
            </div>

            {/* Expiry Time */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Timer className="text-orange-600 text-sm" />
                <div>
                  <p className="text-xs text-orange-700 font-medium">Payment Expires</p>
                  <p className="text-sm text-orange-800 font-mono">
                    {formatTime(expiresAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Message className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium mb-1">
              Important Notes:
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Include the transaction reference in your payment message</li>
              <li>• Payment will expire in 30 minutes</li>
              <li>• Keep your payment receipt for verification</li>
              <li>• Contact support if you face any issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 