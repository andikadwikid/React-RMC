import {
  Target,
  Building,
  DollarSign,
  Gavel,
  FileText,
  Leaf,
  Cpu,
  Users,
} from "lucide-react";

// Types
export interface ProjectSummary {
  total: number;
  running: number;
  completed: number;
}

export interface RiskCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  total: number;
  overdue: number;
  inProcess: number;
  closed: number;
}

export interface InvoiceStatus {
  completed_no_invoice: number;
  issued_unpaid: number;
  paid: number;
}

export interface AgingReceivable {
  category: string;
  amount: number;
  color: "green" | "yellow" | "red";
  days: string;
}

export interface ProvinceData {
  name: string;
  value: number;
  revenue: number;
  projects: string[];
}

export type PeriodType = "yearly" | "quarterly";

export type DataPeriod = {
  id: string;
  label: string;
  type: PeriodType;
  data: Array<{
    period: string;
    projects: number;
    revenue: number;
    risks: number;
  }>;
  isComplete: boolean;
};

export type RiskDataPeriod = {
  id: string;
  label: string;
  type: PeriodType;
  data: RiskCategory[];
  isComplete: boolean;
};

export type GeographicDataPeriod = {
  id: string;
  label: string;
  type: PeriodType;
  data: ProvinceData[];
  isComplete: boolean;
};

export type RiskCaptureDataPeriod = {
  id: string;
  label: string;
  type: PeriodType;
  data: Array<{ name: string; y: number; color: string }>;
  isComplete: boolean;
};

export type InvoiceStatusDataPeriod = {
  id: string;
  label: string;
  type: PeriodType;
  data: InvoiceStatus;
  isComplete: boolean;
};

export type AgingReceivablesDataPeriod = {
  id: string;
  label: string;
  type: PeriodType;
  data: AgingReceivable[];
  isComplete: boolean;
};

// Mock data
const yearlyPerformance2024 = [
  { period: "Jan 2024", projects: 4, revenue: 2800000000, risks: 12 },
  { period: "Feb 2024", projects: 6, revenue: 3200000000, risks: 8 },
  { period: "Mar 2024", projects: 5, revenue: 4100000000, risks: 15 },
  { period: "Apr 2024", projects: 3, revenue: 2200000000, risks: 6 },
  { period: "May 2024", projects: 7, revenue: 4800000000, risks: 18 },
  { period: "Jun 2024", projects: 8, revenue: 5500000000, risks: 14 },
  { period: "Jul 2024", projects: 6, revenue: 3900000000, risks: 11 },
  { period: "Aug 2024", projects: 9, revenue: 6200000000, risks: 22 },
  { period: "Sep 2024", projects: 7, revenue: 4700000000, risks: 16 },
  { period: "Oct 2024", projects: 5, revenue: 3800000000, risks: 13 },
  { period: "Nov 2024", projects: 8, revenue: 5100000000, risks: 19 },
  { period: "Dec 2024", projects: 4, revenue: 3000000000, risks: 9 },
];

const yearlyPerformance2023 = [
  { period: "Jan 2023", projects: 3, revenue: 2100000000, risks: 8 },
  { period: "Feb 2023", projects: 5, revenue: 2800000000, risks: 12 },
  { period: "Mar 2023", projects: 4, revenue: 3200000000, risks: 10 },
  { period: "Apr 2023", projects: 6, revenue: 3800000000, risks: 14 },
  { period: "May 2023", projects: 7, revenue: 4200000000, risks: 16 },
  { period: "Jun 2023", projects: 5, revenue: 3500000000, risks: 11 },
  { period: "Jul 2023", projects: 8, revenue: 4800000000, risks: 18 },
  { period: "Aug 2023", projects: 6, revenue: 4100000000, risks: 13 },
  { period: "Sep 2023", projects: 4, revenue: 2900000000, risks: 9 },
  { period: "Oct 2023", projects: 7, revenue: 4500000000, risks: 15 },
  { period: "Nov 2023", projects: 5, revenue: 3600000000, risks: 12 },
  { period: "Dec 2023", projects: 3, revenue: 2400000000, risks: 7 },
];

