"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PaymentData } from "@/lib/services/payment.service";
import { PrintableInvoiceView } from "./PrintableInvoiceView";
import { useRef } from "react";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentData | null;
}

export function InvoiceModal({ isOpen, onClose, payment }: InvoiceModalProps) {
  const printContentRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    // Create a new window with the full content
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = printContentRef.current?.innerHTML || "";
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${payment.month} ${payment.year}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              padding: 40px;
              background: white;
              color: #111827;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            .printable-invoice {
              max-width: 900px;
              margin: 0 auto;
            }

            /* Header Styles */
            .invoice-header {
              border-bottom: 4px solid #2563eb;
              padding-bottom: 2rem;
              margin-bottom: 2.5rem;
            }

            h1 {
              font-size: 3rem;
              font-weight: bold;
              color: #111827;
              margin-bottom: 0.75rem;
            }

            h2 {
              font-size: 1.875rem;
              font-weight: bold;
              color: #111827;
            }

            h3 {
              font-size: 1.25rem;
              font-weight: bold;
              color: #111827;
            }

            /* Grid and Layout */
            .grid {
              display: grid;
            }

            .grid-cols-2 {
              grid-template-columns: repeat(2, 1fr);
            }

            .gap-12 {
              gap: 3rem;
            }

            .gap-6 {
              gap: 1.5rem;
            }

            .gap-4 {
              gap: 1rem;
            }

            .gap-3 {
              gap: 0.75rem;
            }

            .gap-2 {
              gap: 0.5rem;
            }

            .space-y-4 > * + * {
              margin-top: 1rem;
            }

            .space-y-3 > * + * {
              margin-top: 0.75rem;
            }

            .space-y-2 > * + * {
              margin-top: 0.5rem;
            }

            /* Flexbox */
            .flex {
              display: flex;
            }

            .inline-flex {
              display: inline-flex;
            }

            .items-start {
              align-items: flex-start;
            }

            .items-center {
              align-items: center;
            }

            .justify-between {
              justify-content: space-between;
            }

            .justify-center {
              justify-content: center;
            }

            /* Padding and Margins */
            .p-2 { padding: 0.5rem; }
            .p-3 { padding: 0.75rem; }
            .p-5 { padding: 1.25rem; }
            .p-8 { padding: 2rem; }
            .p-10 { padding: 2.5rem; }

            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
            .px-8 { padding-left: 2rem; padding-right: 2rem; }

            .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
            .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
            .py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
            .py-8 { padding-top: 2rem; padding-bottom: 2rem; }

            .pt-8 { padding-top: 2rem; }
            .pb-8 { padding-bottom: 2rem; }

            .mt-3 { margin-top: 0.75rem; }
            .mt-4 { margin-top: 1rem; }
            .mt-6 { margin-top: 1.5rem; }
            .mt-8 { margin-top: 2rem; }
            .mt-10 { margin-top: 2.5rem; }
            .mt-16 { margin-top: 4rem; }

            .mb-2 { margin-bottom: 0.5rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-8 { margin-bottom: 2rem; }
            .mb-10 { margin-bottom: 2.5rem; }

            .ml-11 { margin-left: 2.75rem; }

            /* Text Styles */
            .text-xs { font-size: 0.75rem; line-height: 1rem; }
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .text-base { font-size: 1rem; line-height: 1.5rem; }
            .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .text-2xl { font-size: 1.5rem; line-height: 2rem; }
            .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
            .text-5xl { font-size: 3rem; line-height: 1; }

            .font-medium { font-weight: 500; }
            .font-semibold { font-weight: 600; }
            .font-bold { font-weight: 700; }

            .uppercase { text-transform: uppercase; }
            .italic { font-style: italic; }
            .tracking-wide { letter-spacing: 0.025em; }
            .tracking-wider { letter-spacing: 0.05em; }

            .text-left { text-align: left; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }

            .leading-relaxed { line-height: 1.625; }

            /* Colors */
            .text-gray-500 { color: #6b7280; }
            .text-gray-600 { color: #4b5563; }
            .text-gray-700 { color: #374151; }
            .text-gray-800 { color: #1f2937; }
            .text-gray-900 { color: #111827; }
            .text-blue-600 { color: #2563eb; }
            .text-blue-100 { color: #dbeafe; }
            .text-purple-600 { color: #9333ea; }
            .text-white { color: white; }

            .bg-blue-100 { background-color: #dbeafe; }
            .bg-blue-600 { background-color: #2563eb; }
            .bg-purple-100 { background-color: #e9d5ff; }
            .bg-gray-50 { background-color: #f9fafb; }
            .bg-white { background: white; }

            /* Gradients */
            .bg-gradient-to-br {
              background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
            }

            .bg-gradient-to-r {
              background-image: linear-gradient(to right, var(--tw-gradient-stops));
            }

            .from-green-500 {
              --tw-gradient-from: #10b981;
              --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(16, 185, 129, 0));
            }

            .to-emerald-600 {
              --tw-gradient-to: #059669;
            }

            .from-blue-50 {
              --tw-gradient-from: #eff6ff;
            }

            .via-indigo-50 {
              --tw-gradient-via: #eef2ff;
              --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to, rgba(238, 242, 255, 0));
            }

            .to-purple-50 {
              --tw-gradient-to: #faf5ff;
            }

            .from-blue-600 {
              --tw-gradient-from: #2563eb;
              --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(37, 99, 235, 0));
            }

            .via-blue-700 {
              --tw-gradient-via: #1d4ed8;
              --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to, rgba(29, 78, 216, 0));
            }

            .to-indigo-700 {
              --tw-gradient-to: #4338ca;
            }

            /* Borders */
            .border { border-width: 1px; }
            .border-2 { border-width: 2px; }
            .border-3 { border-width: 3px; }
            .border-t-3 { border-top-width: 3px; }
            .border-b-3 { border-bottom-width: 3px; }

            .border-blue-100 { border-color: #dbeafe; }
            .border-blue-200 { border-color: #bfdbfe; }
            .border-blue-300 { border-color: #93c5fd; }
            .border-gray-200 { border-color: #e5e7eb; }
            .border-gray-300 { border-color: #d1d5db; }

            .border-t { border-top-width: 1px; }
            .border-b { border-bottom-width: 1px; }

            /* Border Radius */
            .rounded-lg { border-radius: 0.5rem; }
            .rounded-xl { border-radius: 0.75rem; }
            .rounded-2xl { border-radius: 1rem; }
            .rounded-full { border-radius: 9999px; }

            /* Shadow */
            .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
            .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
            .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }

            /* Table */
            table {
              width: 100%;
              border-collapse: collapse;
            }

            th {
              font-weight: 700;
              text-align: inherit;
            }

            /* Print Section */
            .print-section {
              page-break-inside: avoid;
            }

            /* Invoice Total */
            .invoice-total {
              background: linear-gradient(to right, #2563eb, #1d4ed8, #4338ca);
              color: white;
              border-radius: 1rem;
              padding: 2.5rem;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }

            /* Footer */
            .footer {
              margin-top: 4rem;
              padding-top: 2rem;
              border-top: 3px solid #d1d5db;
            }

            /* SVG Icons */
            svg {
              display: inline-block;
              vertical-align: middle;
            }

            .w-3 { width: 0.75rem; }
            .w-4 { width: 1rem; }
            .w-5 { width: 1.25rem; }
            .w-7 { width: 1.75rem; }
            .h-3 { height: 0.75rem; }
            .h-4 { height: 1rem; }
            .h-5 { height: 1.25rem; }
            .h-7 { height: 1.75rem; }

            /* Animation */
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }

            .animate-pulse {
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }

            /* Backdrop */
            .backdrop-blur-md {
              backdrop-filter: blur(12px);
            }

            /* Misc */
            .max-w-2xl {
              max-width: 42rem;
            }

            .mx-auto {
              margin-left: auto;
              margin-right: auto;
            }

            @media print {
              body {
                padding: 20px;
              }
              
              @page {
                margin: 1cm;
                size: A4;
              }

              .print-section {
                page-break-inside: avoid;
              }

              * {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Trigger print dialog after content loads
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice #${payment.id.toString().padStart(6, '0')}`}
      size="xl"
      headerClassName="bg-gradient-to-r from-blue-600 to-blue-700 border-blue-700"
      titleClassName="text-lg md:text-2xl font-bold text-white"
    >
      <div className="space-y-4 md:space-y-6">
        {/* Action Buttons - Hidden in print */}
        <div className="no-print flex justify-end gap-2 md:gap-3">
          <Button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-700 flex items-center gap-1 md:gap-2 text-sm md:text-base px-3 md:px-4 py-2"
            suppressHydrationWarning
          >
            <Printer className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Print Invoice</span>
            <span className="sm:hidden">Print</span>
          </Button>
        </div>

        {/* Printable Content */}
        <div ref={printContentRef}>
          <PrintableInvoiceView payment={payment} />
        </div>
      </div>
    </Modal>
  );
}
