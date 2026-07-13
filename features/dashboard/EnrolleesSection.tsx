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
  Mail,
  Phone,
  Loader2,
  MoreVertical,
  Layers,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAllEnrollments } from "@/actions/enrollment/get-all-enrollments.actions";
import type {
  EnrolleeData,
  EnrollmentDashboardCounts,
  EnrollmentPagination,
} from "@/lib/services/enrollment.service";
import { EnrolleeDetailsModal } from "./EnrolleeDetailsModal";

const DEFAULT_PAGE_SIZE = 10;

type PaymentFilter = "all" | "paid" | "pending";

const emptyPagination: EnrollmentPagination = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  pageCount: 0,
  total: 0,
};

const emptyCounts: EnrollmentDashboardCounts = {
  total: 0,
  completed: 0,
  inProgress: 0,
  activeBatches: 0,
};

export function EnrolleesSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");

  const [enrollees, setEnrollees] = useState<EnrolleeData[]>([]);
  const [pagination, setPagination] =
    useState<EnrollmentPagination>(emptyPagination);
  const [counts, setCounts] = useState<EnrollmentDashboardCounts>(emptyCounts);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedEnrollee, setSelectedEnrollee] = useState<EnrolleeData | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  const fetchEnrollees = useCallback(
    async ({
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      showMainLoader = false,
      showRefreshLoader = false,
    }: {
      page?: number;
      pageSize?: number;
      showMainLoader?: boolean;
      showRefreshLoader?: boolean;
    } = {}) => {
      try {
        if (showMainLoader) setLoading(true);
        if (showRefreshLoader) setRefreshing(true);

        const result = await getAllEnrollments({
          page,
          pageSize,
          search: debouncedSearchTerm,
          batch: batchFilter,
          paymentStatus: paymentFilter,
        });

        if (!result.success) {
          console.warn(result.message);
          setEnrollees([]);
          setPagination(emptyPagination);
          setCounts(emptyCounts);
          return;
        }

        setEnrollees(result.data);
        setPagination(result.pagination);
        setCounts(result.counts);
      } catch (error) {
        console.error("Error fetching enrollees:", error);
        setEnrollees([]);
        setPagination(emptyPagination);
        setCounts(emptyCounts);
      } finally {
        if (showMainLoader) setLoading(false);
        if (showRefreshLoader) setRefreshing(false);
      }
    },
    [batchFilter, debouncedSearchTerm, paymentFilter],
  );

  useEffect(() => {
    fetchEnrollees({
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      showMainLoader: true,
    });
  }, [fetchEnrollees]);

  const handleRefresh = async () => {
    await fetchEnrollees({
      page: pagination.page || 1,
      pageSize: pagination.pageSize || DEFAULT_PAGE_SIZE,
      showRefreshLoader: true,
    });
  };

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > pagination.pageCount || page === pagination.page) {
      return;
    }

    await fetchEnrollees({
      page,
      pageSize: pagination.pageSize || DEFAULT_PAGE_SIZE,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExportToExcel = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone Number",
      "State",
      "Country",
      "University",
      "Referral Code",
      "Batch",
      "Payment Status",
      "Enrolled Date",
      "Year of Study",
    ];

    const csvRows = [
      headers.join(","),
      ...enrollees.map((enrollee) =>
        [
          `"${enrollee.firstName}"`,
          `"${enrollee.lastName}"`,
          `"${enrollee.email || enrollee.user?.email || "N/A"}"`,
          `"${enrollee.phoneNumber}"`,
          `"${enrollee.state || "N/A"}"`,
          `"${enrollee.country || "N/A"}"`,
          `"${enrollee.universityAttending || "N/A"}"`,
          `"${enrollee.referralCode || "N/A"}"`,
          `"${enrollee.batchName || "Not Assigned"}"`,
          `"${enrollee.isPaymentDone ? "Paid" : "Pending"}"`,
          `"${new Date(enrollee.createdAt).toLocaleDateString()}"`,
          `"${enrollee.yearOfStudy || "N/A"}"`,
        ].join(","),
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `enrollees_page_${pagination.page}_${
        new Date().toISOString().split("T")[0]
      }.csv`,
    );

    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    const closeDropdown = () => setOpenDropdown(null);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeDropdown);
    window.addEventListener("scroll", closeDropdown, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeDropdown);
      window.removeEventListener("scroll", closeDropdown, true);
    };
  }, []);

  const handleViewEnrollee = (enrollee: EnrolleeData) => {
    setSelectedEnrollee(enrollee);
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const toggleDropdown = (enrolleeId: number, button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect();
    const menuWidth = 192;
    const menuHeight = 48;
    const margin = 16;

    const left = Math.min(
      Math.max(margin, rect.right - menuWidth),
      window.innerWidth - menuWidth - margin,
    );

    const preferredTop = rect.bottom + 8;
    const top =
      preferredTop + menuHeight > window.innerHeight - margin
        ? Math.max(margin, rect.top - menuHeight - 8)
        : preferredTop;

    setDropdownPosition({ top, left });
    setOpenDropdown((current) => (current === enrolleeId ? null : enrolleeId));
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = pagination.pageCount;
    const currentPage = pagination.page;
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    if (currentPage <= 3) {
      for (let page = 1; page <= 4; page++) {
        pages.push(page);
      }

      pages.push("...");
      pages.push(totalPages);
      return pages;
    }

    if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");

      for (let page = totalPages - 3; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);
    pages.push("...");
    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);
    pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const stats = [
    {
      title: "Total Enrollees",
      value: counts.total,
      icon: Users,
      color: "blue",
    },
    {
      title: "Payment Done",
      value: counts.completed,
      icon: UserCheck,
      color: "green",
    },
    {
      title: "Payment Pending",
      value: counts.inProgress,
      icon: UserX,
      color: "red",
    },
    {
      title: "Active Batches",
      value: counts.activeBatches,
      icon: Layers,
      color: "purple",
    },
  ];

  const startEntry =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.pageSize + 1;

  const endEntry = Math.min(
    pagination.page * pagination.pageSize,
    pagination.total,
  );

  const hasActiveFilters =
    searchTerm || batchFilter !== "all" || paymentFilter !== "all";
  const activeDropdownEnrollee =
    enrollees.find((enrollee) => enrollee.id === openDropdown) || null;

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
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="p-6 bg-white shadow-sm border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>

              <div
                className={`p-4 rounded-full ${
                  stat.color === "blue"
                    ? "bg-blue-100"
                    : stat.color === "green"
                      ? "bg-green-100"
                      : stat.color === "red"
                        ? "bg-red-100"
                        : "bg-purple-100"
                }`}
              >
                <stat.icon
                  className={`h-8 w-8 ${
                    stat.color === "blue"
                      ? "text-blue-600"
                      : stat.color === "green"
                        ? "text-green-600"
                        : stat.color === "red"
                          ? "text-red-600"
                          : "text-purple-600"
                  }`}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-10"
            />
          </div>

          <div className="min-w-[160px]">
            <select
              value={batchFilter}
              onChange={(event) => setBatchFilter(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="all">All Batches</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>

          <div className="min-w-[160px]">
            <select
              value={paymentFilter}
              onChange={(event) =>
                setPaymentFilter(event.target.value as PaymentFilter)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {hasActiveFilters && (
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
      </Card>

      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Enrollees List
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({pagination.total}{" "}
              {pagination.total === 1 ? "record" : "records"})
            </span>
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportToExcel}
              disabled={enrollees.length === 0}
              className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export current page"
            >
              <Download className="h-5 w-5 text-green-600" />
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw
                className={`h-5 w-5 text-blue-600 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Student
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Contact
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Location
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Batch
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Enrolled Date
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Payment Status
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {enrollees.map((enrollee) => (
                <tr
                  key={enrollee.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {enrollee.firstName.charAt(0)}
                        {enrollee.lastName.charAt(0)}
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
                      <p className="text-sm text-gray-700 font-medium">
                        {enrollee.state || "N/A"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {enrollee.country || "N/A"}
                      </p>
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
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        enrollee.isPaymentDone
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {enrollee.isPaymentDone ? "Paid" : "Pending"}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-haspopup="menu"
                        aria-expanded={openDropdown === enrollee.id}
                        aria-label={`Open actions for ${enrollee.firstName} ${enrollee.lastName}`}
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={(event) =>
                          toggleDropdown(enrollee.id, event.currentTarget)
                        }
                        className="hover:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {enrollees.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No enrollees found</p>
            </div>
          )}
        </div>

        {pagination.total > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {startEntry} to {endEntry} of {pagination.total} entries
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-1">
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-1.5 text-gray-400"
                    >
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      variant={pagination.page === page ? "default" : "outline"}
                      size="sm"
                      className={`h-9 w-9 p-0 ${
                        pagination.page === page
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "hover:bg-blue-50"
                      }`}
                    >
                      {page}
                    </Button>
                  ),
                )}
              </div>

              <Button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pageCount}
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

      {activeDropdownEnrollee && (
        <div
          ref={dropdownRef}
          role="menu"
          className="fixed z-50 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-xl animate-fadeIn"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
          }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handleViewEnrollee(activeDropdownEnrollee)}
            className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-gray-700 transition-colors"
          >
            <Eye className="h-4 w-4 text-blue-600" />
            View Details
          </button>
        </div>
      )}

      <EnrolleeDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        enrollee={selectedEnrollee}
      />
    </div>
  );
}