const quarterlyPerformanceQ4_2024 = [
  { period: "Oct 2024", projects: 5, revenue: 3800000000, risks: 13 },
  { period: "Nov 2024", projects: 8, revenue: 5100000000, risks: 19 },
  { period: "Dec 2024", projects: 4, revenue: 3000000000, risks: 9 },
];

const quarterlyPerformanceQ3_2024 = [
  { period: "Jul 2024", projects: 6, revenue: 3900000000, risks: 11 },
  { period: "Aug 2024", projects: 9, revenue: 6200000000, risks: 22 },
  { period: "Sep 2024", projects: 7, revenue: 4700000000, risks: 16 },
];

export const availablePerformancePeriods: DataPeriod[] = [
  {
    id: "2024",
    label: "2024 (Tahunan)",
    type: "yearly",
    data: yearlyPerformance2024,
    isComplete: true,
  },
  {
    id: "2023",
    label: "2023 (Tahunan)",
    type: "yearly",
    data: yearlyPerformance2023,
    isComplete: true,
  },
  {
    id: "q4-2024",
    label: "Q4 2024 (Triwulan)",
    type: "quarterly",
    data: quarterlyPerformanceQ4_2024,
    isComplete: true,
  },
  {
    id: "q3-2024",
    label: "Q3 2024 (Triwulan)",
    type: "quarterly",
    data: quarterlyPerformanceQ3_2024,
    isComplete: true,
  },
];

// Risk categories data
const riskCategories2024: RiskCategory[] = [
  {
    id: "strategic",
    name: "Strategis",
    icon: Target,
    total: 12,
    overdue: 3,
    inProcess: 6,
    closed: 3,
  },
  {
    id: "operational",
    name: "Operasional",
    icon: Building,
    total: 18,
    overdue: 5,
    inProcess: 8,
    closed: 5,
  },
  {
    id: "financial",
    name: "Keuangan",
    icon: DollarSign,
    total: 8,
    overdue: 2,
    inProcess: 4,
    closed: 2,
  },
  {
    id: "compliance",
    name: "Kepatuhan",
    icon: Gavel,
    total: 6,
    overdue: 1,
    inProcess: 3,
    closed: 2,
  },
  {
    id: "project",
    name: "Proyek",
    icon: FileText,
    total: 22,
    overdue: 7,
    inProcess: 10,
    closed: 5,
  },
  {
    id: "environment",
    name: "Lingkungan & Sosial",
    icon: Leaf,
    total: 4,
    overdue: 1,
    inProcess: 2,
    closed: 1,
  },
  {
    id: "it",
    name: "Teknologi Informasi",
    icon: Cpu,
    total: 9,
    overdue: 2,
    inProcess: 5,
    closed: 2,
  },
  {
    id: "hr",
    name: "Sumber Daya Manusia",
    icon: Users,
    total: 7,
    overdue: 1,
    inProcess: 4,
    closed: 2,
  },
];

const riskCategories2023: RiskCategory[] = [
  {
    id: "strategic",
    name: "Strategis",
    icon: Target,
    total: 10,
    overdue: 2,
    inProcess: 5,
    closed: 3,
  },
  {
    id: "operational",
    name: "Operasional",
    icon: Building,
    total: 15,
    overdue: 4,
    inProcess: 7,
    closed: 4,
  },
  {
    id: "financial",
    name: "Keuangan",
    icon: DollarSign,
    total: 6,
    overdue: 1,
    inProcess: 3,
    closed: 2,
  },
  {
    id: "compliance",
    name: "Kepatuhan",
    icon: Gavel,
    total: 4,
    overdue: 0,
    inProcess: 2,
    closed: 2,
  },
  {
    id: "project",
    name: "Proyek",
    icon: FileText,
    total: 18,
    overdue: 5,
    inProcess: 8,
    closed: 5,
  },
  {
    id: "environment",
    name: "Lingkungan & Sosial",
    icon: Leaf,
    total: 3,
    overdue: 0,
    inProcess: 2,
    closed: 1,
  },
  {
    id: "it",
    name: "Teknologi Informasi",
    icon: Cpu,
    total: 7,
    overdue: 1,
    inProcess: 4,
    closed: 2,
  },
  {
    id: "hr",
    name: "Sumber Daya Manusia",
    icon: Users,
    total: 5,
    overdue: 0,
    inProcess: 3,
    closed: 2,
  },
];

