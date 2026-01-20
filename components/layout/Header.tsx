// components/layout/Header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth/logout.actions";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

interface HeaderProps {
  user: any;
  onMenuClick?: () => void;
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-blue-100 px-4 sm:px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              Welcome back, <span className="text-blue-600">{user.username}</span>!
            </h1>
            <p className="text-sm text-gray-600 hidden sm:block">Here's what's happening today.</p>
          </div>
        </div>
        <Button onClick={handleLogout} className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-sm px-3 py-2 sm:px-4 sm:py-2">
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">Exit</span>
        </Button>
      </div>
    </header>
  );
}