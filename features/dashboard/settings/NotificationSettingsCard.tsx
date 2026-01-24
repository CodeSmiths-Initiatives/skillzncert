/**
 * NotificationSettingsCard Component
 * 
 * Reusable notification preferences component
 * Follows accessibility best practices
 */

import { memo, type ChangeEvent } from "react";
import { Bell, Mail, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface NotificationSettingsCardProps {
  preferences: NotificationPreferences;
  onChange: (preferences: NotificationPreferences) => void;
  disabled?: boolean;
}

interface NotificationToggleProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Reusable notification toggle component
 */
const NotificationToggle = memo(function NotificationToggle({
  id,
  title,
  description,
  icon,
  checked,
  onChange,
  disabled = false,
}: NotificationToggleProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="text-gray-500" aria-hidden="true">
          {icon}
        </div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <label
        htmlFor={id}
        className="relative inline-flex items-center cursor-pointer"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only peer"
          aria-label={`Toggle ${title.toLowerCase()}`}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
      </label>
    </div>
  );
});

export const NotificationSettingsCard = memo(function NotificationSettingsCard({
  preferences,
  onChange,
  disabled = false,
}: NotificationSettingsCardProps) {
  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    onChange({
      ...preferences,
      [key]: value,
    });
  };

  return (
    <Card className="p-6 bg-white shadow-sm border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-lg">
          <Bell className="h-6 w-6 text-green-600" aria-hidden="true" />
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

      <div className="space-y-4" role="group" aria-label="Notification preferences">
        <NotificationToggle
          id="email-notifications"
          title="Email Notifications"
          description="Receive updates via email"
          icon={<Mail className="h-5 w-5" />}
          checked={preferences.email}
          onChange={(checked) => handleToggle("email", checked)}
          disabled={disabled}
        />

        <NotificationToggle
          id="sms-notifications"
          title="SMS Notifications"
          description="Receive updates via SMS"
          icon={<Bell className="h-5 w-5" />}
          checked={preferences.sms}
          onChange={(checked) => handleToggle("sms", checked)}
          disabled={disabled}
        />

        <NotificationToggle
          id="push-notifications"
          title="Push Notifications"
          description="Receive browser push notifications"
          icon={<Globe className="h-5 w-5" />}
          checked={preferences.push}
          onChange={(checked) => handleToggle("push", checked)}
          disabled={disabled}
        />
      </div>
    </Card>
  );
});
