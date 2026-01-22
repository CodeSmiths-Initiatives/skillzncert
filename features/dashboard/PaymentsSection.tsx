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
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getUserPayments } from "@/actions/payment/get-user-payments.actions";
import type { PaymentData } from "@/lib/services/payment.service";

interface PaymentsSectionProps {
  userId: number;
}

export function PaymentsSection({ userId }: PaymentsSectionProps) {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        const result = await getUserPayments(userId);
        if (result.success) {
          setPayments(result.data);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
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
            <p className="text-gray-600">No payment history yet</p>
            <p className="text-sm text-gray-500 mt-2">Your payments will appear here once you make them</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {payment.month} {payment.year} Payment
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(payment.paymentDate)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Mode: {payment.paymentMode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-gray-900">{formatAmount(payment.amount)}</p>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    Paid
                  </span>
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
        <div className="space-y-4">
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
        </div>
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
    </div>
  );
}
