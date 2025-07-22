import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(
  amount: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {},
): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
  }).format(amount);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(
  num: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {},
): string {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(num);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  return Number(value.replace(/\D/g, ""));
}

/**
 * Format currency input (add separators while typing)
 */
export function formatCurrencyInput(value: string): string {
  const numericValue = value.replace(/\D/g, "");
  return formatNumber(Number(numericValue));
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(
  date: string | Date,
  formatString: string = "dd MMMM yyyy",
): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatString, { locale: id });
  } catch (error) {
    console.warn("Error formatting date:", error);
    return "Invalid Date";
  }
}

/**
 * Format date for input fields
 */
export function formatDateForInput(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, "yyyy-MM-dd");
  } catch (error) {
    console.warn("Error formatting date for input:", error);
    return "";
  }
}

/**
 * Format date and time to Indonesian locale
 */
export function formatDateTime(
  date: string | Date,
  formatString: string = "dd MMMM yyyy, HH:mm",
): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatString, { locale: id });
  } catch (error) {
    console.warn("Error formatting date time:", error);
    return "Invalid Date";
  }
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Hari ini";
    if (diffInDays === 1) return "Kemarin";
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} bulan lalu`;
    return `${Math.floor(diffInDays / 365)} tahun lalu`;
  } catch (error) {
    console.warn("Error formatting relative time:", error);
    return "Unknown";
  }
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert snake_case to Title Case
 */
export function snakeToTitle(text: string): string {
  return text
    .split("_")
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Format phone number to Indonesian format
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  // Convert to +62 format
  if (cleaned.startsWith("0")) {
    return "+62 " + cleaned.substring(1);
  }
  if (cleaned.startsWith("62")) {
    return "+" + cleaned;
  }
  return phone;
}
