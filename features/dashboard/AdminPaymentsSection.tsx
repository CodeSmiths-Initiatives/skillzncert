"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllPayments } from "@/actions/payment/get-payments.actions";
import { getAdminPaymentDues } from "@/actions/payment/payment-dues.actions";
import type { PaymentData } from "@/lib/services/payment.service";
import type { PaymentDueData } from "@/lib/services/payment-due.service";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Loader2,
  MoreVertical,
  Printer,
  Receipt,
  RefreshCw,
  RotateCcw,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PaymentStatus = "completed" | "pending" | "overdue" | "cancelled";
type StatusFilter = "all" | PaymentStatus;

type AdminPaymentRecord =
  | {
      key: string;
      source: "payment";
      status: "completed";
      payment: PaymentData;
      amount: number;
      studentName: string;
      studentEmail: string;
      planName: string;
      reference: string;
      paymentDate: string;
      dueDate: string;
    }
  | {
      key: string;
      source: "due";
      status: "pending" | "overdue" | "cancelled";
      due: PaymentDueData;
      amount: number;
      studentName: string;
      studentEmail: string;
      planName: string;
      reference: string;
      paymentDate: string;
      dueDate: string;
    };

const PAGE_SIZE = 10;

const emptyFilters = {
  status: "all" as StatusFilter,
  search: "",
  plan: "all",
  dateFrom: "",
  dateTo: "",
};

function formatMoney(amount: number) {
  return `NGN ${Math.round(amount || 0).toLocaleString()}`;
}

