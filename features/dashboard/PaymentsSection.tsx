"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  CheckCircle,
  Clock,
  Receipt,
  Download,
  ExternalLink,
  Loader2,
  FileText,
  Printer,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getUserPayments } from "@/actions/payment/get-user-payments.actions";
import { getUserPaymentDues } from "@/actions/payment/payment-dues.actions";
import { markPaymentDueAsPaidAction } from "@/actions/payment/payment-dues.actions";
import { createPaymentAction } from "@/actions/payment/create-payment.actions";
import type { PaymentData } from "@/lib/services/payment.service";
import type { PaymentDueData } from "@/lib/services/payment-due.service";
import { InvoiceModal } from "./InvoiceModal";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Calendar, AlertCircle, TrendingUp } from "lucide-react";
import { usePaystackPayment } from "@/lib/hooks/usePaystackPayment";
import { createDuePaymentConfig, formatAmountFromKobo } from "@/lib/services/paystack.service";
import { useToast } from "@/components/toast/ToastContext";

interface PaymentsSectionProps {
  userId: number;
  userEmail: string; // Add userEmail prop
}

export function PaymentsSection({ userId, userEmail }: PaymentsSectionProps) {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [paymentDues, setPaymentDues] = useState<PaymentDueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [processingDueId, setProcessingDueId] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { initiatePayment, isLoading: isPaymentLoading, error: paymentError } = usePaystackPayment();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        
        // Fetch both payments and payment dues in parallel
        const [paymentsResult, duesResult] = await Promise.all([
          getUserPayments(userId),
          getUserPaymentDues(userId)
        ]);

        if (!paymentsResult.success) {
          console.warn("Failed to fetch payments:", paymentsResult.message);
          setPayments([]);
        } else {
          setPayments(paymentsResult.data);
        }

        if (!duesResult.success) {
          console.warn("Failed to fetch payment dues:", duesResult.message);
          setPaymentDues([]);
        } else {
          // Filter for pending dues only and sort by due date
          const pendingDues = duesResult.data
            .filter((due: PaymentDueData) => due.status === "pending")
            .sort((a: PaymentDueData, b: PaymentDueData) => 
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            );
          setPaymentDues(pendingDues);
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
        setPayments([]);
        setPaymentDues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [userId]);

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTotalPaid = () => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const handleViewInvoice = (payment: PaymentData) => {
    setSelectedPayment(payment);
    setIsInvoiceModalOpen(true);
  };

  const handlePrintInvoice = (payment: PaymentData) => {
    setSelectedPayment(payment);
    setIsInvoiceModalOpen(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const formatDueDate = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formatted = dueDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (diffDays < 0) {
      return { formatted, status: "overdue", daysText: `${Math.abs(diffDays)} days overdue`, diffDays };
    } else if (diffDays === 0) {
      return { formatted, status: "today", daysText: "Due today", diffDays };
    } else if (diffDays <= 10) {
      return { formatted, status: "urgent", daysText: `Due in ${diffDays} days`, diffDays };
    } else if (diffDays <= 30) {
      return { formatted, status: "upcoming", daysText: `Due in ${diffDays} days`, diffDays };
    } else {
      return { formatted, status: "normal", daysText: `Due in ${diffDays} days`, diffDays };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "from-red-500 to-rose-600";
      case "today":
        return "from-orange-500 to-amber-600";
      case "urgent":
        return "from-blue-500 to-indigo-600";
      case "upcoming":
        return "from-teal-500 to-cyan-600";
      default:
        return "from-green-500 to-emerald-600";
    }
  };

  const getProgressPercentage = (due: PaymentDueData) => {
    return (due.installmentNumber / due.totalInstallments) * 100;
  };

  const handlePayInstallment = async (due: PaymentDueData) => {
    try {
      setProcessingDueId(due.documentId);

      // Create Paystack configuration for this installment
      const config = createDuePaymentConfig(
        userEmail,
        Math.round(due.dueAmount), // Already in kobo
        due.documentId,
        due.planId,
        due.planName,
        due.installmentNumber,
        due.totalInstallments,
        due.enrollmentDocumentId,
        userId.toString()
      );

      console.log('💳 Initiating payment for installment:', {
        dueId: due.documentId,
        amount: formatAmountFromKobo(Math.round(due.dueAmount)),
        installment: `${due.installmentNumber}/${due.totalInstallments}`,
        reference: config.reference
      });

      // Initiate Paystack payment
      await initiatePayment({
        config,
        onSuccess: async (reference) => {
          console.log('✅ Payment successful, updating records...');

          try {
            // Mark the due as paid
            const updateDueResult = await markPaymentDueAsPaidAction(
              due.documentId,
              {
                paidAmount: Math.round(due.dueAmount / 100), // Convert to naira
                paymentReference: reference.reference,
                paidDate: new Date().toISOString(),
                paymentDocumentId: '' // Will be updated after payment record creation
              }
            );

            if (!updateDueResult.success) {
              console.error('Failed to update payment due:', updateDueResult.message);
            }

            // Create payment record
            const currentDate = new Date();
            const paymentResult = await createPaymentAction({
              userDocumentId: userId.toString(),
              enrollmentDocumentId: due.enrollmentDocumentId,
              paymentMode: "Online",
              month: currentDate.toLocaleString('en-US', { month: 'long' }),
              year: currentDate.getFullYear(),
              amount: Math.round(due.dueAmount / 100), // Convert to naira
              emailAddress: userEmail,
              paymentDate: currentDate.toISOString(),
              reference: reference.reference,
              planId: due.planId,
              planName: `${due.planName} - Installment ${due.installmentNumber}`,
              planAmount: Math.round(due.dueAmount / 100),
              planDiscount: 0,
            });

            if (!paymentResult.success) {
              console.error('Failed to create payment record:', paymentResult.message);
            }

            // Show success toast
            showToast({
              type: "success",
              title: "Payment Successful",
              description: `Installment ${due.installmentNumber} of ${due.totalInstallments} paid successfully!`
            });

            // Refresh data
            setProcessingDueId(null);
            hasFetched.current = false;
            
            // Re-fetch data
            const [paymentsResult, duesResult] = await Promise.all([
              getUserPayments(userId),
              getUserPaymentDues(userId)
            ]);

            if (paymentsResult.success) {
              setPayments(paymentsResult.data);
            }

            if (duesResult.success) {
              const pendingDues = duesResult.data
                .filter((d: PaymentDueData) => d.status === "pending")
                .sort((a: PaymentDueData, b: PaymentDueData) => 
                  new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                );
              setPaymentDues(pendingDues);
            }

          } catch (error) {
            console.error('Error processing payment success:', error);
            showToast({
              type: "error",
              title: "Error",
              description: "Payment successful but failed to update records. Please contact support."
            });
          }
        },
        onClose: () => {
          console.log('❌ Payment cancelled');
          setProcessingDueId(null);
          showToast({
            type: "error",
            title: "Payment Cancelled",
            description: "You cancelled the payment process."
          });
        }
      });

    } catch (error) {
      console.error('Error initiating payment:', error);
      setProcessingDueId(null);
      showToast({
        type: "error",
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again."
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-1">Payment History</h1>
          <p className="text-white/90">View and manage your payment transactions</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Payment History</h1>
            <p className="text-white/90">View and manage your payment transactions</p>
          </div>
          <CreditCard className="h-16 w-16 text-white/20" />
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Summary</h2>
            <p className="text-2xl font-bold text-blue-500 mb-1">
              {formatAmount(getTotalPaid())}
            </p>
            <p className="text-gray-600">Total Paid</p>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-full">
            <span className="text-green-700 font-semibold text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {payments.length} Payment{payments.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Receipt className="h-5 w-5 text-blue-500" />
          Transaction History
        </h2>
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
             <p className="text-gray-600 font-semibold">No records found</p>
             <p className="text-sm text-gray-500 mt-2">Payment records will appear here once you make them</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-blue-50/30 p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
                
                <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
                  {/* Left section - Payment info */}
                  <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1 w-full">
                    <div className="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform shrink-0">
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base md:text-lg font-bold text-gray-900">
                          {payment.month} {payment.year} Payment
                        </h3>
                        <span className="px-2 md:px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 whitespace-nowrap">
                          ✓ PAID
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
                          <span className="truncate">{formatDate(payment.paymentDate)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
                          <span className="truncate">{payment.paymentMode}</span>
                        </span>
                        {payment.planName && (
                          <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            <span className="text-xs font-semibold">{payment.planName}</span>
                          </span>
                        )}
                        {payment.reference && (
                          <span className="flex items-center gap-1">
                            <span className="text-gray-400">#</span>
                            <span className="font-mono text-xs truncate">{payment.reference}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right section - Amount and actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 md:gap-6 w-full md:w-auto">
                    <div className="text-left md:text-right">
                      <p className="text-xs md:text-sm text-gray-600 mb-1 font-medium">Amount Paid</p>
                      <p className="text-xl md:text-3xl font-bold text-gray-900">{formatAmount(payment.amount)}</p>
                    </div>

                    {/* Invoice button */}
                    <Button
                      onClick={() => handleViewInvoice(payment)}
                      variant="outline"
                      size="sm"
                      className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 font-semibold shadow-sm whitespace-nowrap shrink-0"
                      suppressHydrationWarning
                    >
                      <FileText className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">View Invoice</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#51A8B1]" />
          Payment Information
        </h2>
        
        {/* Payment Dues Section */}
        {paymentDues.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Upcoming Installments
                </h3>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                {paymentDues.length} Due
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {paymentDues.map((due, index) => {
                  const dateInfo = formatDueDate(due.dueDate);
                  const progressPercent = getProgressPercentage(due);
                  const isPaymentWindowActive = dateInfo.diffDays <= 10;
                  const canMakePayment = dateInfo.diffDays > 10 || dateInfo.status === "overdue";

                  return (
                    <motion.div
                      key={due.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {/* Animated Progress Bar */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg"
                      />

                      <div className="p-6 pt-8">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                          {/* Left Section - Due Date & Plan Info */}
                          <div className="flex-1 space-y-4">
                            {/* Due Date Display */}
                            <div className="flex items-start gap-4">
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                className={`p-4 rounded-2xl bg-gradient-to-br ${getStatusColor(dateInfo.status)} shadow-lg`}
                              >
                                <Calendar className="h-8 w-8 text-white" />
                              </motion.div>
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                  Payment Due Date
                                </p>
                                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                                  {dateInfo.formatted}
                                </h3>
                              </div>
                            </div>

                            {/* Plan Details */}
                            <div className="flex flex-wrap items-center gap-2">
                              <motion.span
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold flex items-center gap-2"
                              >
                                <TrendingUp className="h-4 w-4" />
                                {due.planName}
                              </motion.span>

                              <motion.span
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                                  dateInfo.status === "overdue"
                                    ? "bg-red-100 text-red-700"
                                    : dateInfo.status === "today" || dateInfo.status === "urgent"
                                    ? "bg-orange-100 text-orange-700 animate-pulse"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                <Clock className="h-4 w-4" />
                                {dateInfo.daysText.toUpperCase()}
                              </motion.span>
                            </div>

                            {/* Installment Progress */}
                            <div className="pt-2">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-600">
                                  Installment {due.installmentNumber} of {due.totalInstallments}
                                </span>
                                <span className="text-sm font-bold text-blue-600">
                                  {Math.round(progressPercent)}% Complete
                                </span>
                              </div>
                              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progressPercent}%` }}
                                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-inner"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Right Section - Amount & Action */}
                          <div className="flex flex-col items-end gap-4 min-w-[200px] w-full lg:w-auto">
                            {/* Payment Window Badge */}
                            {isPaymentWindowActive && (
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 border-2 border-orange-300 text-orange-700 rounded-full text-xs font-bold"
                              >
                                <AlertCircle className="h-3 w-3 animate-pulse" />
                                <span className="hidden sm:inline">PAYMENT WINDOW ACTIVE</span>
                                <span className="sm:hidden">ACTIVE</span>
                              </motion.div>
                            )}

                            {/* Amount Display */}
                            <div className="text-right w-full">
                              <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-1">Amount Due</p>
                              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                {formatAmount(Math.round(due.dueAmount / 100))}
                              </p>
                            </div>

                            {/* Conditional Action Button or Locked State */}
                            {canMakePayment ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePayInstallment(due)}
                                disabled={processingDueId === due.documentId || isPaymentLoading}
                                className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                                  dateInfo.status === "overdue"
                                    ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                                }`}
                              >
                                {processingDueId === due.documentId ? (
                                  <>
                                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                    <span className="hidden sm:inline">Processing...</span>
                                    <span className="sm:hidden">Wait...</span>
                                  </>
                                ) : (
                                  <>
                                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="hidden sm:inline">Make Payment</span>
                                    <span className="sm:hidden">Pay Now</span>
                                  </>
                                )}
                              </motion.button>
                            ) : (
                              <div className="w-full">
                                <div className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 bg-gray-50 text-gray-500 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold">
                                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                                  <span className="hidden sm:inline">Opens in {dateInfo.diffDays - 10} days</span>
                                  <span className="sm:hidden">{dateInfo.diffDays - 10}d</span>
                                </div>
                                <p className="text-xs text-gray-400 text-center mt-2">
                                  Payment window opens 10 days before due date
                                </p>
                              </div>
                            )}

                            {/* Email Badge */}
                            <div className="text-xs text-gray-500 font-mono truncate max-w-full w-full text-right">
                              {due.emailAddress}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Original Payment Info */}
        {/* <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Email Address</p>
            <p className="font-semibold text-gray-900">
              {payments[0]?.emailAddress || "No email on record"}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Payments Made</p>
            <p className="font-semibold text-gray-900">{payments.length}</p>
          </div>
        </div> */}
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <ExternalLink className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Need help with payments?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Contact our support team for any billing or payment-related questions.
            </p>
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </Card>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        payment={selectedPayment}
      />
    </div>
  );
}
