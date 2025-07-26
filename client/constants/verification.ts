export const VERIFICATION_STATUS = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review", 
  VERIFIED: "verified",
  NEEDS_REVISION: "needs_revision",
} as const;

export const READINESS_STATUS = {
  LENGKAP: "lengkap",
  PARSIAL: "parsial", 
  TIDAK_TERSEDIA: "tidak_tersedia",
} as const;

export const TAB_VALUES = {
  ALL: "all",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  VERIFIED: "verified", 
  NEEDS_REVISION: "needs_revision",
} as const;

export const CATEGORY_DISPLAY_NAMES = {
  administrative: "Dokumen Administratif",
  "user-technical-data": "Data Teknis dari User",
  personnel: "Personel Proyek",
  "legal-financial": "Legal & Finansial",
  "system-equipment": "Kesiapan Sistem & Peralatan",
  "hsse-permits": "HSSE & Perizinan Lapangan",
  "deliverable-output": "Kesiapan Deliverable & Output",
} as const;

export const DEFAULT_DEBOUNCE_DELAY = 300;
export const DEFAULT_LOADING_DELAY = 600;

export type VerificationStatus = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];
export type ReadinessStatus = typeof READINESS_STATUS[keyof typeof READINESS_STATUS];
export type TabValue = typeof TAB_VALUES[keyof typeof TAB_VALUES];
