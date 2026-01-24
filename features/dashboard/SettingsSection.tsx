/**
 * SettingsSection Component - Optimized & Future-Proof
 * 
 * ARCHITECTURE DECISIONS:
 * ✅ Separation of Concerns: Logic separated into custom hooks
 * ✅ Composition over Inheritance: Built with smaller, reusable components
 * ✅ Performance Optimizations:
 *    - React.memo to prevent unnecessary re-renders
 *    - useCallback for stable function references
 *    - Debouncing for real-time validation
 *    - Lazy state updates
 * ✅ Scalability:
 *    - Modular component structure
 *    - Easy to extend with new settings sections
 *    - Type-safe with TypeScript
 * ✅ Accessibility:
 *    - Semantic HTML
 *    - ARIA labels
 *    - Keyboard navigation
 * ✅ Maintainability:
 *    - Clear naming conventions
 *    - Comprehensive documentation
 *    - Single responsibility per component
 * ✅ Testability:
 *    - Isolated logic in hooks
 *    - Pure components
 *    - Mockable dependencies
 */

"use client";

import { memo, useCallback } from "react";
import { useToast } from "@/components/toast/ToastContext";
import { useAccountSettings } from "@/lib/hooks/useAccountSettings";
import { AccountSettingsCard } from "./settings/AccountSettingsCard";
import { 
  NotificationSettingsCard, 
  type NotificationPreferences 
} from "./settings/NotificationSettingsCard";
import { SystemSettingsCard } from "./settings/SystemSettingsCard";

/**
 * Props interface with strict typing
 */
interface SettingsSectionProps {
  initialUsername?: string;
  initialEmail?: string;
  initialNotifications?: NotificationPreferences;
}

/**
 * Header component - Memoized for performance
 */
const SettingsHeader = memo(function SettingsHeader() {
  return (
    <header className="bg-blue-500 text-white rounded-xl p-4 md:p-6 shadow-lg">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Settings</h1>
      <p className="text-white/90 text-sm md:text-base">
        Manage your system preferences and configurations
      </p>
    </header>
  );
});

/**
 * Main Settings Section Component
 * Uses composition pattern for flexibility and reusability
 */
function SettingsSectionComponent({
  initialUsername = "",
  initialEmail = "",
  initialNotifications = { email: true, sms: false, push: true },
}: SettingsSectionProps) {
  const { showToast } = useToast();

  /**
   * Account settings with custom hook
   * Encapsulates all form logic, validation, and API calls
   */
  const accountSettings = useAccountSettings({
    initialUsername,
    initialEmail,
    onSuccess: (message) => {
      showToast({
        type: "success",
        title: "Success",
        description: message,
      });
    },
    onError: (message) => {
      showToast({
        type: "error",
        title: "Error",
        description: message,
      });
    },
  });

  /**
   * Notification preferences handler
   * TODO: Connect to backend API when available
   */
  const handleNotificationChange = useCallback(
    (preferences: NotificationPreferences) => {
      // Future implementation: Save to backend
      console.log("Notification preferences updated:", preferences);
      
      // Uncomment when backend is ready:
      // await updateNotificationPreferences(preferences);
    },
    []
  );

  /**
   * System actions handlers
   * Demonstrates extensibility for future features
   */
  const systemActions = [
    {
      id: "maintenance",
      title: "Maintenance Mode",
      description: "Enable maintenance mode for system updates",
      buttonText: "Configure",
      onClick: () => {
        // Future implementation
        console.log("Configure maintenance mode");
      },
    },
    {
      id: "backup",
      title: "Data Backup",
      description: "Last backup: 2 hours ago",
      buttonText: "Backup Now",
      onClick: () => {
        // Future implementation
        console.log("Backup data");
      },
    },
    {
      id: "cache",
      title: "Clear Cache",
      description: "Clear system cache to improve performance",
      buttonText: "Clear Cache",
      onClick: () => {
        // Future implementation
        console.log("Clear cache");
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <SettingsHeader />

      {/* Account Settings Section */}
      <AccountSettingsCard
        formData={accountSettings.formData}
        errors={accountSettings.errors}
        isPending={accountSettings.isPending}
        canSubmit={accountSettings.canSubmit}
        onFieldChange={accountSettings.handleChange}
        onSubmit={accountSettings.handleSubmit}
      />

      {/* Notification Settings Section */}
      <NotificationSettingsCard
        preferences={initialNotifications}
        onChange={handleNotificationChange}
      />

      {/* System Settings Section */}
      <SystemSettingsCard actions={systemActions} />
    </div>
  );
}

/**
 * Memoized export for performance
 */
export const SettingsSection = memo(SettingsSectionComponent);

/**
 * Export component and types for external use
 */
export type { SettingsSectionProps, NotificationPreferences };
