"use client";

import { PaymentData } from "@/lib/services/payment.service";
import { Receipt, Calendar, CreditCard, Mail, User, Building2, CheckCircle } from "lucide-react";

interface PrintableInvoiceViewProps {
  payment: PaymentData;
}

export function PrintableInvoiceView({ payment }: PrintableInvoiceViewProps) {
  const invoiceNumber = `INV-${payment.id.toString().padStart(6, '0')}`;
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="printable-invoice max-w-4xl mx-auto">
      {/* Invoice Header */}
      <div className="invoice-header border-b-2 md:border-b-4 border-blue-600 pb-4 md:pb-8 mb-6 md:mb-10">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-3">INVOICE</h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-600 font-bold">#{invoiceNumber}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
              <p className="text-xs md:text-sm font-semibold uppercase tracking-wide">Status</p>
            </div>
            <p className="text-xl md:text-2xl font-bold">PAID</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12 mt-6 md:mt-10">
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 md:mb-4">From</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg shrink-0">
                  <Building2 className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Skillz'n'Cert</p>
              </div>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg font-medium ml-8 md:ml-11">Sec-Concepts Networks</p>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base ml-8 md:ml-11">Cisco Networking Academy Partner</p>
              <p className="text-gray-500 text-xs sm:text-sm ml-8 md:ml-11 mt-2 md:mt-3 italic">
                Providing world-class Networking & Cybersecurity certification training
              </p>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 md:mb-4">Bill To</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg shrink-0">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                </div>
                <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Student</p>
              </div>
              <div className="flex items-start gap-2 md:gap-3 ml-8 md:ml-11">
                <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 mt-0.5 shrink-0" />
                <p className="text-gray-700 font-medium text-xs sm:text-sm md:text-base break-words">{payment.emailAddress}</p>
              </div>
              <div className="flex items-start gap-2 md:gap-3 ml-8 md:ml-11 mt-3 md:mt-4">
                <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 mt-0.5 shrink-0" />
                <p className="text-gray-600 text-xs sm:text-sm">
                  <span className="font-semibold">Payment Date:</span>{" "}
                  {new Date(payment.paymentDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="print-section mb-6 md:mb-10">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="p-2 md:p-3 bg-blue-100 rounded-lg md:rounded-xl shrink-0">
            <Receipt className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Payment Details</h2>
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl md:rounded-2xl p-4 md:p-8 border border-blue-100 md:border-2">
          {/* Plan Badge - Prominent display */}
          {payment.planName && (
            <div className="mb-6 md:mb-10 p-4 md:p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl md:rounded-2xl border-2 border-amber-200">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-amber-500 rounded-full"></div>
                <p className="text-xs md:text-sm font-bold text-amber-800 uppercase tracking-wide">Selected Plan</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-amber-900 mb-2 md:mb-3">{payment.planName}</p>
              {payment.planDiscount && (
                <p className="text-sm md:text-base text-amber-800">
                  <span className="font-semibold">Discount:</span> {payment.planDiscount}%
                </p>
              )}
            </div>
          )}

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-lg mb-2">Training Fee</p>
              <p className="text-xs text-gray-600 mb-4">
                Networking & Cybersecurity Certification Program
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 font-medium">Period</span>
                  <span className="font-semibold text-gray-900">{payment.month} {payment.year}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 font-medium">Payment Mode</span>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                    <span className="font-semibold text-gray-900 text-sm">{payment.paymentMode}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-xs text-gray-600 font-medium">Amount</span>
                  <span className="text-xl font-bold text-gray-900">₦{payment.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b-3 border-blue-300">
                  <th className="text-left py-5 px-5 text-gray-800 font-bold text-sm uppercase tracking-wide">Description</th>
                  <th className="text-center py-5 px-5 text-gray-800 font-bold text-sm uppercase tracking-wide">Period</th>
                  <th className="text-center py-5 px-5 text-gray-800 font-bold text-sm uppercase tracking-wide">Payment Mode</th>
                  <th className="text-right py-5 px-5 text-gray-800 font-bold text-sm uppercase tracking-wide">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-blue-200">
                  <td className="py-8 px-5">
                    <p className="font-bold text-gray-900 text-xl mb-2">Training Fee</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Networking & Cybersecurity Certification Program
                    </p>
                  </td>
                  <td className="py-8 px-5 text-center">
                    <p className="font-bold text-gray-900 text-lg">{payment.month} {payment.year}</p>
                  </td>
                  <td className="py-8 px-5 text-center">
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">{payment.paymentMode}</span>
                    </div>
                  </td>
                  <td className="py-8 px-5 text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ₦{payment.amount.toLocaleString()}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Subtotal Section */}
          <div className="mt-6 md:mt-10 space-y-3 md:space-y-4 border-t-2 border-blue-300 pt-4 md:pt-8">
            <div className="flex justify-between items-center px-2 md:px-5">
              <p className="text-gray-700 font-semibold text-base md:text-xl">Subtotal</p>
              <p className="text-gray-900 font-bold text-base md:text-xl">
                ₦{payment.amount.toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between items-center px-2 md:px-5">
              <p className="text-gray-700 font-semibold text-base md:text-xl">Tax (0%)</p>
              <p className="text-gray-900 font-bold text-base md:text-xl">₦0.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Section */}
      <div className="invoice-total bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl md:rounded-2xl p-6 md:p-10 shadow-2xl mb-6 md:mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-blue-100 font-semibold text-sm md:text-lg mb-2 md:mb-3 uppercase tracking-wide">Total Amount Paid</p>
            <p className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
              ₦{payment.amount.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-lg md:rounded-xl px-4 sm:px-6 md:px-8 py-3 md:py-5 border border-white/30">
            <p className="text-blue-100 text-xs md:text-sm mb-1 md:mb-2 font-medium">Payment Status</p>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
              <p className="text-white font-bold text-lg md:text-2xl">PAID</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 md:mt-10 p-4 md:p-8 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-200">
        <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-4 md:mb-6">Payment Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-1 md:space-y-2">
            <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wide">Invoice Number</p>
            <p className="font-bold text-gray-900 text-base md:text-lg">{invoiceNumber}</p>
          </div>
          <div className="space-y-1 md:space-y-2">
            <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wide">Invoice Date</p>
            <p className="font-bold text-gray-900 text-base md:text-lg">{currentDate}</p>
          </div>
          <div className="space-y-1 md:space-y-2">
            <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wide">Payment Date</p>
            <p className="font-bold text-gray-900 text-base md:text-lg">
              {new Date(payment.paymentDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="space-y-1 md:space-y-2">
            <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wide">Payment ID</p>
            <p className="font-bold text-gray-900 text-base md:text-lg">#PAY-{payment.id}</p>
          </div>
          {payment.planName && (
            <div className="space-y-1 md:space-y-2 sm:col-span-1">
              <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wide">Plan Name</p>
              <p className="font-bold text-gray-900 text-base md:text-lg">{payment.planName}</p>
            </div>
          )}
          {payment.planDiscount && (
            <div className="space-y-1 md:space-y-2 sm:col-span-1">
              <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wide">Plan Discount</p>
              <p className="font-bold text-green-700 text-base md:text-lg">{payment.planDiscount}%</p>
            </div>
          )}
          {payment.reference && (
            <div className="space-y-1 md:space-y-2">
              <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wide">Payment Reference</p>
              <p className="font-bold text-gray-900 text-base md:text-lg font-mono">{payment.reference}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="footer mt-8 md:mt-16 pt-6 md:pt-8 border-t-2 md:border-t-3 border-gray-300">
        <div className="text-center space-y-3 md:space-y-4">
          <p className="text-gray-900 font-bold text-lg md:text-2xl">Thank you for your payment!</p>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto px-4">
            This is an official payment receipt generated by Skillz'n'Cert Training Program
          </p>
          <p className="text-gray-500 text-xs md:text-sm mt-4 md:mt-6">
            For any questions regarding this invoice, please contact our support team
          </p>
        </div>
        
        <div className="mt-6 md:mt-8 flex flex-wrap justify-center items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-400 px-4">
          <span>© {new Date().getFullYear()} Skillz'n'Cert</span>
          <span>•</span>
          <span>Sec-Concepts Networks</span>
          <span>•</span>
          <span>All Rights Reserved</span>
        </div>
      </div>
    </div>
  );
}
