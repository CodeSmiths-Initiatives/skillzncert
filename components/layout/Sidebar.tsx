// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

export interface SidebarItem {
  label: string;
  href: string;
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
};

interface SidebarProps {
  items: SidebarItem[];
  onClose?: () => void;
}

export function Sidebar({ items, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-blue-600 shadow-lg border-r border-blue-700 flex flex-col h-screen">
      <div className="p-6 border-b border-blue-500 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-white hover:bg-blue-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="px-4 flex-1 py-4">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = iconMap[item.iconName as keyof typeof iconMap];
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose} // Close sidebar on mobile when clicking a link
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-white",
                    isActive
                      ? "bg-blue-700 shadow-md"
                      : "hover:bg-blue-700 hover:shadow-md"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}