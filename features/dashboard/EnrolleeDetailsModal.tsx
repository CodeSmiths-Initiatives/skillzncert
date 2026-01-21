"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { EnrolleeData } from "@/lib/services/enrollment.service";
import { PrintableEnrolleeView } from "./PrintableEnrolleeView";
import { Printer, Download } from "lucide-react";
import { useRef } from "react";

interface EnrolleeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollee: EnrolleeData | null;
}

export function EnrolleeDetailsModal({
  isOpen,
  onClose,
  enrollee,
}: EnrolleeDetailsModalProps) {
  const printContentRef = useRef<HTMLDivElement>(null);

  if (!enrollee) return null;

  const handleDownloadPDF = () => {
    // Create a new window with the full content
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = printContentRef.current?.innerHTML || "";
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Enrollment - ${enrollee.firstName} ${enrollee.lastName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              background: white;
              color: #111827;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            .printable-content {
              max-width: 800px;
              margin: 0 auto;
            }

            .print-header {
              border-bottom: 3px solid #3b82f6;
              margin-bottom: 30px;
              padding-bottom: 20px;
            }

            .print-header h1 {
              font-size: 2rem;
              font-weight: bold;
              color: #111827;
              margin-bottom: 0.5rem;
            }

            .print-header p {
              color: #6b7280;
              font-size: 0.875rem;
            }

            .print-section {
              margin-bottom: 2rem;
              page-break-inside: avoid;
            }

            .print-section h2 {
              font-size: 1.25rem;
              font-weight: bold;
              color: #111827;
              margin-bottom: 1rem;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }

            .section-icon {
              display: inline-flex;
              padding: 0.5rem;
              border-radius: 0.5rem;
            }

            .bg-blue-100 { background-color: #dbeafe; }
            .bg-green-100 { background-color: #d1fae5; }
            .bg-purple-100 { background-color: #e9d5ff; }
            .bg-orange-100 { background-color: #fed7aa; }
            .bg-indigo-100 { background-color: #e0e7ff; }
            
            .text-blue-600 { color: #2563eb; }
            .text-green-600 { color: #059669; }
            .text-purple-600 { color: #9333ea; }
            .text-orange-600 { color: #ea580c; }
            .text-indigo-600 { color: #4f46e5; }

            .content-box {
              border-radius: 0.75rem;
              padding: 1.5rem;
              background: linear-gradient(to bottom right, #f0f9ff, #e0f2fe);
            }

            .bg-gradient-to-br.from-blue-50 { background: linear-gradient(to bottom right, #eff6ff, #dbeafe); }
            .bg-gradient-to-br.from-green-50 { background: linear-gradient(to bottom right, #f0fdf4, #d1fae5); }
            .bg-gradient-to-br.from-purple-50 { background: linear-gradient(to bottom right, #faf5ff, #e9d5ff); }
            .bg-gradient-to-br.from-orange-50 { background: linear-gradient(to bottom right, #fff7ed, #fed7aa); }
            .bg-gradient-to-br.from-indigo-50 { background: linear-gradient(to bottom right, #eef2ff, #e0e7ff); }

            .print-row {
              display: flex;
              justify-content: space-between;
              padding: 0.75rem 0;
              border-bottom: 1px solid #e5e7eb;
            }

            .print-row:last-child {
              border-bottom: none;
            }

            .print-row span:first-child {
              color: #6b7280;
              font-weight: 500;
            }

            .print-row span:last-child {
              color: #111827;
              font-weight: 600;
              text-align: right;
            }

            .status-badge {
              display: inline-block;
              padding: 0.5rem 1rem;
              border-radius: 9999px;
              font-size: 0.875rem;
              font-weight: bold;
            }

            .bg-green-100.text-green-700 {
              background-color: #d1fae5;
              color: #047857;
            }

            .bg-red-100.text-red-700 {
              background-color: #fee2e2;
              color: #b91c1c;
            }

            .footer {
              margin-top: 3rem;
              padding-top: 1.5rem;
              border-top: 2px solid #d1d5db;
              text-align: center;
            }

            .footer p {
              color: #6b7280;
              font-size: 0.875rem;
              margin-bottom: 0.5rem;
            }

            .footer p:last-child {
              color: #9ca3af;
              font-size: 0.75rem;
            }

            /* Image styling */
            img {
              max-width: 100%;
              height: auto;
              display: block;
            }

            .border-2 {
              border-width: 2px;
            }

            .border-indigo-200 {
              border-color: #c7d2fe;
            }

            .rounded-lg {
              border-radius: 0.5rem;
            }

            .overflow-hidden {
              overflow: hidden;
            }

            .bg-white {
              background-color: white;
            }

            .max-h-400 {
              max-height: 400px;
            }

            .object-contain {
              object-fit: contain;
            }

            @media print {
              body {
                padding: 20px;
              }
              
              @page {
                margin: 1cm;
                size: A4;
              }

              img {
                page-break-inside: avoid;
                max-height: 500px;
              }
            }

            svg {
              display: inline-block;
              width: 1.25rem;
              height: 1.25rem;
              vertical-align: middle;
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

  const handlePrint = () => {
    handleDownloadPDF();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${enrollee.firstName} ${enrollee.lastName}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Action Buttons - Hidden in print */}
        <div className="no-print flex justify-end gap-3">
          {/* <Button
            onClick={handleDownloadPDF}
            className="bg-green-500 hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download as PDF
          </Button> */}
          <Button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-700 flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Details
          </Button>
        </div>

        {/* Printable Content */}
        <div ref={printContentRef}>
          <PrintableEnrolleeView enrollee={enrollee} />
        </div>
      </div>
    </Modal>
  );
}
