"use client";

import { EnrolleeData } from "@/lib/services/enrollment.service";
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, CreditCard, FileText, Image as ImageIcon } from "lucide-react";

interface PrintableEnrolleeViewProps {
  enrollee: EnrolleeData;
}

export function PrintableEnrolleeView({ enrollee }: PrintableEnrolleeViewProps) {
  return (
    <div className="printable-content">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .printable-content {
            width: 100%;
            max-width: none;
            padding: 20px;
          }
          
          .no-print {
            display: none !important;
          }

          .print-section {
            page-break-inside: avoid;
          }

          .print-header {
            border-bottom: 3px solid #3b82f6;
            margin-bottom: 30px;
            padding-bottom: 20px;
          }

          .print-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Print Header */}
      <div className="print-header mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enrollment Details
            </h1>
            <p className="text-gray-600">
              Generated on {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {/* <div className="text-right">
            <p className="text-sm text-gray-600">Document ID</p>
            <p className="font-mono text-sm font-semibold text-gray-900">
              {enrollee.documentId}
            </p>
          </div> */}
        </div>
      </div>

      {/* Personal Information */}
      <div className="print-section mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4">
          <div className="print-row flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Full Name</span>
            <span className="text-gray-900 font-semibold">
              {enrollee.firstName} {enrollee.lastName}
            </span>
          </div>
          
          <div className="print-row flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </span>
            <span className="text-gray-900 font-semibold">
              {enrollee.email || enrollee.user?.email || "N/A"}
            </span>
          </div>
          
          <div className="print-row flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </span>
            <span className="text-gray-900 font-semibold">
              {enrollee.phoneNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="print-section mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <MapPin className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Location</h2>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 space-y-4">
          <div className="print-row flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">State</span>
            <span className="text-gray-900 font-semibold">
              {enrollee.state || "N/A"}
            </span>
          </div>
          
          <div className="print-row flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Country</span>
            <span className="text-gray-900 font-semibold">
              {enrollee.country || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Education Information */}
      <div className="print-section mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <GraduationCap className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Education</h2>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 space-y-4">
          <div className="print-row flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Year of Study</span>
            <span className="text-gray-900 font-semibold">
              {enrollee.yearOfStudy || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Enrollment Information */}
      <div className="print-section mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Calendar className="h-5 w-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Enrollment Details</h2>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 space-y-4">
          <div className="print-row flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Enrolled Date</span>
            <span className="text-gray-900 font-semibold">
              {new Date(enrollee.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          
          <div className="print-row flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Last Updated</span>
            <span className="text-gray-900 font-semibold">
              {new Date(enrollee.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          
          <div className="print-row flex justify-between py-3">
            <span className="text-gray-600 font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Status
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              enrollee.isPaymentDone 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {enrollee.isPaymentDone ? "✓ PAID" : "✗ PENDING"}
            </span>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      {(enrollee.passport || enrollee.schoolIdCard) && (
        <div className="print-section mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Uploaded Documents</h2>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 space-y-6">
            {/* Passport */}
            {enrollee.passport && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <ImageIcon className="h-5 w-5 text-indigo-600" />
                  <span>Passport Photo</span>
                </div>
                <div className="border-2 border-indigo-200 rounded-lg overflow-hidden bg-white">
                  <img
                    src={enrollee.passport.url}
                    alt="Passport"
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                </div>
                <p className="text-sm text-gray-500 italic">File: {enrollee.passport.name}</p>
              </div>
            )}

            {/* School ID Card */}
            {enrollee.schoolIdCard && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <ImageIcon className="h-5 w-5 text-indigo-600" />
                  <span>School ID Card</span>
                </div>
                <div className="border-2 border-indigo-200 rounded-lg overflow-hidden bg-white">
                  <img
                    src={enrollee.schoolIdCard.url}
                    alt="School ID Card"
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                </div>
                <p className="text-sm text-gray-500 italic">File: {enrollee.schoolIdCard.name}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t-2 border-gray-300">
        <p className="text-sm text-gray-500 text-center">
          This is an official enrollment record generated by the system.
        </p>
        <p className="text-xs text-gray-400 text-center mt-2">
          For verification purposes, please contact administration with Document ID: {enrollee.documentId}
        </p>
      </div>
    </div>
  );
}
