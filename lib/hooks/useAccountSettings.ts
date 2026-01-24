import { useState, useCallback, useMemo, useTransition } from "react";
import { validateEmail, validateUsername } from "@/lib/utils";
import { updateUserAction } from "@/actions/user/update-user.actions";
import { useDebounce } from "./useDebounce";

/**
 * Type definitions for account settings
 */
export interface AccountFormData {
  username: string;
  email: string;
}

export interface AccountFormErrors {
  username: string;
  email: string;
}

export interface UseAccountSettingsOptions {
  initialUsername?: string;
  initialEmail?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

/**
 * Custom hook for managing account settings with validation and debouncing
 * Follows single responsibility principle and separation of concerns
 * 
 * @param options - Configuration options
 * @returns Account settings state and handlers
 */
export function useAccountSettings({
  initialUsername = "",
  initialEmail = "",
  onSuccess,
  onError,
}: UseAccountSettingsOptions) {
  const [isPending, startTransition] = useTransition();
  
  const [formData, setFormData] = useState<AccountFormData>({
    username: initialUsername,
    email: initialEmail,
  });

  const [errors, setErrors] = useState<AccountFormErrors>({
    username: "",
    email: "",
  });

  // Debounce form data for real-time validation (performance optimization)
  const debouncedFormData = useDebounce(formData, 300);

  /**
   * Validate form data
   * Memoized to prevent unnecessary re-computation
   */
  const validateForm = useCallback((): boolean => {
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);

    setErrors({
      username: usernameError,
      email: emailError,
    });

    return !usernameError && !emailError;
  }, [formData.username, formData.email]);

  /**
   * Handle input change with optimistic validation
   * Uses useCallback to prevent unnecessary re-renders
   */
  const handleChange = useCallback((name: keyof AccountFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Immediate validation for better UX
    const error = name === "username" 
      ? validateUsername(value) 
      : validateEmail(value);
    
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  /**
   * Check if form data has actually changed from initial values
   * Memoized for performance
   */
  const hasActualChanges = useMemo(() => {
    return (
      formData.username.trim() !== initialUsername.trim() ||
      formData.email.trim() !== initialEmail.trim()
    );
  }, [formData.username, formData.email, initialUsername, initialEmail]);

  /**
   * Submit form with validation and error handling
   * Uses startTransition for better concurrent rendering
   */
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      onError?.("Please fix the validation errors before saving.");
      return;
    }

    if (!hasActualChanges) {
      onError?.("No changes to save.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateUserAction({
          username: formData.username,
          email: formData.email,
        });

        if (result.success) {
          onSuccess?.(result.message || "Profile updated successfully!");
        } else {
          onError?.(result.message || "Failed to update profile.");
        }
      } catch (error) {
        onError?.(
          error instanceof Error 
            ? error.message 
            : "An unexpected error occurred."
        );
      }
    });
  }, [formData, validateForm, hasActualChanges, onSuccess, onError]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setFormData({
      username: initialUsername,
      email: initialEmail,
    });
    setErrors({
      username: "",
      email: "",
    });
  }, [initialUsername, initialEmail]);

  /**
   * Check if form has errors
   * Memoized for performance
   */
  const hasErrors = useMemo(
    () => Boolean(errors.username || errors.email),
    [errors.username, errors.email]
  );

  /**
   * Check if form is valid and has changes
   * Memoized for performance
   */
  const canSubmit = useMemo(
    () => !hasErrors && hasActualChanges && !isPending,
    [hasErrors, hasActualChanges, isPending]
  );

  return {
    formData,
    errors,
    isPending,
    isDirty: hasActualChanges,
    hasErrors,
    canSubmit,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