const riskCategoriesQ4_2024: RiskCategory[] = [
  {
    id: "strategic",
    name: "Strategis",
    icon: Target,
    total: 8,
    overdue: 2,
    inProcess: 4,
    closed: 2,
  },
  {
    id: "operational",
    name: "Operasional",
    icon: Building,
    total: 12,
    overdue: 3,
    inProcess: 6,
    closed: 3,
  },
  {
    id: "financial",
    name: "Keuangan",
    icon: DollarSign,
    total: 5,
    overdue: 1,
    inProcess: 3,
    closed: 1,
  },
  {
    id: "compliance",
    name: "Kepatuhan",
    icon: Gavel,
    total: 4,
    overdue: 1,
    inProcess: 2,
    closed: 1,
  },
  {
    id: "project",
    name: "Proyek",
    icon: FileText,
    total: 15,
    overdue: 4,
    inProcess: 7,
    closed: 4,
  },
  {
    id: "environment",
    name: "Lingkungan & Sosial",
    icon: Leaf,
    total: 3,
    overdue: 1,
    inProcess: 1,
    closed: 1,
  },
  {
    id: "it",
    name: "Teknologi Informasi",
    icon: Cpu,
    total: 6,
    overdue: 1,
    inProcess: 3,
    closed: 2,
  },
  {
    id: "hr",
    name: "Sumber Daya Manusia",
    icon: Users,
    total: 4,
    overdue: 0,
    inProcess: 2,
    closed: 2,
  },
];

const riskCategoriesQ3_2024: RiskCategory[] = [
  {
    id: "strategic",
    name: "Strategis",
    icon: Target,
    total: 9,
    overdue: 3,
    inProcess: 4,
    closed: 2,
  },
  {
    id: "operational",
    name: "Operasional",
    icon: Building,
    total: 14,
    overdue: 4,
    inProcess: 6,
    closed: 4,
  },
  {
    id: "financial",
    name: "Keuangan",
    icon: DollarSign,
    total: 6,
    overdue: 2,
    inProcess: 2,
    closed: 2,
  },
  {
    id: "compliance",
    name: "Kepatuhan",
    icon: Gavel,
    total: 5,
    overdue: 1,
    inProcess: 2,
    closed: 2,
  },
  {
    id: "project",
    name: "Proyek",
    icon: FileText,
    total: 20,
    overdue: 6,
    inProcess: 9,
    closed: 5,
  },
  {
    id: "environment",
    name: "Lingkungan & Sosial",
    icon: Leaf,
    total: 3,
    overdue: 1,
    inProcess: 1,
    closed: 1,
  },
  {
    id: "it",
    name: "Teknologi Informasi",
    icon: Cpu,
    total: 8,
    overdue: 2,
    inProcess: 4,
    closed: 2,
  },
  {
    id: "hr",
    name: "Sumber Daya Manusia",
    icon: Users,
    total: 6,
    overdue: 1,
    inProcess: 3,
    closed: 2,
  },
];

