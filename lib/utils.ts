import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates a name field (first name, last name, etc.)
 * @param name - The name to validate
 * @param fieldName - The display name of the field (e.g., "First name")
 * @returns Error message string, or empty string if valid
 */
export function validateName(name: string, fieldName: string): string {
  if (!name.trim()) {
    return `${fieldName} is required`;
  }
  if (name.includes(" ")) {
    return `${fieldName} cannot contain spaces`;
  }
  if (/\d/.test(name)) {
    return `${fieldName} cannot contain numbers`;
  }
  if (!/^[a-zA-Z]+$/.test(name)) {
    return `${fieldName} can only contain letters`;
  }
  return "";
}

/**
 * Validates a phone number (10 digits)
 * @param phone - The phone number to validate
 * @returns Error message string, or empty string if valid
 */
export function validatePhoneNumber(phone: string): string {
  if (!phone.trim()) {
    return "Phone number is required";
  }
  // Remove any non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length !== 10) {
    return "Phone number must be exactly 10 digits";
  }
  if (!/^\d+$/.test(digitsOnly)) {
    return "Phone number can only contain digits";
  }
  return "";
}
