import {
  loadPerformanceData,
  loadRiskCategoriesData,
  loadGeographicData,
  loadRiskCaptureData,
  loadInvoiceStatusData,
  loadAgingReceivablesData,
} from "@/utils/dataLoader";

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

// Load data from JSON files
const performanceJsonData = loadPerformanceData();
const riskCategoriesJsonData = loadRiskCategoriesData();
const geographicJsonData = loadGeographicData();
const riskCaptureJsonData = loadRiskCaptureData();
const invoiceStatusJsonData = loadInvoiceStatusData();
const agingReceivablesJsonData = loadAgingReceivablesData();

// Performance data periods
export const availablePerformancePeriods: DataPeriod[] = [
  {
    id: "2024",
    label: "2024 (Tahunan)",
    type: "yearly",
    data: performanceJsonData.yearly["2024"],
    isComplete: true,
  },
  {
    id: "2023",
    label: "2023 (Tahunan)",
    type: "yearly",
    data: performanceJsonData.yearly["2023"],
    isComplete: true,
  },
  {
    id: "q4-2024",
    label: "Q4 2024 (Triwulan)",
    type: "quarterly",
    data: performanceJsonData.quarterly["q4-2024"],
    isComplete: true,
  },
  {
    id: "q3-2024",
    label: "Q3 2024 (Triwulan)",
    type: "quarterly",
    data: performanceJsonData.quarterly["q3-2024"],
    isComplete: true,
  },
];

// Risk categories data periods
export const availableRiskPeriods: RiskDataPeriod[] = [
  {
    id: "2024",
    label: "2024 (Tahunan)",
    type: "yearly",
    data: riskCategoriesJsonData.yearly["2024"],
    isComplete: true,
  },
  {
    id: "2023",
    label: "2023 (Tahunan)",
    type: "yearly",
    data: riskCategoriesJsonData.yearly["2023"],
    isComplete: true,
  },
  {
    id: "q4-2024",
    label: "Q4 2024 (Triwulan)",
    type: "quarterly",
    data: riskCategoriesJsonData.quarterly["q4-2024"],
    isComplete: true,
  },
  {
    id: "q3-2024",
    label: "Q3 2024 (Triwulan)",
    type: "quarterly",
    data: riskCategoriesJsonData.quarterly["q3-2024"],
    isComplete: true,
  },
];

// Geographic data periods
export const availableGeographicPeriods: GeographicDataPeriod[] = [
  {
    id: "2024",
    label: "2024 (Tahunan)",
    type: "yearly",
    data: geographicJsonData.yearly["2024"],
    isComplete: true,
  },
  {
    id: "2023",
    label: "2023 (Tahunan)",
    type: "yearly",
    data: geographicJsonData.yearly["2023"],
    isComplete: true,
  },
  {
    id: "q4-2024",
    label: "Q4 2024 (Triwulan)",
    type: "quarterly",
    data: geographicJsonData.quarterly["q4-2024"],
    isComplete: true,
  },
  {
    id: "q3-2024",
    label: "Q3 2024 (Triwulan)",
    type: "quarterly",
    data: geographicJsonData.quarterly["q3-2024"],
    isComplete: true,
  },
];

// Risk capture data periods
export const availableRiskCapturePeriods: RiskCaptureDataPeriod[] = [
  {
    id: "2024",
    label: "2024 (Tahunan)",
    type: "yearly",
    data: riskCaptureJsonData.yearly["2024"],
    isComplete: true,
  },
  {
    id: "2023",
    label: "2023 (Tahunan)",
    type: "yearly",
    data: riskCaptureJsonData.yearly["2023"],
    isComplete: true,
  },
  {
    id: "q4-2024",
    label: "Q4 2024 (Triwulan)",
    type: "quarterly",
    data: riskCaptureJsonData.quarterly["q4-2024"],
    isComplete: true,
  },
  {
    id: "q3-2024",
    label: "Q3 2024 (Triwulan)",
    type: "quarterly",
    data: riskCaptureJsonData.quarterly["q3-2024"],
    isComplete: true,
  },
];

// Invoice status data periods
export const availableInvoiceStatusPeriods: InvoiceStatusDataPeriod[] = [
  {
    id: "2024",
    label: "2024 (Tahunan)",
    type: "yearly",
    data: invoiceStatusJsonData.yearly["2024"],
    isComplete: true,
  },
  {
    id: "2023",
    label: "2023 (Tahunan)",
    type: "yearly",
    data: invoiceStatusJsonData.yearly["2023"],
    isComplete: true,
  },
  {
    id: "q4-2024",
    label: "Q4 2024 (Triwulan)",
    type: "quarterly",
    data: invoiceStatusJsonData.quarterly["q4-2024"],
    isComplete: true,
  },
  {
    id: "q3-2024",
    label: "Q3 2024 (Triwulan)",
    type: "quarterly",
    data: invoiceStatusJsonData.quarterly["q3-2024"],
    isComplete: true,
  },
];

// Aging receivables data periods
export const availableAgingReceivablesPeriods: AgingReceivablesDataPeriod[] = [
  {
    id: "2024",
    label: "2024 (Tahunan)",
    type: "yearly",
    data: agingReceivablesJsonData.yearly["2024"],
    isComplete: true,
  },
  {
    id: "2023",
    label: "2023 (Tahunan)",
    type: "yearly",
    data: agingReceivablesJsonData.yearly["2023"],
    isComplete: true,
  },
  {
    id: "q4-2024",
    label: "Q4 2024 (Triwulan)",
    type: "quarterly",
    data: agingReceivablesJsonData.quarterly["q4-2024"],
    isComplete: true,
  },
  {
    id: "q3-2024",
    label: "Q3 2024 (Triwulan)",
    type: "quarterly",
    data: agingReceivablesJsonData.quarterly["q3-2024"],
    isComplete: true,
  },
];