export const availableRiskPeriods: RiskDataPeriod[] = [
  {
    id: "2024",
    label: "2024 (Tahunan)",
    type: "yearly",
    data: riskCategories2024,
    isComplete: true,
  },
  {
    id: "2023",
    label: "2023 (Tahunan)",
    type: "yearly",
    data: riskCategories2023,
    isComplete: true,
  },
  {
    id: "q4-2024",
    label: "Q4 2024 (Triwulan)",
    type: "quarterly",
    data: riskCategoriesQ4_2024,
    isComplete: true,
  },
  {
    id: "q3-2024",
    label: "Q3 2024 (Triwulan)",
    type: "quarterly",
    data: riskCategoriesQ3_2024,
    isComplete: true,
  },
];

// Geographic data
const provinceData2024: ProvinceData[] = [
  {
    name: "DKI Jakarta",
    value: 12,
    revenue: 15800000000,
    projects: [
      "ERP System Bank Central",
      "Mobile Banking App",
      "E-Government Portal",
      "Smart City Dashboard",
      "Fintech Integration",
    ],
  },
  {
    name: "Jawa Barat",
    value: 8,
    revenue: 9200000000,
    projects: [
      "Manufacturing ERP",
      "Supply Chain Management",
      "Hospital Information System",
      "E-Commerce Platform",
    ],
  },
  {
    name: "Jawa Tengah",
    value: 6,
    revenue: 6500000000,
    projects: [
      "Agricultural Management System",
      "Tourism Portal",
      "Educational Platform",
    ],
  },
  {
    name: "Jawa Timur",
    value: 7,
    revenue: 8100000000,
    projects: [
      "Port Management System",
      "Logistics Platform",
      "Industrial IoT",
      "Smart Factory",
    ],
  },
  {
    name: "Sumatera Utara",
    value: 4,
    revenue: 4300000000,
    projects: ["Palm Oil Tracking", "Mining Management System"],
  },
  {
    name: "Sumatera Barat",
    value: 3,
    revenue: 2800000000,
    projects: ["Tourism Management", "Cultural Heritage Portal"],
  },
  {
    name: "Kalimantan Timur",
    value: 2,
    revenue: 3200000000,
    projects: ["Coal Mining System"],
  },
  {
    name: "Sulawesi Selatan",
    value: 2,
    revenue: 2100000000,
    projects: ["Fisheries Management"],
  },
  {
    name: "Bali",
    value: 1,
    revenue: 1500000000,
    projects: ["Resort Management System"],
  },
];

const provinceData2023: ProvinceData[] = [
  {
    name: "DKI Jakarta",
    value: 10,
    revenue: 13200000000,
    projects: [
      "Banking Core System",
      "Government Portal V1",
      "Digital Payment Platform",
      "Smart Transport",
    ],
  },
  {
    name: "Jawa Barat",
    value: 6,
    revenue: 7800000000,
    projects: ["Factory Automation", "Healthcare System", "E-Commerce Backend"],
  },
  {
    name: "Jawa Tengah",
    value: 5,
    revenue: 5200000000,
    projects: ["Agricultural Portal", "Education Management"],
  },
  {
    name: "Jawa Timur",
    value: 6,
    revenue: 6900000000,
    projects: ["Port System V1", "Supply Chain", "Manufacturing IoT"],
  },
  {
    name: "Sumatera Utara",
    value: 3,
    revenue: 3500000000,
    projects: ["Mining System", "Plantation Management"],
  },
  {
    name: "Sumatera Barat",
    value: 2,
    revenue: 2100000000,
    projects: ["Tourism Portal V1"],
  },
  {
    name: "Kalimantan Timur",
    value: 2,
    revenue: 2800000000,
    projects: ["Coal Management"],
  },
  {
    name: "Sulawesi Selatan",
    value: 1,
    revenue: 1600000000,
    projects: ["Marine System"],
  },
  {
    name: "Bali",
    value: 1,
    revenue: 1200000000,
    projects: ["Hotel Management"],
  },
];

