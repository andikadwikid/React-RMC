// Core types for the application
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// Project related types
export interface Project extends BaseEntity {
  name: string;
  description: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  province: string;
  projectManager: string;
  category: string;
  progress: number;
  lastUpdate: string;
  timeline?: TimelineMilestone[];
}

export interface TimelineMilestone extends BaseEntity {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

// Risk Management types
export interface RiskCategory extends BaseEntity {
  name: string;
  icon: string;
  total: number;
  overdue: number;
  inProcess: number;
  closed: number;
}

// Master Data types
export interface Province extends BaseEntity {
  name: string;
  code: string;
  capital: string;
  region: string;
  status: EntityStatus;
}

export interface ProjectCategory extends BaseEntity {
  name: string;
  code: string;
  description: string;
  type: string;
  status: EntityStatus;
  projectCount: number;
}

export interface Client extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  status: EntityStatus;
}

// Navigation types
export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon: string;
  badge?: string;
  hasDropdown?: boolean;
  children?: MenuItem[];
}

// Form types
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Chart types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  projects?: string[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: "success" | "error";
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and search types
export interface FilterOptions {
  search?: string;
  status?: string;
  category?: string;
  province?: string;
  riskLevel?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Enums
export type ProjectStatus = "planning" | "running" | "on-hold" | "completed";
export type RiskLevel = "low" | "medium" | "high";
export type Priority = "low" | "medium" | "high" | "critical";
export type MilestoneStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "blocked";
export type EntityStatus = "active" | "inactive";

// Component Props types
export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
}

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: "blue" | "green" | "purple" | "orange" | "red";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Project Readiness types
export interface ReadinessItem {
  id: string;
  category: string;
  item: string;
  userStatus: ReadinessStatus;
  verifierStatus?: ReadinessStatus;
  userComment?: string;
  verifierComment?: string;
  verifierName?: string;
  verifiedAt?: string;
}

export interface ProjectReadiness extends BaseEntity {
  projectId: string;
  projectName: string;
  submittedBy: string;
  submittedAt: string;
  items: ReadinessItem[];
  status: "submitted" | "under_review" | "verified" | "needs_revision";
  verifierName?: string;
  verifiedAt?: string;
  overallComment?: string;
}

export type ReadinessStatus = "lengkap" | "parsial" | "tidak_tersedia";

// Risk Capture types
export interface RiskItem extends BaseEntity {
  sasaran: string;
  kode: string;
  taksonomi: string;
  peristiwaRisiko: string;
  sumberRisiko: string;
  dampakKualitatif: string;
  dampakKuantitatif: string;
  kontrolEksisting: string;
  risikoAwal: {
    kejadian: number;
    dampak: number;
    level: number;
  };
  resikoAkhir: {
    kejadian: number;
    dampak: number;
    level: number;
  };
  verifierComment?: string;
  verifierName?: string;
  verifiedAt?: string;
  isVerified?: boolean;
}

export interface RiskCapture extends BaseEntity {
  projectId: string;
  projectName: string;
  submittedBy: string;
  submittedAt: string;
  totalRisks: number;
  riskLevelDistribution: {
    sangatRendah: number;
    rendah: number;
    sedang: number;
    tinggi: number;
    sangatTinggi: number;
  };
  status: "submitted" | "under_review" | "verified" | "needs_revision";
  verifierName?: string;
  verifiedAt?: string;
  overallComment?: string;
  risks: RiskItem[];
}

export type RiskVerificationStatus = "pending" | "approved" | "rejected";
