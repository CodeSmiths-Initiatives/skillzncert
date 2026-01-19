// components/layout/DashboardLayout.tsx
"use client";

import { ReactNode, useState } from "react";
import { Sidebar, SidebarItem } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
  user: any;
}

export function DashboardLayout({ children, sidebarItems, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 h-screen
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar items={sidebarItems} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col bg-white shadow-inner min-w-0 h-screen">
          <Header user={user} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 bg-blue-50 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}