const provinceDataQ4_2024: ProvinceData[] = [
  {
    name: "DKI Jakarta",
    value: 4,
    revenue: 5800000000,
    projects: ["Smart City Phase 2", "Fintech Integration"],
  },
  {
    name: "Jawa Barat",
    value: 3,
    revenue: 3200000000,
    projects: ["E-Commerce Platform", "Hospital System"],
  },
  {
    name: "Jawa Tengah",
    value: 2,
    revenue: 2500000000,
    projects: ["Educational Platform"],
  },
  {
    name: "Jawa Timur",
    value: 2,
    revenue: 2100000000,
    projects: ["Smart Factory"],
  },
  {
    name: "Sumatera Utara",
    value: 1,
    revenue: 1300000000,
    projects: ["Mining Management Phase 2"],
  },
];

const provinceDataQ3_2024: ProvinceData[] = [
  {
    name: "DKI Jakarta",
    value: 3,
    revenue: 4200000000,
    projects: ["E-Government Portal", "Banking App"],
  },
  {
    name: "Jawa Barat",
    value: 2,
    revenue: 2800000000,
    projects: ["Supply Chain Management"],
  },
  {
    name: "Jawa Tengah",
    value: 2,
    revenue: 2000000000,
    projects: ["Agricultural System"],
  },
  {
    name: "Jawa Timur",
    value: 3,
    revenue: 3800000000,
    projects: ["Port Management", "Industrial IoT"],
  },
  {
    name: "Sumatera Utara",
    value: 1,
    revenue: 1500000000,
    projects: ["Palm Oil Tracking"],
  },
];

export const availableGeographicPeriods: GeographicDataPeriod[] = [
  {
    id: "2024",
    label: "2024 (Tahunan)",
    type: "yearly",
    data: provinceData2024,
    isComplete: true,
  },
  {
    id: "2023",
    label: "2023 (Tahunan)",
    type: "yearly",
    data: provinceData2023,
    isComplete: true,
  },
  {
    id: "q4-2024",
    label: "Q4 2024 (Triwulan)",
    type: "quarterly",
    data: provinceDataQ4_2024,
    isComplete: true,
  },
  {
    id: "q3-2024",
    label: "Q3 2024 (Triwulan)",
    type: "quarterly",
    data: provinceDataQ3_2024,
    isComplete: true,
  },
];

// Risk Capture data
const riskCaptureData2024 = [
  { name: "Low", y: 45, color: "#166534" },
  { name: "Low to Moderate", y: 32, color: "#22C55E" },
  { name: "Moderate", y: 28, color: "#EAB308" },
  { name: "Moderate to High", y: 18, color: "#F97316" },
  { name: "High", y: 12, color: "#DC2626" },
];

const riskCaptureData2023 = [
  { name: "Low", y: 38, color: "#166534" },
  { name: "Low to Moderate", y: 28, color: "#22C55E" },
  { name: "Moderate", y: 25, color: "#EAB308" },
  { name: "Moderate to High", y: 22, color: "#F97316" },
  { name: "High", y: 15, color: "#DC2626" },
];

const riskCaptureDataQ4_2024 = [
  { name: "Low", y: 35, color: "#166534" },
  { name: "Low to Moderate", y: 25, color: "#22C55E" },
  { name: "Moderate", y: 20, color: "#EAB308" },
  { name: "Moderate to High", y: 15, color: "#F97316" },
  { name: "High", y: 8, color: "#DC2626" },
];

const riskCaptureDataQ3_2024 = [
  { name: "Low", y: 42, color: "#166534" },
  { name: "Low to Moderate", y: 30, color: "#22C55E" },
  { name: "Moderate", y: 25, color: "#EAB308" },
  { name: "Moderate to High", y: 20, color: "#F97316" },
  { name: "High", y: 10, color: "#DC2626" },
];

export const availableRiskCapturePeriods: RiskCaptureDataPeriod[] = [
  {
    id: "2024",
    label: "2024 (Tahunan)",
    type: "yearly",
    data: riskCaptureData2024,
    isComplete: true,
  },
  {
    id: "2023",
    label: "2023 (Tahunan)",
    type: "yearly",
    data: riskCaptureData2023,
    isComplete: true,
  },
  {
    id: "q4-2024",
    label: "Q4 2024 (Triwulan)",
    type: "quarterly",
    data: riskCaptureDataQ4_2024,
    isComplete: true,
  },
  {
    id: "q3-2024",
    label: "Q3 2024 (Triwulan)",
    type: "quarterly",
    data: riskCaptureDataQ3_2024,
    isComplete: true,
  },
];

