'use client';
import { useState } from 'react';
import { 
  AccountBalance, 
  PhoneAndroid, 
  CreditCard, 
  Payment 
} from '@mui/icons-material';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgColor: string;
}

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodSelect: (method: string) => void;
  disabled?: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'bkash',
    name: 'bKash',
    icon: <PhoneAndroid />,
    description: 'Send money to 01712345678',
    color: '#E2136E',
    bgColor: '#FDF2F8'
  },
  {
    id: 'nagad',
    name: 'Nagad',
    icon: <Payment />,
    description: 'Send money to 01712345678',
    color: '#FF6B35',
    bgColor: '#FFF7ED'
  },
  {
    id: 'rocket',
    name: 'Rocket',
    icon: <PhoneAndroid />,
    description: 'Send money to 01712345678',
    color: '#1E40AF',
    bgColor: '#EFF6FF'
  },
  {
    id: 'upay',
    name: 'Upay',
    icon: <CreditCard />,
    description: 'Send money to 01712345678',
    color: '#059669',
    bgColor: '#ECFDF5'
  },
  {
    id: 'tap',
    name: 'Tap',
    icon: <Payment />,
    description: 'Send money to 01712345678',
    color: '#7C3AED',
    bgColor: '#F3F4F6'
  },
  {
    id: 'sure_cash',
    name: 'Sure Cash',
    icon: <AccountBalance />,
    description: 'Send money to 01712345678',
    color: '#DC2626',
    bgColor: '#FEF2F2'
  }
];

export default function PaymentMethodSelector({ 
  selectedMethod, 
  onMethodSelect, 
  disabled = false 
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">
        Choose Payment Method
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
              ${selectedMethod === method.id 
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
            onClick={() => !disabled && onMethodSelect(method.id)}
          >
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-full"
                style={{ 
                  backgroundColor: method.bgColor,
                  color: method.color 
                }}
              >
                {method.icon}
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-[var(--color-text-main)]">
                  {method.name}
                </h4>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {method.description}
                </p>
              </div>
              
              {selectedMethod === method.id && (
                <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Make sure to use the exact receiver number and include the transaction reference in your payment message.
        </p>
      </div>
    </div>
  );
} 