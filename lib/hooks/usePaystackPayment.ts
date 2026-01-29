/**
 * Custom React Hook for Paystack Payment Integration
 * 
 * Features:
 * - Type-safe payment initialization
 * - Loading state management
 * - Error handling
 * - Client-side only execution
 * - Automatic cleanup
 * - Reusable across components
 * 
 * Usage:
 * const { initiatePayment, isLoading } = usePaystackPayment();
 * 
 * initiatePayment({
 *   config: paystackConfig,
 *   onSuccess: (reference) => { ... },
 *   onClose: () => { ... }
 * });
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { PaystackConfig, PaymentCallbacks } from '@/lib/services/paystack.service';
import { validatePaystackConfig } from '@/lib/services/paystack.service';

interface InitiatePaymentParams {
  config: PaystackConfig;
  onSuccess: (reference: any) => void;
  onClose: () => void;
}

export function usePaystackPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymentHookRef = useRef<any>(null);

  // Validate configuration on mount
  useEffect(() => {
    if (!validatePaystackConfig()) {
      setError("Paystack configuration is invalid");
    }
  }, []);

  // Dynamically import and initialize Paystack
  const loadPaystack = useCallback(async (config: PaystackConfig) => {
    try {
      if (typeof window === 'undefined') {
        throw new Error("Paystack can only be initialized in the browser");
      }

      const module = await import('react-paystack');
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error("Paystack public key not found");
      }

      const paystackConfig = {
        ...config,
        publicKey,
        metadata: config.metadata ? {
          ...config.metadata,
          custom_fields: config.metadata.custom_fields || []
        } : undefined
      };

      paymentHookRef.current = module.usePaystackPayment(paystackConfig);
      return paymentHookRef.current;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load Paystack";
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Initiate payment
  const initiatePayment = useCallback(async ({
    config,
    onSuccess,
    onClose
  }: InitiatePaymentParams) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Initializing Paystack payment...', {
        reference: config.reference,
        amount: config.amount,
        email: config.email,
        metadata: config.metadata
      });

      // Load Paystack dynamically
      const initializePayment = await loadPaystack(config);

      if (!initializePayment) {
        throw new Error("Failed to initialize Paystack");
      }

      // Trigger Paystack popup
      initializePayment({
        onSuccess: (reference: any) => {
          console.log('✅ Payment successful:', reference);
          setIsLoading(false);
          onSuccess(reference);
        },
        onClose: () => {
          console.log('❌ Payment cancelled by user');
          setIsLoading(false);
          onClose();
        }
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment initialization failed";
      console.error('❌ Payment error:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [loadPaystack]);

  return {
    initiatePayment,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}
