// features/dashboard/DashboardContent.tsx
"use client";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BookOpen,
  CheckCircle,
  Clock,
  BarChart3,
  Settings
} from "lucide-react";

interface DashboardContentProps {
  isAdmin: boolean;
}

export function DashboardContent({ isAdmin }: DashboardContentProps) {
  const stats = isAdmin ? [
    { title: "Total Enrollees", value: "1,234", icon: Users, change: "+12%" },
    { title: "Revenue", value: "$45,678", icon: DollarSign, change: "+8%" },
    { title: "Completed", value: "89", icon: BookOpen, change: "+5%" },
    { title: "In Progress", value: "76", icon: TrendingUp, change: "+3%" },
  ] : [
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
          <Card key={index} className="hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 group border-t-4 border-t-blue-500 ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-700">
                {stat.title}
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <stat.icon className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>              
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 hover:shadow-xl hover:shadow-emerald-200/50 transition-all duration-300 group border-t-4 border-t-emerald-500">
          <CardHeader className="border-b border-emerald-100/50">
            <CardTitle className="text-slate-800 group-hover:text-slate-900 flex items-center">
              <div className="p-1.5 bg-emerald-100 rounded-md mr-2 group-hover:bg-emerald-200 transition-colors">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-64 overflow-y-auto">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">Completed Advanced React Course</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
              <Badge variant="default" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Completed</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">Enrolled in Node.js Masterclass</p>
                <p className="text-xs text-slate-500">1 day ago</p>
              </div>
              <Badge variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">In Progress</Badge>
            </div>
            {/* Additional activity items for scrolling demo */}
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">Submitted Assignment #3</p>
                <p className="text-xs text-slate-500">3 days ago</p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200">Graded</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">Joined Study Group</p>
                <p className="text-xs text-slate-500">5 days ago</p>
              </div>
              <Badge variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">Active</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">Certificate Earned</p>
                <p className="text-xs text-slate-500">1 week ago</p>
              </div>
              <Badge variant="default" className="bg-orange-100 text-orange-700 hover:bg-orange-200">Achievement</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-0 hover:shadow-xl hover:shadow-violet-200/50 transition-all duration-300 group border-t-4 border-t-violet-500">
          <CardHeader className="border-b border-violet-100/50">
            <CardTitle className="text-slate-800 group-hover:text-slate-900 flex items-center">
              <div className="p-1.5 bg-violet-100 rounded-md mr-2 group-hover:bg-violet-200 transition-colors">
                <Clock className="h-4 w-4 text-violet-600" />
              </div>
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-64 overflow-y-auto">
            {/* Monday */}
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-violet-100">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                <span className="font-medium text-slate-700">Monday</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-violet-700">10:00 AM - 3:00 PM</span>
                <p className="text-xs text-slate-500">React Fundamentals</p>
              </div>
            </div>

            {/* Tuesday */}
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-violet-100">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                <span className="font-medium text-slate-700">Tuesday</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-violet-700">10:00 AM - 5:00 PM</span>
                <p className="text-xs text-slate-500">Advanced JavaScript</p>
              </div>
            </div>

            {/* Wednesday */}
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-violet-100">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                <span className="font-medium text-slate-700">Wednesday</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-violet-700">2:00 PM - 6:00 PM</span>
                <p className="text-xs text-slate-500">TypeScript Essentials</p>
              </div>
            </div>

            {/* Thursday */}
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-violet-100">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                <span className="font-medium text-slate-700">Thursday</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-violet-700">10:00 AM - 4:00 PM</span>
                <p className="text-xs text-slate-500">Next.js Advanced</p>
              </div>
            </div>

            {/* Friday */}
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-violet-100">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                <span className="font-medium text-slate-700">Friday</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-violet-700">1:00 PM - 5:00 PM</span>
                <p className="text-xs text-slate-500">Project Workshop</p>
              </div>
            </div>

            {/* Saturday - Optional */}
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-violet-100">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-violet-400 rounded-full"></div>
                <span className="font-medium text-slate-700">Saturday</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-violet-600">11:00 AM - 2:00 PM</span>
                <p className="text-xs text-slate-500">Office Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin-specific content */}
      {/* {isAdmin && (
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 hover:shadow-xl hover:shadow-amber-200/50 transition-all duration-300 group border-t-4 border-t-amber-500">
          <CardHeader className="border-b border-amber-100/50">
            <CardTitle className="text-slate-800 group-hover:text-slate-900 flex items-center">
              <div className="p-1.5 bg-amber-100 rounded-md mr-2 group-hover:bg-amber-200 transition-colors">
                <Settings className="h-4 w-4 text-amber-600" />
              </div>
              Admin Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col items-center justify-center border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 group/btn">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 mb-2 text-amber-600 group-hover/btn:text-amber-700" />
                <span className="text-xs font-medium text-slate-700 group-hover/btn:text-slate-800 text-center">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col items-center justify-center border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 group/btn">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 mb-2 text-amber-600 group-hover/btn:text-amber-700" />
                <span className="text-xs font-medium text-slate-700 group-hover/btn:text-slate-800 text-center">Course Management</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col items-center justify-center border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 group/btn">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 mb-2 text-amber-600 group-hover/btn:text-amber-700" />
                <span className="text-xs font-medium text-slate-700 group-hover/btn:text-slate-800 text-center">View Reports</span>
              </Button>
              <Button variant="outline" className="h-16 sm:h-20 flex flex-col items-center justify-center border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 group/btn">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 mb-2 text-amber-600 group-hover/btn:text-amber-700" />
                <span className="text-xs font-medium text-slate-700 group-hover/btn:text-slate-800 text-center">System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}