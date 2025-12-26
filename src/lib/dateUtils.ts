import { format } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format date string from API to DD-MM-YYYY format
 * @param dateString - Date string in various formats (ISO, etc.)
 * @returns Formatted date string in DD-MM-YYYY format
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Tanggal Tidak Valid";
  }

  return format(date, "dd-MM-yyyy", { locale: id });
}

/**
 * Format date string from API to full date format
 * @param dateString - Date string in various formats (ISO, etc.)
 * @returns Formatted date string in "DD MMMM YYYY" format
 */
export function formatDateFull(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Tanggal Tidak Valid";
  }

  return format(date, "dd MMMM yyyy", { locale: id });
}

/**
 * Format date string from API to day name and date
 * @param dateString - Date string in various formats (ISO, etc.)
 * @returns Formatted date string in "EEEE, dd MMMM yyyy" format
 */
export function formatDateWithDay(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Tanggal Tidak Valid";
  }

  return format(date, "EEEE, dd MMMM yyyy", { locale: id });
}

/**
 * Format time string to HH:MM format
 * @param timeString - Time string in various formats
 * @returns Formatted time string
 */
export function formatTime(timeString: string): string {
  if (!timeString) return "--:--";

  // Handle various time formats
  let date: Date;

  if (timeString.includes("-")) {
    // ISO datetime string
    date = new Date(timeString);
  } else if (timeString.includes(":")) {
    // Time only string
    const [hours, minutes] = timeString.split(":");
    date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  } else {
    // Unknown format
    return timeString;
  }

  if (isNaN(date.getTime())) {
    return timeString;
  }

  return format(date, "HH:mm", { locale: id });
}