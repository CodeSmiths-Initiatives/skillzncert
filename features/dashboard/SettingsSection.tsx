"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Bell,
  Lock,
  Globe,
  User,
  Mail,
  Shield,
  Database,
} from "lucide-react";
import { useState } from "react";

export function SettingsSection() {
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-white/90">
          Manage your system preferences and configurations
        </p>
      </div>

      {/* Account Settings */}
      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
            <p className="text-sm text-gray-600">
              Update your account information
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Full Name
              </label>
              <Input defaultValue="Admin User" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email Address
              </label>
              <Input defaultValue="admin@example.com" type="email" />
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <Bell className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Notification Preferences
            </h2>
            <p className="text-sm text-gray-600">
              Choose how you want to be notified
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">
                  Receive updates via email
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications({ ...notifications, email: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-600">
                  Receive updates via SMS
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) =>
                  setNotifications({ ...notifications, sms: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">
                  Receive browser push notifications
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) =>
                  setNotifications({ ...notifications, push: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </Card>
    
      {/* Security Settings */}
      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 rounded-lg">
            <Lock className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Security Settings
            </h2>
            <p className="text-sm text-gray-600">
              Manage your password and security options
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Current Password
              </label>
              <Input type="password" placeholder="Enter current password" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                New Password
              </label>
              <Input type="password" placeholder="Enter new password" />
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-700">
            <Shield className="h-4 w-4 mr-2" />
            Update Password
          </Button>
        </div>
      </Card>

      {/* System Settings */}
      <Card className="p-6 bg-white shadow-sm border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Database className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              System Settings
            </h2>
            <p className="text-sm text-gray-600">
              Configure system-wide preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-600">
                Enable maintenance mode for system updates
              </p>
            </div>
            <Button variant="outline" className="border-gray-300">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Data Backup</p>
              <p className="text-sm text-gray-600">
                Last backup: 2 hours ago
              </p>
            </div>
            <Button variant="outline" className="border-gray-300">
              Backup Now
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Clear Cache</p>
              <p className="text-sm text-gray-600">
                Clear system cache to improve performance
              </p>
            </div>
            <Button variant="outline" className="border-gray-300">
              Clear Cache
            </Button>
          </div>
        </div>
      </Card>

    </div>
  );
}
