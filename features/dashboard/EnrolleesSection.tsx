"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Eye,
  Printer,
  Mail,
  Phone,
  Calendar,
  Loader2,
  MoreVertical,
  Layers,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getAllEnrollments } from "@/actions/enrollment/get-all-enrollments.actions";
import type { EnrolleeData } from "@/lib/services/enrollment.service";
import { EnrolleeDetailsModal } from "./EnrolleeDetailsModal";

export function EnrolleesSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [enrollees, setEnrollees] = useState<EnrolleeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEnrollee, setSelectedEnrollee] = useState<EnrolleeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const hasFetched = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchEnrollees = async () => {
      try {
        setLoading(true);
        const result = await getAllEnrollments();
        if (result.success) {
          setEnrollees(result.data);
        }
      } catch (error) {
        console.error("Error fetching enrollees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollees();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await getAllEnrollments();
      if (result.success) {
        setEnrollees(result.data);
        setCurrentPage(1); // Reset to first page on refresh
      }
    } catch (error) {
      console.error("Error refreshing enrollees:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewEnrollee = (enrollee: EnrolleeData) => {
    setSelectedEnrollee(enrollee);
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const handlePrintEnrollee = (enrollee: EnrolleeData) => {
    setSelectedEnrollee(enrollee);
    setIsModalOpen(true);
    setOpenDropdown(null);
    // Print will be triggered from the modal
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const toggleDropdown = (enrolleeId: number) => {
    setOpenDropdown(openDropdown === enrolleeId ? null : enrolleeId);
  };

  // Get unique batches from enrollees
  const uniqueBatches = Array.from(
    new Set(
      enrollees
        .map((e) => e.batchName)
        .filter((batch): batch is string => !!batch)
    )
  ).sort((a, b) => {
    // Sort by batch number
    const numA = parseInt(a.replace(/\D/g, "")) || 0;
    const numB = parseInt(b.replace(/\D/g, "")) || 0;
    return numA - numB;
  });

  const filteredEnrollees = enrollees.filter((enrollee) => {
    // Text search filter
    const matchesSearch =
      `${enrollee.firstName} ${enrollee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollee.phoneNumber.includes(searchTerm);

    // Batch filter
    const matchesBatch =
      batchFilter === "all" ||
      (batchFilter === "unassigned" && !enrollee.batchName) ||
      enrollee.batchName === batchFilter;

    // Payment filter
    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "paid" && enrollee.isPaymentDone) ||
      (paymentFilter === "pending" && !enrollee.isPaymentDone);

    return matchesSearch && matchesBatch && matchesPayment;
  }).sort((a, b) => {
    // Sort by enrollment date descending (newest first)
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredEnrollees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEnrollees = filteredEnrollees.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, batchFilter, paymentFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const stats = [
    {
      title: "Total Enrollees",
      value: enrollees.length,
      icon: Users,
      color: "blue",
    },
    {
      title: "Payment Done",
      value: enrollees.filter((e) => e.isPaymentDone).length,
      icon: UserCheck,
      color: "green",
    },
    {
      title: "Payment Pending",
      value: enrollees.filter((e) => !e.isPaymentDone).length,
      icon: UserX,
      color: "red",
    },
    {
      title: "Active Batches",
      value: uniqueBatches.length,
      icon: Layers,
      color: "purple",
    },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-1">Enrollees Management</h1>
          <p className="text-white/90">View and manage all enrolled students</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-1">Enrollees Management</h1>
        <p className="text-white/90">View and manage all enrolled students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-6 bg-white shadow-sm border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-full ${
                stat.color === "blue" ? "bg-blue-100" : 
                stat.color === "green" ? "bg-green-100" : 
                stat.color === "red" ? "bg-red-100" : 
                "bg-purple-100"
              }`}>
                <stat.icon className={`h-8 w-8 ${
                  stat.color === "blue" ? "text-blue-600" : 
                  stat.color === "green" ? "text-green-600" : 
                  stat.color === "red" ? "text-red-600" : 
                  "text-purple-600"
                }`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Batch Filter */}
          <div className="min-w-[160px]">
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="all">All Batches</option>
              <option value="unassigned">Unassigned</option>
              {uniqueBatches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="min-w-[160px]">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || batchFilter !== "all" || paymentFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setBatchFilter("all");
                setPaymentFilter("all");
              }}
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {(batchFilter !== "all" || paymentFilter !== "all") && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
            {batchFilter !== "all" && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                {batchFilter === "unassigned" ? "Unassigned Batch" : batchFilter}
                <button
                  onClick={() => setBatchFilter("all")}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {paymentFilter !== "all" && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                paymentFilter === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {paymentFilter === "paid" ? "Paid" : "Pending"}
                <button
                  onClick={() => setPaymentFilter("all")}
                  className={paymentFilter === "paid" ? "ml-1 hover:text-green-900" : "ml-1 hover:text-red-900"}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </Card>

      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Enrollees List
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredEnrollees.length} {filteredEnrollees.length === 1 ? "result" : "results"})
            </span>
          </h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`h-5 w-5 text-blue-600 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Student</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Location</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Batch</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Enrolled Date</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Education Year</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Payment Status</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEnrollees.map((enrollee) => (
                <tr
                  key={enrollee.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {enrollee.firstName.charAt(0)}{enrollee.lastName.charAt(0)}
                      </div>
                      <p className="font-semibold text-gray-900">
                        {enrollee.firstName} {enrollee.lastName}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {enrollee.email || enrollee.user?.email || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {enrollee.phoneNumber}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700 font-medium">{enrollee.state || "N/A"}</p>
                      <p className="text-xs text-gray-500">{enrollee.country || "N/A"}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {enrollee.batchName ? (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {enrollee.batchName}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                        Not Assigned
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-700">
                      {new Date(enrollee.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {enrollee.yearOfStudy || "N/A"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${enrollee.isPaymentDone ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {enrollee.isPaymentDone ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="relative" ref={openDropdown === enrollee.id ? dropdownRef : null}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDropdown(enrollee.id)}
                        className="hover:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>

                      {/* Dropdown Menu */}
                      {openDropdown === enrollee.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 animate-fadeIn">
                          <button
                            onClick={() => handleViewEnrollee(enrollee)}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-gray-700 transition-colors"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                            View Details
                          </button>
                          {/* <button
                            onClick={() => handlePrintEnrollee(enrollee)}
                            className="w-full text-left px-4 py-2 hover:bg-green-50 flex items-center gap-2 text-gray-700 transition-colors"
                          >
                            <Printer className="h-4 w-4 text-green-600" />
                            Print Details
                          </button> */}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEnrollees.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No enrollees found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredEnrollees.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredEnrollees.length)} of {filteredEnrollees.length} entries
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex gap-1">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-1.5 text-gray-400">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={`h-9 w-9 p-0 ${
                        currentPage === page
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "hover:bg-blue-50"
                      }`}
                    >
                      {page}
                    </Button>
                  )
                ))}
              </div>
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Enrollee Details Modal */}
      <EnrolleeDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        enrollee={selectedEnrollee}
      />
    </div>
  );
}
