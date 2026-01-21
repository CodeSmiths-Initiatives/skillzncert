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
} from "lucide-react";

export function PaymentsSection() {
  const payments = [
    {
      id: 1,
      date: "2025-01-15",
      amount: "$499.00",
      status: "completed",
      plan: "Premium Annual Plan",
    },
    {
      id: 2,
      date: "2024-12-15",
      amount: "$499.00",
      status: "completed",
      plan: "Premium Annual Plan",
    },
    {
      id: 3,
      date: "2024-11-15",
      amount: "$49.00",
      status: "pending",
      plan: "Monthly Plan",
    },
  ];

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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Plan</h2>
            <p className="text-2xl font-bold text-blue-500 mb-1">Premium Annual Plan</p>
            <p className="text-gray-600">Next billing: February 15, 2026</p>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-full">
            <span className="text-green-700 font-semibold text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Active
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Receipt className="h-5 w-5 text-blue-500" />
          Transaction History
        </h2>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${payment.status === "completed" ? "bg-green-100" : "bg-yellow-100"}`}>
                  {payment.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{payment.plan}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xl font-bold text-gray-900">{payment.amount}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Invoice
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#51A8B1]" />
          Payment Method
        </h2>
        <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/2026</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            Update Card
          </Button>
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
