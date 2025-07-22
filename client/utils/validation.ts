import { VALIDATION_RULES } from "@/constants";

/**
 * Validation utility functions
 */

export function isRequired(value: any): string | null {
  if (value === null || value === undefined || value === "") {
    return "Field ini wajib diisi";
  }
  if (typeof value === "string" && value.trim() === "") {
    return "Field ini wajib diisi";
  }
  return null;
}

export function isEmail(value: string): string | null {
  if (!value) return null;
  if (!VALIDATION_RULES.EMAIL_REGEX.test(value)) {
    return "Format email tidak valid";
  }
  return null;
}

export function isPhoneNumber(value: string): string | null {
  if (!value) return null;
  if (!VALIDATION_RULES.PHONE_REGEX.test(value)) {
    return "Format nomor telepon tidak valid";
  }
  return null;
}

export function isMinLength(min: number) {
  return (value: string): string | null => {
    if (!value) return null;
    if (value.length < min) {
      return `Minimal ${min} karakter`;
    }
    return null;
  };
}

export function isMaxLength(max: number) {
  return (value: string): string | null => {
    if (!value) return null;
    if (value.length > max) {
      return `Maksimal ${max} karakter`;
    }
    return null;
  };
}

export function isNumeric(value: string): string | null {
  if (!value) return null;
  if (isNaN(Number(value))) {
    return "Harus berupa angka";
  }
  return null;
}

export function isPositiveNumber(value: string | number): string | null {
  const num = typeof value === "string" ? Number(value) : value;
  if (isNaN(num)) {
    return "Harus berupa angka";
  }
  if (num <= 0) {
    return "Harus berupa angka positif";
  }
  return null;
}

export function isMinValue(min: number) {
  return (value: string | number): string | null => {
    const num = typeof value === "string" ? Number(value) : value;
    if (isNaN(num)) return null;
    if (num < min) {
      return `Nilai minimal ${min}`;
    }
    return null;
  };
}

export function isMaxValue(max: number) {
  return (value: string | number): string | null => {
    const num = typeof value === "string" ? Number(value) : value;
    if (isNaN(num)) return null;
    if (num > max) {
      return `Nilai maksimal ${max}`;
    }
    return null;
  };
}

export function isDateAfter(afterDate: string) {
  return (value: string): string | null => {
    if (!value || !afterDate) return null;

    const date = new Date(value);
    const compareDate = new Date(afterDate);

    if (date <= compareDate) {
      return "Tanggal harus setelah tanggal mulai";
    }
    return null;
  };
}

export function isDateBefore(beforeDate: string) {
  return (value: string): string | null => {
    if (!value || !beforeDate) return null;

    const date = new Date(value);
    const compareDate = new Date(beforeDate);

    if (date >= compareDate) {
      return "Tanggal harus sebelum tanggal selesai";
    }
    return null;
  };
}

export function isValidDate(value: string): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return "Format tanggal tidak valid";
  }
  return null;
}

export function isFutureDate(value: string): string | null {
  if (!value) return null;

  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date <= today) {
    return "Tanggal harus di masa depan";
  }
  return null;
}

export function isPastDate(value: string): string | null {
  if (!value) return null;

  const date = new Date(value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (date >= today) {
    return "Tanggal harus di masa lalu";
  }
  return null;
}

export function isValidUrl(value: string): string | null {
  if (!value) return null;

  try {
    new URL(value);
    return null;
  } catch {
    return "Format URL tidak valid";
  }
}

export function isInArray<T>(validValues: readonly T[]) {
  return (value: T): string | null => {
    if (!validValues.includes(value)) {
      return `Nilai harus salah satu dari: ${validValues.join(", ")}`;
    }
    return null;
  };
}

/**
 * Compose multiple validators
 */
export function composeValidators(
  ...validators: Array<(value: any) => string | null>
) {
  return (value: any): string | null => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
}

/**
 * Conditional validator
 */
export function when(
  condition: (formData: any) => boolean,
  validator: (value: any) => string | null,
) {
  return (value: any, formData?: any): string | null => {
    if (formData && condition(formData)) {
      return validator(value);
    }
    return null;
  };
}
