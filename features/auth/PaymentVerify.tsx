"use client";

import { useEffect, useReducer, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/toast/ToastContext";
import { markEnrollmentPaidAction } from "@/actions/enrollment/mark-paid.actions";
import { createPaymentAction } from "@/actions/payment/create-payment.actions";
import { useBackNavigationGuard } from "@/lib/hooks/useBackNavigationGuard";
import { storage } from "@/lib/storage";

// Payment verification state machine - Senior Engineer Approach
type PaymentState = {
  status: "idle" | "processing" | "success" | "failed";
  data: any;
  error: string;
  hasProcessed: boolean; // Prevents double processing
};

type PaymentAction =
  | { type: "START_PROCESSING" }
  | { type: "PROCESS_SUCCESS"; payload: any }
  | { type: "PROCESS_FAILED"; payload: string }
  | { type: "RESET" };

const initialState: PaymentState = {
  status: "idle",
  data: null,
  error: "",
  hasProcessed: false,
};

function paymentReducer(
  state: PaymentState,
  action: PaymentAction,
): PaymentState {
  switch (action.type) {
    case "START_PROCESSING":
      return { ...state, status: "processing", hasProcessed: false };
    case "PROCESS_SUCCESS":
      // Only process if not already processed (prevents double execution)
      if (state.hasProcessed) return state;
      return {
        ...state,
        status: "success",
        data: action.payload,
        error: "",
        hasProcessed: true,
      };
    case "PROCESS_FAILED":
      // Only process if not already processed (prevents double execution)
      if (state.hasProcessed) return state;
      return {
        ...state,
        status: "failed",
        data: null,
        error: action.payload,
        hasProcessed: true,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

type Props = {
  enrollmentDocumentId: string;
  userId: number;
  userEmail: string;
};

export default function PaymentSuccessPage({ enrollmentDocumentId, userId, userEmail }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  // Robust state management with reducer
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  // Ref to prevent double processing due to React.StrictMode
  const hasProcessedRef = useRef(false);

  const reference = searchParams.get("reference");
  const status = searchParams.get("status");
  const planId = searchParams.get("planId");
  const planName = searchParams.get("planName");
  const amount = searchParams.get("amount");
  const currency = searchParams.get("currency");
  const planDiscount = searchParams.get("planDiscount");

  useEffect(() => {
    debugger
    const completedReference = sessionStorage.getItem("reference") || localStorage.getItem("reference");  

    if (completedReference === reference) {
      router.replace("/dashboard");
    }
    // Prevent double processing due to React.StrictMode
    if (hasProcessedRef.current) {
      return;
    }

    hasProcessedRef.current = true;

    // Reset state for new payment attempt
    dispatch({ type: "RESET" });

    // Start processing state
    dispatch({ type: "START_PROCESSING" });

    // Simulate processing delay (3 seconds)
    const timeoutId = setTimeout(async () => {
      // Check if payment failed
      if (status === "failed" || !reference) {
        const errorMessage =
          status === "failed"
            ? "Payment was declined or failed"
            : "Payment reference not found";

        // Dispatch failed action (reducer prevents double execution)
        dispatch({ type: "PROCESS_FAILED", payload: errorMessage });

        // Show toast (only once due to ref check)
        showToast({
          type: "error",
          title: "Payment Failed",
          description: "Your payment was declined or failed.",
        });
        return;
      }

      // Payment successful - use actual plan data from URL
      const paymentData = {
        reference: reference,
        amount: amount ? parseInt(amount) : 500000,
        currency: "NGN",
        email: userEmail,
        customer_code:
          "CUS_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        paidAt: new Date().toISOString(),
        plan_id: planId || "basic",
        plan_name: planName || "Basic Plan",
      };

      // Mark enrollment as paid
      const markPaidResult = await markEnrollmentPaidAction({
        documentId: enrollmentDocumentId,
        isPaymentDone: true,
      });

      if (!markPaidResult.success) {
        console.error("Failed to mark enrollment as paid:", markPaidResult.message);
      }

      // Add batch info to payment data if available
      const paymentDataWithBatch = {
        ...paymentData,
        batchName: markPaidResult.batchName || "Pending",
      };

      // Dispatch success action with batch info
      dispatch({ type: "PROCESS_SUCCESS", payload: paymentDataWithBatch });

      // Create payment record in database
      const currentDate = new Date();
      const paymentResult = await createPaymentAction({
        userDocumentId: userId.toString(),
        enrollmentDocumentId: enrollmentDocumentId,
        paymentMode: "Online",
        month: currentDate.toLocaleString('en-US', { month: 'long' }),
        year: currentDate.getFullYear(),
        amount: amount ? parseInt(amount) / 100 : 5000, // Convert from kobo to naira
        emailAddress: userEmail,
        paymentDate: currentDate.toISOString(),
        reference: reference, // Add payment reference
        planId: planId || "gold",
        planName: planName || "Gold Plan",
        planAmount: amount ? parseInt(amount) / 100 : 5000,
        planDiscount: planDiscount ? parseInt(planDiscount) : 50,
      });

      if (!paymentResult.success) {
        console.error("Failed to create payment record:", paymentResult.message);
      }

      // Show toast (only once due to ref check)
      showToast({
        type: "success",
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });

      localStorage.setItem("reference", reference);
      sessionStorage.setItem("reference", reference);
    }, 3000);

    // Return cleanup function
    return () => {
      clearTimeout(timeoutId);
      // Reset ref when component unmounts
      hasProcessedRef.current = false;
    };
  }, []); // Empty dependency array - runs only once on mount

  const formatAmount = (amountInKobo: number) => {
    return `₦${(amountInKobo / 100).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b3c42] via-[#1b6b73] to-[#51A8B1] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Status Icon */}
          <div className="mb-6">
            {state.status === "processing" && (
              <Loader2 className="w-16 h-16 text-[#51A8B1] animate-spin mx-auto" />
            )}
            {state.status === "success" && (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            )}
            {state.status === "failed" && (
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {state.status === "processing" && "Processing Payment..."}
            {state.status === "success" && "Payment Successful!"}
            {state.status === "failed" && "Payment Failed"}
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-6">
            {state.status === "processing" &&
              "Please wait while we process your payment."}
            {state.status === "success" &&
              "Your payment has been processed successfully."}
            {state.status === "failed" &&
              "We could not process your payment. Please try again or contact support."}
          </p>

          {/* Error Message */}
          {state.status === "failed" && state.error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600 text-sm">{state.error}</p>
            </div>
          )}

          {/* Payment Details */}
          {state.status === "success" && state.data && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">
                Payment Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-mono text-gray-900">
                    {state.data.reference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-[#51A8B1]">
                    {formatAmount(state.data.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Currency:</span>
                  <span className="text-gray-900">{state.data.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900">
                    {formatDate(state.data.paidAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="text-gray-900">
                    {state.data.email}
                  </span>
                </div>
                {state.data.batchName && (
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Assigned Batch:</span>
                    <span className="font-semibold text-[#51A8B1]">
                      {state.data.batchName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {state.status === "success" && (
              <button
                onClick={() => router.replace("/dashboard")}
                className="block w-full bg-[#51A8B1] hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition"
              >
                Go to Dashboard
              </button>
            )}

            {state.status === "failed" && (
              <>
                <button
                  onClick={() => router.push("/payment")}
                  className="block w-full bg-[#51A8B1] hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition"
                >
                  Try Again
                </button>
              </>
            )}

            {state.status === "processing" && (
              <div className="text-gray-500 text-sm">
                Processing your payment...
              </div>
            )}
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@skillzncert.com"
                className="text-[#51A8B1] hover:underline"
              >
                support@skillzncert.com
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