function formatDate(dateString: string) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStudentName(record: {
  enrollment?: { firstName?: string; lastName?: string };
  emailAddress?: string;
}) {
  const fullName = [
    record.enrollment?.firstName,
    record.enrollment?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || record.emailAddress || "Student";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getRecordDate(record: AdminPaymentRecord) {
  return record.paymentDate || record.dueDate || "";
}

function isDateInRange(record: AdminPaymentRecord, dateFrom: string, dateTo: string) {
  const rawDate = getRecordDate(record);
  if (!rawDate) return !dateFrom && !dateTo;

  const timestamp = new Date(rawDate).getTime();
  if (Number.isNaN(timestamp)) return false;

  if (dateFrom) {
    const fromTime = new Date(dateFrom).setHours(0, 0, 0, 0);
    if (timestamp < fromTime) return false;
  }

  if (dateTo) {
    const toTime = new Date(dateTo).setHours(23, 59, 59, 999);
    if (timestamp > toTime) return false;
  }

  return true;
}

function statusLabel(status: PaymentStatus) {
  switch (status) {
    case "completed":
      return "Completed";
    case "pending":
      return "Pending";
    case "overdue":
      return "Overdue";
    case "cancelled":
      return "Cancelled";
  }
}

function statusClasses(status: PaymentStatus) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "overdue":
      return "bg-red-100 text-red-700 border-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

function buildPrintHtml(record: AdminPaymentRecord, documentType: "invoice" | "receipt") {
  const title = documentType === "invoice" ? "Invoice" : "Receipt";
  const documentNumber = `${documentType === "invoice" ? "INV" : "RCT"}-${record.key
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-8)
    .toUpperCase()}`;

  const rows = [
    ["Student", record.studentName],
    ["Email", record.studentEmail],
    ["Plan/Course", record.planName || "N/A"],
    ["Amount", formatMoney(record.amount)],
    ["Status", statusLabel(record.status)],
    ["Payment Date", formatDate(record.paymentDate)],
    ["Due Date", formatDate(record.dueDate)],
    ["Reference", record.reference || "N/A"],
  ];

  return `<!DOCTYPE html>
<html>
  <head>
    <title>${title} - ${escapeHtml(documentNumber)}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 40px;
        color: #111827;
        font-family: Arial, Helvetica, sans-serif;
        background: #ffffff;
      }
      .document {
        max-width: 820px;
        margin: 0 auto;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        padding: 32px;
        background: #2563eb;
        color: #ffffff;
      }
      .header-row {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: flex-start;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 38px;
        letter-spacing: 0;
      }
      .muted {
        color: #dbeafe;
        font-size: 14px;
      }
      .status {
        padding: 8px 12px;
        border-radius: 999px;
        background: #ffffff;
        color: #1d4ed8;
        font-weight: 700;
        white-space: nowrap;
      }
      .content {
        padding: 32px;
      }
      .section-title {
        margin: 0 0 16px;
        font-size: 18px;
        color: #111827;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      td {
        padding: 14px 0;
        border-bottom: 1px solid #e5e7eb;
        vertical-align: top;
      }
      td:first-child {
        width: 180px;
        color: #6b7280;
        font-weight: 700;
      }
      .total {
        margin-top: 28px;
        padding: 24px;
        border-radius: 8px;
        background: #f3f4f6;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }
      .total strong {
        font-size: 28px;
      }
      .footer {
        margin-top: 36px;
        color: #6b7280;
        font-size: 13px;
        line-height: 1.5;
      }
      @media print {
        body { padding: 18px; }
        .document { border-color: #9ca3af; }
        @page { margin: 1cm; size: A4; }
      }
    </style>
  </head>
  <body>
    <main class="document">
      <section class="header">
        <div class="header-row">
          <div>
            <h1>${title}</h1>
            <div class="muted">Skillz'n'Cert - Sec-Concepts Networks</div>
            <div class="muted">${escapeHtml(documentNumber)}</div>
          </div>
          <div class="status">${escapeHtml(statusLabel(record.status))}</div>
        </div>
      </section>
      <section class="content">
        <h2 class="section-title">Student and payment details</h2>
        <table>
          <tbody>
            ${rows
              .map(
                ([label, value]) =>
                  `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
        <div class="total">
          <span>Total</span>
          <strong>${escapeHtml(formatMoney(record.amount))}</strong>
        </div>
        <p class="footer">
          This ${documentType} was generated from the Skillz'n'Cert admin dashboard.
          Receipt documents are issued only for completed payments.
        </p>
      </section>
    </main>
  </body>
</html>`;
}

export function AdminPaymentsSection() {
  const [records, setRecords] = useState<AdminPaymentRecord[]>([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedRecord, setSelectedRecord] = useState<AdminPaymentRecord | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const mapRecords = useCallback(
    (payments: PaymentData[], dues: PaymentDueData[]): AdminPaymentRecord[] => {
      const completedRecords: AdminPaymentRecord[] = payments.map((payment) => ({
        key: `payment-${payment.documentId || payment.id}`,
        source: "payment",
        status: "completed",
        payment,
        amount: Number(payment.amount || 0),
        studentName: getStudentName(payment),
        studentEmail: payment.emailAddress || "N/A",
        planName: payment.planName || "",
        reference: payment.reference || payment.documentId || "",
        paymentDate: payment.paymentDate,
        dueDate: payment.nextPaymentDate || "",
      }));

      const dueRecords: AdminPaymentRecord[] = dues
        .filter((due) => due.status !== "paid")
        .map((due) => ({
          key: `due-${due.documentId || due.id}`,
          source: "due",
          status: due.status === "overdue" || due.status === "cancelled" ? due.status : "pending",
          due,
          amount: Number(due.dueAmount || 0) / 100,
          studentName: getStudentName(due),
          studentEmail: due.emailAddress || "N/A",
          planName: due.planName || "",
          reference: due.paymentReference || due.paymentDocumentId || due.documentId || "",
          paymentDate: due.paidDate || "",
          dueDate: due.dueDate,
        }));

      return [...completedRecords, ...dueRecords].sort((a, b) => {
        const aTime = new Date(getRecordDate(a)).getTime() || 0;
        const bTime = new Date(getRecordDate(b)).getTime() || 0;
        return bTime - aTime;
      });
    },
    [],
  );

  const fetchAdminPayments = useCallback(
    async ({ showMainLoader = false, showRefreshLoader = false } = {}) => {
      try {
        if (showMainLoader) setLoading(true);
        if (showRefreshLoader) setRefreshing(true);
        setError("");

        const [paymentsResult, duesResult] = await Promise.all([
          getAllPayments(),
          getAdminPaymentDues(),
        ]);

        if (!paymentsResult.success) {
          throw new Error(paymentsResult.message || "Failed to fetch payments");
        }

        if (!duesResult.success) {
          throw new Error(duesResult.message || "Failed to fetch payment dues");
        }

        setRecords(mapRecords(paymentsResult.data, duesResult.data));
      } catch (fetchError) {
        console.error("Error fetching admin payments:", fetchError);
        setRecords([]);
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load payments");
      } finally {
        if (showMainLoader) setLoading(false);
        if (showRefreshLoader) setRefreshing(false);
      }
    },
    [mapRecords],
  );

  useEffect(() => {
    fetchAdminPayments({ showMainLoader: true });
  }, [fetchAdminPayments]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuKey(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenuKey(null);
        setSelectedRecord(null);
      }
    };

    const closeMenu = () => setOpenMenuKey(null);

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, []);

  const analytics = useMemo(() => {
    const completed = records.filter((record) => record.status === "completed");
    const pending = records.filter((record) => record.status === "pending");
    const overdue = records.filter((record) => record.status === "overdue");

    return {
      completedCount: completed.length,
      completedRevenue: completed.reduce((sum, record) => sum + record.amount, 0),
      pendingAmount: pending.reduce((sum, record) => sum + record.amount, 0),
      pendingCount: pending.length,
      overdueAmount: overdue.reduce((sum, record) => sum + record.amount, 0),
      overdueCount: overdue.length,
    };
  }, [records]);

  const planOptions = useMemo(() => {
    const plans = new Set(records.map((record) => record.planName).filter(Boolean));
    return Array.from(plans).sort((a, b) => a.localeCompare(b));
  }, [records]);

  const filteredRecords = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return records.filter((record) => {
      if (filters.status !== "all" && record.status !== filters.status) return false;
      if (filters.plan !== "all" && record.planName !== filters.plan) return false;
      if (!isDateInRange(record, filters.dateFrom, filters.dateTo)) return false;

      if (!search) return true;

      return [
        record.studentName,
        record.studentEmail,
        record.planName,
        record.reference,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
  }, [filters, records]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paginatedRecords = filteredRecords.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const startEntry = filteredRecords.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endEntry = Math.min(safePage * PAGE_SIZE, filteredRecords.length);
  const hasActiveFilters =
    filters.status !== "all" ||
    filters.search ||
    filters.plan !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  const handleRefresh = () => {
    fetchAdminPayments({ showRefreshLoader: true });
  };

  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
  };

  const toggleMenu = (recordKey: string, button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: Math.max(16, rect.right - 224),
    });
    setOpenMenuKey((current) => (current === recordKey ? null : recordKey));
  };

  const handleViewDetails = (record: AdminPaymentRecord) => {
    setSelectedRecord(record);
    setOpenMenuKey(null);
  };

  const handlePrint = (record: AdminPaymentRecord, type: "invoice" | "receipt") => {
    if (type === "receipt" && record.status !== "completed") return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(buildPrintHtml(record, type));
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
    setOpenMenuKey(null);
  };

  const activeMenuRecord = records.find((record) => record.key === openMenuKey) || null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-1">Payments</h1>
          <p className="text-white/90">Review student payments and billing status</p>
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Payments</h1>
            <p className="text-white/90">Review student payments and billing status</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white text-blue-700 hover:bg-blue-50"
          >
            <RefreshCw className={refreshing ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="p-4 border-red-200 bg-red-50 text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Completed Payments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.completedCount}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Completed Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatMoney(analytics.completedRevenue)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Receipt className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.pendingCount}</p>
              <p className="text-sm text-gray-500 mt-1">{formatMoney(analytics.pendingAmount)}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-100">
              <Clock className="h-7 w-7 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Overdue Payments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.overdueCount}</p>
              <p className="text-sm text-gray-500 mt-1">{formatMoney(analytics.overdueAmount)}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5 bg-white border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
          <div className="relative xl:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search student, email, plan, reference"
              className="pl-9"
            />
          </div>

          <select
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value as StatusFilter)}
            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filters.plan}
            onChange={(event) => updateFilter("plan", event.target.value)}
            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by plan or course"
          >
            <option value="all">All plans</option>
            {planOptions.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>

          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => updateFilter("dateFrom", event.target.value)}
            aria-label="Filter from date"
          />

          <Input
            type="date"
            value={filters.dateTo}
            onChange={(event) => updateFilter("dateTo", event.target.value)}
            aria-label="Filter to date"
          />
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4" />
              Reset filters
            </Button>
          </div>
        )}
      </Card>

      <Card className="bg-white border-gray-100 shadow-sm">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Payment Records</h2>
            <p className="text-sm text-gray-500">
              Showing {startEntry} to {endEntry} of {filteredRecords.length} records
            </p>
          </div>
          <p className="text-sm text-gray-500">Page {safePage} of {pageCount}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px]">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">Student</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">Plan/Course</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">Reference</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">Payment Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">Due Date</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record) => (
                <tr key={record.key} className="border-b border-gray-100 hover:bg-blue-50/40">
                  <td className="px-4 py-4">
                    <p className="max-w-[180px] truncate font-semibold text-gray-900">
                      {record.studentName}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="max-w-[210px] truncate text-sm text-gray-600">
                      {record.studentEmail}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="max-w-[180px] truncate text-sm text-gray-700">
                      {record.planName || "N/A"}
                    </p>
                  </td>
                  <td className="px-4 py-4 font-semibold text-gray-900">
                    {formatMoney(record.amount)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusClasses(
                        record.status,
                      )}`}
                    >
                      {statusLabel(record.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="max-w-[150px] truncate font-mono text-xs text-gray-600">
                      {record.reference || "N/A"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {formatDate(record.paymentDate)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {formatDate(record.dueDate)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-haspopup="menu"
                      aria-expanded={openMenuKey === record.key}
                      aria-label={`Open actions for ${record.studentName}`}
                      onClick={(event) => toggleMenu(record.key, event.currentTarget)}
                      className="hover:bg-blue-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedRecords.length === 0 && (
            <div className="py-14 text-center">
              <Receipt className="mx-auto mb-4 h-14 w-14 text-gray-300" />
              <p className="font-semibold text-gray-700">No payment records found</p>
              <p className="mt-1 text-sm text-gray-500">Adjust filters or refresh the payment list.</p>
            </div>
          )}
        </div>

        {filteredRecords.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              {PAGE_SIZE} records per page
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={safePage <= 1}
                className="h-9 w-9 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-20 text-center text-sm font-medium text-gray-700">
                {safePage} / {pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                disabled={safePage >= pageCount}
                className="h-9 w-9 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {activeMenuRecord && openMenuKey && (
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-50 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handleViewDetails(activeMenuRecord)}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50"
          >
            <Eye className="h-4 w-4 text-blue-600" />
            View details
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => handlePrint(activeMenuRecord, "invoice")}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50"
          >
            <FileText className="h-4 w-4 text-blue-600" />
            Print invoice
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={activeMenuRecord.status !== "completed"}
            onClick={() => handlePrint(activeMenuRecord, "receipt")}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white"
          >
            <Printer className="h-4 w-4 text-green-600" />
            Print receipt
          </button>
        </div>
      )}

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
                <p className="text-sm text-gray-500">{selectedRecord.reference || selectedRecord.key}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["Student", selectedRecord.studentName],
                ["Email", selectedRecord.studentEmail],
                ["Plan/Course", selectedRecord.planName || "N/A"],
                ["Amount", formatMoney(selectedRecord.amount)],
                ["Status", statusLabel(selectedRecord.status)],
                ["Reference", selectedRecord.reference || "N/A"],
                ["Payment Date", formatDate(selectedRecord.paymentDate)],
                ["Due Date", formatDate(selectedRecord.dueDate)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-gray-200 p-3">
                  <p className="text-xs font-bold uppercase text-gray-500">{label}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={() => handlePrint(selectedRecord, "invoice")}>
                <FileText className="h-4 w-4" />
                Print invoice
              </Button>
              <Button
                onClick={() => handlePrint(selectedRecord, "receipt")}
                disabled={selectedRecord.status !== "completed"}
                className="bg-green-600 hover:bg-green-700"
              >
                <Printer className="h-4 w-4" />
                Print receipt
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
