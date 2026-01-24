// components/layout/Sidebar.tsx
"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FileText,
  Shield,
  User,
  CreditCard,
  BookOpen,
  MessageSquare,
  Calendar,
} from "lucide-react";

export interface SidebarItem {
  label: string;
  route: string;
  iconName: string;
}

const iconMap = {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FileText,
  Shield,
  User,
  CreditCard,
  BookOpen,
  MessageSquare,
  Calendar,
};

interface SidebarProps {
  items: SidebarItem[];
  activeRoute: string;
  onNavigate: (route: string) => void;
  onClose?: () => void;
}

export function Sidebar({ items, activeRoute, onNavigate, onClose }: SidebarProps) {
  const handleClick = (route: string) => {
    onNavigate(route);
    onClose?.();
  };

  return (
    <aside className="w-64 bg-blue-600 shadow-lg border-r border-blue-700 flex flex-col h-full">
      <div className="p-6 border-b border-blue-500 flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        {/* Mobile close button */}
        <button
          suppressHydrationWarning
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-white hover:bg-blue-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="px-4 flex-1 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = iconMap[item.iconName as keyof typeof iconMap];
            const isActive = activeRoute === item.route;
            
            return (
              <li key={item.route}>
                <button
                  suppressHydrationWarning
                  onClick={() => handleClick(item.route)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-white w-full text-left",
                    isActive
                      ? "bg-blue-700 shadow-md"
                      : "hover:bg-blue-700 hover:shadow-md"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}