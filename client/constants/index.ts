import {
  Home,
  Building2,
  Database,
  MapPin,
  Folder,
  Users,
  Tag,
  Shield,
  DollarSign,
  BarChart3,
  TrendingUp,
  Settings,
  GitBranch,
  Plus,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import type { MenuItem, ProjectStatus, RiskLevel, Priority } from "@/types";

// Navigation configuration
export const NAVIGATION_ITEMS: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: "Home",
  },
  {
    id: "projects",
    label: "List Project",
    href: "/projects",
    icon: "Building2",
    badge: "28",
  },
  {
    id: "master-data",
    label: "Master Data",
    icon: "Database",
    hasDropdown: true,
    children: [
      {
        id: "master-provinces",
        label: "Master Provinsi",
        href: "/master-data/provinces",
        icon: "MapPin",
      },
      {
        id: "master-categories",
        label: "Master Kategori Project",
        href: "/master-data/categories",
        icon: "Folder",
      },
      {
        id: "master-clients",
        label: "Master Client",
        href: "/master-data/clients",
        icon: "Building2",
      },
      {
        id: "master-users",
        label: "Master User Role",
        href: "/master-data/user-roles",
        icon: "Users",
      },
      {
        id: "master-status",
        label: "Master Status Project",
        href: "/master-data/project-status",
        icon: "Tag",
      },
    ],
  },
  {
    id: "risk-management",
    label: "Risk Management",
    href: "/risk-management",
    icon: "Shield",
  },
  {
    id: "financial",
    label: "Financial",
    href: "/financial",
    icon: "DollarSign",
  },
  {
    id: "reports",
    label: "Reports",
    href: "/reports",
    icon: "BarChart3",
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/analytics",
    icon: "TrendingUp",
  },
  {
    id: "users",
    label: "User Management",
    href: "/users",
    icon: "Users",
  },
  {
    id: "verifier",
    label: "Verifikator",
    icon: "CheckCircle",
    hasDropdown: true,
    children: [
      {
        id: "verifier-dashboard",
        label: "Dashboard Verifikator",
        href: "/verifier-dashboard",
        icon: "UserCheck",
      },
      {
        id: "verification-list",
        label: "Verifikasi Readiness",
        href: "/verification",
        icon: "CheckCircle",
        badge: "5",
      },
      {
        id: "risk-verification-list",
        label: "Verifikasi Risk Capture",
        href: "/risk-capture-verification",
        icon: "Shield",
        badge: "3",
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: "Settings",
  },
];

// Icon mapping for dynamic icon rendering
export const ICON_MAP = {
  Home,
  Building2,
  Database,
  MapPin,
  Folder,
  Users,
  Tag,
  Shield,
  DollarSign,
  BarChart3,
  TrendingUp,
  Settings,
  GitBranch,
  Plus,
  CheckCircle,
  UserCheck,
} as const;

// Province data
export const PROVINCES = [
  "Aceh",
  "Bali",
  "Bangka Belitung",
  "Bengkulu",
  "DKI Jakarta",
  "Gorontalo",
  "Jambi",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Kalimantan Barat",
  "Kalimantan Selatan",
  "Kalimantan Tengah",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Kepulauan Riau",
  "Lampung",
  "Maluku",
  "Maluku Utara",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Papua",
  "Papua Barat",
  "Riau",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Sulawesi Tengah",
  "Sulawesi Tenggara",
  "Sulawesi Utara",
  "Sumatera Barat",
  "Sumatera Selatan",
  "Sumatera Utara",
] as const;

// Project categories
export const PROJECT_CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Desktop Application",
  "ERP System",
  "E-Commerce Platform",
  "Management System",
  "Analytics Dashboard",
  "IoT Solutions",
  "AI/ML Implementation",
  "Database Migration",
  "System Integration",
  "API Development",
  "Other",
] as const;

// Status options
export const PROJECT_STATUS_OPTIONS: Record<ProjectStatus, string> = {
  planning: "Perencanaan",
  running: "Berjalan",
  "on-hold": "Tertunda",
  completed: "Selesai",
};

export const RISK_LEVEL_OPTIONS: Record<RiskLevel, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

export const PRIORITY_OPTIONS: Record<Priority, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
  critical: "Kritis",
};

// Color schemes
export const STATUS_COLORS = {
  running: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  "on-hold": "bg-yellow-100 text-yellow-800",
  planning: "bg-gray-100 text-gray-800",
} as const;

export const RISK_COLORS = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
} as const;

export const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  PROJECTS: "/api/projects",
  PROVINCES: "/api/provinces",
  CATEGORIES: "/api/categories",
  CLIENTS: "/api/clients",
  USERS: "/api/users",
  REPORTS: "/api/reports",
} as const;

// Form validation rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /\S+@\S+\.\S+/,
  PHONE_REGEX: /^(\+62|62|0)[\s-]?8[1-9][\d\s-]{7,11}$/,
  REQUIRED_FIELDS: {
    PROJECT: [
      "name",
      "client",
      "clientEmail",
      "budget",
      "startDate",
      "endDate",
      "teamSize",
      "province",
      "projectManager",
      "category",
    ],
    PROVINCE: ["name", "code", "capital", "region"],
    CATEGORY: ["name", "code", "description", "type"],
  },
} as const;

// Chart configuration
export const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#6366f1",
] as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE_SIZES: [10, 20, 50, 100],
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "dd/MM/yyyy",
  INPUT: "yyyy-MM-dd",
  LONG: "EEEE, dd MMMM yyyy",
} as const;

// Readiness status options
export const READINESS_STATUS_OPTIONS = {
  lengkap: "Lengkap",
  parsial: "Parsial",
  tidak_tersedia: "Tidak Tersedia",
} as const;

// Verification status options
export const VERIFICATION_STATUS_OPTIONS = {
  not_submitted: "Belum Submit",
  submitted: "Menunggu Review",
  under_review: "Sedang Direview",
  verified: "Terverifikasi",
  needs_revision: "Perlu Revisi",
} as const;

// Readiness categories configuration
export const READINESS_CATEGORIES = {
  Administrative: [
    "Surat Izin Usaha",
    "NPWP Perusahaan",
    "Akta Pendirian Perusahaan",
    "Surat Domisili Perusahaan",
  ],
  "User Data": [
    "Master Data Customer",
    "Master Data Supplier",
    "Master Data Product/Service",
  ],
  Personnel: [
    "CV Tim Project",
    "Sertifikat Keahlian",
    "Struktur Organisasi Tim",
    "Job Description Role",
  ],
  "Legal & Financial": [
    "Kontrak Kerjasama",
    "Laporan Keuangan",
    "Asuransi Project",
  ],
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  SIDEBAR_MINIMIZED: "sidebar-minimized",
  THEME_PREFERENCE: "theme-preference",
  USER_PREFERENCES: "user-preferences",
} as const;
