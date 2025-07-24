import { ReactNode } from "react";
import { DialogProps } from "@radix-ui/react-dialog";
import { FieldValues } from "react-hook-form";
import { ToastProps } from "@/components/ui/toast";
import { useEmblaCarousel } from "embla-carousel-react";

// =============================================================================
// CORE BASE TYPES
// =============================================================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// =============================================================================
// COMMON ENUMS & UTILITY TYPES
// =============================================================================

export type ProjectStatus = "planning" | "running" | "on-hold" | "completed";
export type RiskLevel = "low" | "medium" | "high";
export type Priority = "low" | "medium" | "high" | "critical";
export type MilestoneStatus = "pending" | "in-progress" | "completed" | "blocked";
export type EntityStatus = "active" | "inactive";
export type ReadinessStatus = "lengkap" | "parsial" | "tidak_tersedia";
export type RiskVerificationStatus = "pending" | "approved" | "rejected";
export type VerificationStatus = "not_submitted" | "submitted" | "under_review" | "verified" | "needs_revision";
export type PeriodType = "yearly" | "quarterly";

// =============================================================================
// PROJECT RELATED TYPES
// =============================================================================

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
  readinessStatus?: "not-started" | "in-progress" | "completed";
  readinessScore?: number;
  riskCaptureStatus?: "not-started" | "in-progress" | "completed";
  riskCaptureScore?: number;
}

export interface TimelineMilestone extends BaseEntity {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  budget: string;
  startDate: string;
  endDate: string;
  province: string;
  projectManager: string;
  category: string;
  timeline: TimelineMilestone[];
}

// =============================================================================
// MASTER DATA TYPES
// =============================================================================

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

export interface Category {
  id: string;
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

// =============================================================================
// RISK MANAGEMENT TYPES
// =============================================================================

export interface RiskCategory extends BaseEntity {
  name: string;
  icon: string;
  total: number;
  overdue: number;
  inProcess: number;
  closed: number;
}

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
  status: VerificationStatus;
  verifierName?: string;
  verifiedAt?: string;
  overallComment?: string;
  risks: RiskItem[];
}

export interface RiskCaptureData {
  name: string;
  value: number;
  color: string;
}

// =============================================================================
// PROJECT READINESS TYPES
// =============================================================================

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

export interface ReadinessCategory {
  id: string;
  name: string;
  items: string[];
}

export interface ProjectReadiness extends BaseEntity {
  projectId: string;
  projectName: string;
  submittedBy: string;
  submittedAt: string;
  items: ReadinessItem[];
  status: VerificationStatus;
  verifierName?: string;
  verifiedAt?: string;
  overallComment?: string;
}

// =============================================================================
// DASHBOARD & ANALYTICS TYPES
// =============================================================================

export interface ProjectSummary {
  total: number;
  inProgress: number;
  completed: number;
}

export interface InvoiceStatus {
  completed_no_invoice: number;
  completed_invoiced: number;
  completed_paid: number;
}

export interface AgingReceivable {
  category: string;
  total: number;
  percentage: number;
  color: string;
}

export interface ProvinceData {
  name: string;
  value: number;
  "hc-key": string;
  color: string;
}

export interface RegionData {
  "hc-key": string;
  name: string;
  value: number;
  color: string;
}

export interface DataPeriod {
  id: string;
  label: string;
  type: PeriodType;
  data: Array<{ period: string; verified: number; revised: number }>;
  isComplete: boolean;
}

export interface Period {
  id: string;
  label: string;
  type: PeriodType;
  isComplete: boolean;
}

// Type aliases for specific data periods
export type RiskDataPeriod = DataPeriod;
export type GeographicDataPeriod = DataPeriod;
export type RiskCaptureDataPeriod = DataPeriod;
export type InvoiceStatusDataPeriod = DataPeriod;
export type AgingReceivablesDataPeriod = DataPeriod;

// =============================================================================
// CHART & VISUALIZATION TYPES
// =============================================================================

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  projects?: string[];
}

// =============================================================================
// FORM & INPUT TYPES
// =============================================================================

export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
}

