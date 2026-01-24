/**
 * AccountSettingsCard Component
 * 
 * Follows design principles:
 * - Single Responsibility: Handles only account settings UI
 * - Reusability: Can be used independently
 * - Composition: Composed with smaller components
 * - Accessibility: Proper ARIA labels and semantic HTML
 */

import { memo, type ChangeEvent } from "react";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AccountFormData, AccountFormErrors } from "@/lib/hooks/useAccountSettings";

interface AccountSettingsCardProps {
  formData: AccountFormData;
  errors: AccountFormErrors;
  isPending: boolean;
  canSubmit: boolean;
  onFieldChange: (name: keyof AccountFormData, value: string) => void;
  onSubmit: () => void;
}

/**
 * Memoized component to prevent unnecessary re-renders
 * Only re-renders when props actually change
 */
export const AccountSettingsCard = memo(function AccountSettingsCard({
  formData,
  errors,
  isPending,
  canSubmit,
  onFieldChange,
  onSubmit,
}: AccountSettingsCardProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFieldChange(name as keyof AccountFormData, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <User className="h-6 w-6 text-blue-600" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
          <p className="text-sm text-gray-600">
            Update your account information
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
        noValidate
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Username
            </label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter username"
              className={errors.username ? "border-red-500" : ""}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
              disabled={isPending}
              autoComplete="username"
            />
            {errors.username && (
              <p
                id="username-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {errors.username}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter email address"
              className={errors.email ? "border-red-500" : ""}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={isPending}
              autoComplete="email"
            />
            {errors.email && (
              <p
                id="email-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canSubmit}
          suppressHydrationWarning
          aria-busy={isPending}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
});
