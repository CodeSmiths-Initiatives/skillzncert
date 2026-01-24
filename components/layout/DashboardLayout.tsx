// components/layout/DashboardLayout.tsx
"use client";

import { ReactNode, useState } from "react";
import { Sidebar, SidebarItem } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
  activeRoute: string;
  onNavigate: (route: string) => void;
  user: any;
}

export function DashboardLayout({ 
  children, 
  sidebarItems, 
  activeRoute,
  onNavigate,
  user 
}: DashboardLayoutProps) {
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

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar 
            items={sidebarItems} 
            activeRoute={activeRoute}
            onNavigate={onNavigate}
            onClose={() => setSidebarOpen(false)} 
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col bg-white shadow-inner min-w-0 lg:ml-64">
          <Header user={user} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 bg-blue-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}