export interface UseFormOptions<T> {
  initialData: T;
  validationRules?: Partial<Record<keyof T, (value: any) => string | null>>;
  onSubmit?: (data: T) => Promise<void> | void;
}

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

// =============================================================================
// NAVIGATION & LAYOUT TYPES
// =============================================================================

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon: string;
  badge?: string;
  hasDropdown?: boolean;
  children?: MenuItem[];
}

export interface LayoutProps {
  children: ReactNode;
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  variant?: "default" | "inset";
  side?: "left" | "right";
  collapsible?: "offcanvas" | "icon" | "none";
}

export interface NavigationItemProps {
  item: MenuItem;
  isCollapsed: boolean;
}

// =============================================================================
// API & DATA HANDLING TYPES
// =============================================================================

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

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

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
  render?: (value: any, item: T) => ReactNode;
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

export interface SummaryCardsProps {
  cards: SummaryCardProps[];
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// =============================================================================
// MODAL & DIALOG COMPONENT PROPS
// =============================================================================

export interface ProjectReadinessFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onSave: (data: any) => void;
}

export interface ProjectReadinessFormWithFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onSave: (data: any) => void;
}

export interface RiskCaptureFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onSave: (data: any) => void;
}

export interface ProjectReadinessVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: ProjectReadiness;
  onSave: (submissionId: string, data: any) => void;
}

export interface RiskCaptureVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: RiskCapture;
  onSave: (submissionId: string, data: any) => void;
}

// =============================================================================
// DASHBOARD SECTION COMPONENT PROPS
// =============================================================================

export interface AgingReceivablesSectionProps {
  selectedPeriod: AgingReceivablesDataPeriod;
}

export interface InvoiceStatusSectionProps {
  selectedPeriod: InvoiceStatusDataPeriod;
}

export interface PeriodSelectorProps<T extends Period> {
  periods: T[];
  selectedPeriod: T;
  onPeriodChange: (period: T) => void;
  className?: string;
}

export interface InsightCardProps {
  title: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}

export interface InsightCardsGridProps {
  insights: InsightCardProps[];
  className?: string;
}

export interface FallbackMessageProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface RiskCategoryDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: RiskCategory;
}

// =============================================================================
// CHART COMPONENT PROPS
// =============================================================================

export interface IndonesiaMapChartProps {
  data: RegionData[];
}

export interface ProjectDistributionChartProps {
  data: ProvinceData[];
}

export interface RiskCapturePieChartProps {
  data: RiskCaptureData[];
}

// =============================================================================
// TIMELINE COMPONENT PROPS
// =============================================================================

export interface TimelineOverviewProps {
  timeline: TimelineMilestone[];
}

export interface TimelineCardProps {
  milestone: TimelineMilestone;
  index: number;
}

export interface TimelinePreviewProps {
  timeline: TimelineMilestone[];
}

// =============================================================================
// UI COMPONENT TYPES (Shadcn/UI Extensions)
// =============================================================================

// Toast types
export type ToasterToast = ToastProps & {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastActionElement;
}

export type Toast = Omit<ToasterToast, "id">;

export type ToastActionElement = React.ReactElement<typeof import("@/components/ui/toast").ToastAction>;

export interface ToastState {
  toasts: ToasterToast[];
}

export type ToasterProps = React.ComponentProps<typeof import("sonner").Sonner>;

// Form types
export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends string = string,
> = {
  name: TName;
}

export type FormItemContextValue = {
  id: string;
}

// Carousel types
export type CarouselApi = ReturnType<typeof useEmblaCarousel>[1];
export type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
export type CarouselOptions = UseCarouselParameters[0];
export type CarouselPlugin = UseCarouselParameters[1];

export type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
}

export type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

// Command types
export interface CommandDialogProps extends DialogProps {}

// Pagination types
export type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<"a">;

// Sheet types
export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof import("@radix-ui/react-dialog").Content>,
    VariantProps<typeof import("class-variance-authority").cva> {
  side?: "top" | "right" | "bottom" | "left";
}

// Sidebar types
export type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

// Chart types
export type ChartContextProps = {
  config: ChartConfig;
}

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  );
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// Import VariantProps for components that need it
export type { VariantProps } from "class-variance-authority";
