/**
 * SystemSettingsCard Component
 * 
 * Reusable system settings component
 * Future-proof design for extensibility
 */

import { memo } from "react";
import { Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SystemAction {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive";
  disabled?: boolean;
}

interface SystemSettingsCardProps {
  actions?: SystemAction[];
}

/**
 * Default system actions
 * Can be overridden via props for flexibility
 */
const DEFAULT_ACTIONS: SystemAction[] = [
  {
    id: "maintenance",
    title: "Maintenance Mode",
    description: "Enable maintenance mode for system updates",
    buttonText: "Configure",
    onClick: () => console.log("Maintenance mode clicked"),
  },
  {
    id: "backup",
    title: "Data Backup",
    description: "Last backup: 2 hours ago",
    buttonText: "Backup Now",
    onClick: () => console.log("Backup clicked"),
  },
  {
    id: "cache",
    title: "Clear Cache",
    description: "Clear system cache to improve performance",
    buttonText: "Clear Cache",
    onClick: () => console.log("Clear cache clicked"),
  },
];

interface SystemActionItemProps {
  action: SystemAction;
  isLast: boolean;
}

const SystemActionItem = memo(function SystemActionItem({
  action,
  isLast,
}: SystemActionItemProps) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
    >
      <div>
        <p className="font-medium text-gray-900">{action.title}</p>
        <p className="text-sm text-gray-600">{action.description}</p>
      </div>
      <Button
        variant={action.variant || "outline"}
        className="border-gray-300"
        onClick={action.onClick}
        disabled={action.disabled}
        suppressHydrationWarning
      >
        {action.buttonText}
      </Button>
    </div>
  );
});

export const SystemSettingsCard = memo(function SystemSettingsCard({
  actions = DEFAULT_ACTIONS,
}: SystemSettingsCardProps) {
  return (
    <Card className="p-6 bg-white shadow-sm border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 rounded-lg">
          <Database className="h-6 w-6 text-orange-600" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
          <p className="text-sm text-gray-600">
            Configure system-wide preferences
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {actions.map((action, index) => (
          <SystemActionItem
            key={action.id}
            action={action}
            isLast={index === actions.length - 1}
          />
        ))}
      </div>
    </Card>
  );
});