// Invoice Status data
const invoiceStatus2024: InvoiceStatus = {
  completed_no_invoice: 8,
  issued_unpaid: 15,
  paid: 49,
};

const invoiceStatus2023: InvoiceStatus = {
  completed_no_invoice: 5,
  issued_unpaid: 12,
  paid: 39,
};

const invoiceStatusQ4_2024: InvoiceStatus = {
  completed_no_invoice: 2,
  issued_unpaid: 4,
  paid: 6,
};

const invoiceStatusQ3_2024: InvoiceStatus = {
  completed_no_invoice: 3,
  issued_unpaid: 5,
  paid: 7,
};

export const availableInvoiceStatusPeriods: InvoiceStatusDataPeriod[] = [
  {
    id: "2024",
    label: "2024 (Tahunan)",
    type: "yearly",
    data: invoiceStatus2024,
    isComplete: true,
  },
  {
    id: "2023",
    label: "2023 (Tahunan)",
    type: "yearly",
    data: invoiceStatus2023,
    isComplete: true,
  },
  {
    id: "q4-2024",
    label: "Q4 2024 (Triwulan)",
    type: "quarterly",
    data: invoiceStatusQ4_2024,
    isComplete: true,
  },
  {
    id: "q3-2024",
    label: "Q3 2024 (Triwulan)",
    type: "quarterly",
    data: invoiceStatusQ3_2024,
    isComplete: true,
  },
];

// Aging Receivables data
const agingReceivables2024: AgingReceivable[] = [
  { category: "0-30 hari", amount: 3200000000, color: "green", days: "0-30" },
  {
    category: "31-90 hari",
    amount: 2100000000,
    color: "yellow",
    days: "31-90",
  },
  { category: ">90 hari", amount: 850000000, color: "red", days: ">90" },
];

const agingReceivables2023: AgingReceivable[] = [
  { category: "0-30 hari", amount: 2800000000, color: "green", days: "0-30" },
  {
    category: "31-90 hari",
    amount: 1900000000,
    color: "yellow",
    days: "31-90",
  },
  { category: ">90 hari", amount: 700000000, color: "red", days: ">90" },
];

const agingReceivablesQ4_2024: AgingReceivable[] = [
  { category: "0-30 hari", amount: 1200000000, color: "green", days: "0-30" },
  { category: "31-90 hari", amount: 800000000, color: "yellow", days: "31-90" },
  { category: ">90 hari", amount: 300000000, color: "red", days: ">90" },
];

const agingReceivablesQ3_2024: AgingReceivable[] = [
  { category: "0-30 hari", amount: 1500000000, color: "green", days: "0-30" },
  { category: "31-90 hari", amount: 900000000, color: "yellow", days: "31-90" },
  { category: ">90 hari", amount: 400000000, color: "red", days: ">90" },
];

export const availableAgingReceivablesPeriods: AgingReceivablesDataPeriod[] = [
  {
    id: "2024",
    label: "2024 (Tahunan)",
    type: "yearly",
    data: agingReceivables2024,
    isComplete: true,
  },
  {
    id: "2023",
    label: "2023 (Tahunan)",
    type: "yearly",
    data: agingReceivables2023,
    isComplete: true,
  },
  {
    id: "q4-2024",
    label: "Q4 2024 (Triwulan)",
    type: "quarterly",
    data: agingReceivablesQ4_2024,
    isComplete: true,
  },
  {
    id: "q3-2024",
    label: "Q3 2024 (Triwulan)",
    type: "quarterly",
    data: agingReceivablesQ3_2024,
    isComplete: true,
  },
];
