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
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getAllEnrollments } from "@/actions/enrollment/get-all-enrollments.actions";
import type { EnrolleeData } from "@/lib/services/enrollment.service";
import { EnrolleeDetailsModal } from "./EnrolleeDetailsModal";

export function EnrolleesSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollees, setEnrollees] = useState<EnrolleeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnrollee, setSelectedEnrollee] = useState<EnrolleeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
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

  const filteredEnrollees = enrollees.filter(
    (enrollee) =>
      `${enrollee.firstName} ${enrollee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollee.phoneNumber.includes(searchTerm)
  );

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className={`p-4 rounded-full ${stat.color === "blue" ? "bg-blue-100" : stat.color === "green" ? "bg-green-100" : "bg-red-100"}`}>
                <stat.icon className={`h-8 w-8 ${stat.color === "blue" ? "text-blue-600" : stat.color === "green" ? "text-green-600" : "text-red-600"}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <div className="flex items-center justify-between gap-4 flex-wrap">
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
          {/* <Button className="bg-blue-500 hover:bg-blue-700">
            <Users className="h-4 w-4 mr-2" />
            Add Enrollee
          </Button> */}
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Student</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Location</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Enrolled Date</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Education Level</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Payment Status</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollees.map((enrollee) => (
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
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(enrollee.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {enrollee.currentEducationLevel || "N/A"}
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
