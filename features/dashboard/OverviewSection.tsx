"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  CheckCircle,
  Clock,
} from "lucide-react";

export function OverviewSection({ isAdmin }: { isAdmin: boolean }) {
  const stats = isAdmin
    ? [
        { title: "Total Enrollees", value: "1,234", icon: Users, change: "+12%" },
        { title: "Revenue", value: "$45,678", icon: DollarSign, change: "+8%" },
        { title: "Completed", value: "89", icon: BookOpen, change: "+5%" },
        { title: "In Progress", value: "76", icon: TrendingUp, change: "+3%" },
      ]
    : [
        { title: "Attendance", value: "90%", icon: BookOpen, change: null },
        { title: "Completed", value: "3", icon: CheckCircle, change: null },
        { title: "On Leave", value: "2", icon: Clock, change: null },
        { title: "Plan", value: "Monthly", icon: TrendingUp, change: null },
      ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 group border-t-4 border-t-blue-500"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-700">
                {stat.title}
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <stat.icon className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 min-h-[calc(100vh-280px)]">
        {/* Recent Activity */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 hover:shadow-xl hover:shadow-emerald-200/50 transition-all duration-300 group border-t-4 border-t-emerald-500 flex flex-col">
          <CardHeader className="border-b border-emerald-100/50 flex-shrink-0">
            <CardTitle className="text-slate-800 group-hover:text-slate-900 flex items-center">
              <div className="p-1.5 bg-emerald-100 rounded-md mr-2 group-hover:bg-emerald-200 transition-colors">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto flex-1">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  Completed Advanced React Course
                </p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
              <Badge
                variant="default"
                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              >
                Completed
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  Enrolled in Node.js Masterclass
                </p>
                <p className="text-xs text-slate-500">1 day ago</p>
              </div>
              <Badge
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                In Progress
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  Submitted Assignment #3
                </p>
                <p className="text-xs text-slate-500">3 days ago</p>
              </div>
              <Badge
                variant="default"
                className="bg-green-100 text-green-700 hover:bg-green-200"
              >
                Graded
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  Joined Study Group
                </p>
                <p className="text-xs text-slate-500">5 days ago</p>
              </div>
              <Badge
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Active
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  Certificate Earned
                </p>
                <p className="text-xs text-slate-500">1 week ago</p>
              </div>
              <Badge
                variant="default"
                className="bg-orange-100 text-orange-700 hover:bg-orange-200"
              >
                Achievement
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-0 hover:shadow-xl hover:shadow-violet-200/50 transition-all duration-300 group border-t-4 border-t-violet-500 flex flex-col">
          <CardHeader className="border-b border-violet-100/50 flex-shrink-0">
            <CardTitle className="text-slate-800 group-hover:text-slate-900 flex items-center">
              <div className="p-1.5 bg-violet-100 rounded-md mr-2 group-hover:bg-violet-200 transition-colors">
                <Clock className="h-4 w-4 text-violet-600" />
              </div>
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto flex-1">
            {[
              { day: "Monday", time: "10:00 AM - 3:00 PM", course: "React Fundamentals" },
              { day: "Tuesday", time: "10:00 AM - 5:00 PM", course: "Advanced JavaScript" },
              { day: "Wednesday", time: "2:00 PM - 6:00 PM", course: "TypeScript Essentials" },
              { day: "Thursday", time: "10:00 AM - 4:00 PM", course: "Next.js Advanced" },
              { day: "Friday", time: "1:00 PM - 5:00 PM", course: "Project Workshop" },
              { day: "Saturday", time: "11:00 AM - 2:00 PM", course: "Office Hours" },
            ].map((schedule, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-violet-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                  <span className="font-medium text-slate-700">{schedule.day}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-violet-700">
                    {schedule.time}
                  </span>
                  <p className="text-xs text-slate-500">{schedule.course}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
