import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProjectDistributionChart from "@/components/ProjectDistributionChart";
import RiskCapturePieChart from "@/components/RiskCapturePieChart";
import { RiskCategoryDetailDialog } from "@/components/dashboard/RiskCategoryDetailDialog";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Building,
  Shield,
  Gavel,
  Cpu,
  Leaf,
  Target,
  FileText,
  Calendar,
  PieChart,
  ChevronDown,
  Info,
  Activity,
} from "lucide-react";
import * as Highcharts from "highcharts";

interface ProjectSummary {
  total: number;
  running: number;
  completed: number;
}

interface RiskCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  total: number;
  overdue: number;
  inProcess: number;
  closed: number;
}

interface InvoiceStatus {
  completed_no_invoice: number;
  issued_unpaid: number;
  paid: number;
}

interface AgingReceivable {
  category: string;
  amount: number;
  color: "green" | "yellow" | "red";
  days: string;
}

interface ProvinceData {
  name: string;
  value: number;
  revenue: number; // Revenue in IDR
  projects: string[];
}

// Performance data types
type PeriodType = "yearly" | "quarterly";
type DataPeriod = {
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

// Risk data types
type RiskDataPeriod = {
  id: string;
  label: string;
  type: PeriodType;
  data: RiskCategory[];
  isComplete: boolean;
};

// Geographic data types
type GeographicDataPeriod = {
  id: string;
  label: string;
  type: PeriodType;
  data: ProvinceData[];
  isComplete: boolean;
};

// Risk Capture data types
type RiskCaptureDataPeriod = {
  id: string;
  label: string;
  type: PeriodType;
  data: Array<{ name: string; y: number; color: string }>;
  isComplete: boolean;
};

// Invoice Status data types
type InvoiceStatusDataPeriod = {
  id: string;
  label: string;
  type: PeriodType;
  data: InvoiceStatus;
  isComplete: boolean;
};

// Aging Receivables data types
type AgingReceivablesDataPeriod = {
  id: string;
  label: string;
  type: PeriodType;
  data: AgingReceivable[];
  isComplete: boolean;
};

// Mock performance data
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

// Q4 2024 data (fallback when current year is incomplete)
const quarterlyPerformanceQ4_2024 = [
  { period: "Oct 2024", projects: 5, revenue: 3800000000, risks: 13 },
  { period: "Nov 2024", projects: 8, revenue: 5100000000, risks: 19 },
  { period: "Dec 2024", projects: 4, revenue: 3000000000, risks: 9 },
];

// Q3 2024 data
const quarterlyPerformanceQ3_2024 = [
  { period: "Jul 2024", projects: 6, revenue: 3900000000, risks: 11 },
  { period: "Aug 2024", projects: 9, revenue: 6200000000, risks: 22 },
  { period: "Sep 2024", projects: 7, revenue: 4700000000, risks: 16 },
];

const availablePerformancePeriods: DataPeriod[] = [
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

// Smart detection logic for performance data
const detectBestPerformancePeriod = (): DataPeriod => {
  const currentYear = new Date().getFullYear().toString();

  // First, try to find complete yearly data for current year
  const currentYearData = availablePerformancePeriods.find(
    (period) =>
      period.id === currentYear &&
      period.type === "yearly" &&
      period.isComplete,
  );

  if (currentYearData) {
    return currentYearData;
  }

  // If current year is incomplete, find the latest quarterly data
  const quarterlyData = availablePerformancePeriods
    .filter(
      (period) =>
        period.type === "quarterly" && period.id.includes(currentYear),
    )
    .sort((a, b) => b.id.localeCompare(a.id))[0];

  if (quarterlyData) {
    return quarterlyData;
  }

  // Fallback to previous year if available
  const previousYear = (parseInt(currentYear) - 1).toString();
  const previousYearData = availablePerformancePeriods.find(
    (period) => period.id === previousYear && period.type === "yearly",
  );

  if (previousYearData) {
    return previousYearData;
  }

  // Ultimate fallback
  return availablePerformancePeriods[0];
};

// Risk categories data for different periods
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

// Q4 2024 Risk data (fallback)
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

// Q3 2024 Risk data
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

const availableRiskPeriods: RiskDataPeriod[] = [
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

// Smart detection logic for risk data
const detectBestRiskPeriod = (): RiskDataPeriod => {
  const currentYear = new Date().getFullYear().toString();

  // First, try to find complete yearly data for current year
  const currentYearData = availableRiskPeriods.find(
    (period) =>
      period.id === currentYear &&
      period.type === "yearly" &&
      period.isComplete,
  );

  if (currentYearData) {
    return currentYearData;
  }

  // If current year is incomplete, find the latest quarterly data
  const quarterlyData = availableRiskPeriods
    .filter(
      (period) =>
        period.type === "quarterly" && period.id.includes(currentYear),
    )
    .sort((a, b) => b.id.localeCompare(a.id))[0];

  if (quarterlyData) {
    return quarterlyData;
  }

  // Fallback to previous year if available
  const previousYear = (parseInt(currentYear) - 1).toString();
  const previousYearData = availableRiskPeriods.find(
    (period) => period.id === previousYear && period.type === "yearly",
  );

  if (previousYearData) {
    return previousYearData;
  }

  // Ultimate fallback
  return availableRiskPeriods[0];
};

// Geographic data for different periods
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

// Risk Capture data for different periods
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

// Available periods for geographic data
const availableGeographicPeriods: GeographicDataPeriod[] = [
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

// Available periods for risk capture data
const availableRiskCapturePeriods: RiskCaptureDataPeriod[] = [
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

// Smart detection for geographic data
const detectBestGeographicPeriod = (): GeographicDataPeriod => {
  const currentYear = new Date().getFullYear().toString();
  const currentYearData = availableGeographicPeriods.find(
    (period) =>
      period.id === currentYear &&
      period.type === "yearly" &&
      period.isComplete,
  );
  if (currentYearData) return currentYearData;

  const quarterlyData = availableGeographicPeriods
    .filter(
      (period) =>
        period.type === "quarterly" && period.id.includes(currentYear),
    )
    .sort((a, b) => b.id.localeCompare(a.id))[0];
  if (quarterlyData) return quarterlyData;

  const previousYear = (parseInt(currentYear) - 1).toString();
  const previousYearData = availableGeographicPeriods.find(
    (period) => period.id === previousYear && period.type === "yearly",
  );
  if (previousYearData) return previousYearData;

  return availableGeographicPeriods[0];
};

// Smart detection for risk capture data
const detectBestRiskCapturePeriod = (): RiskCaptureDataPeriod => {
  const currentYear = new Date().getFullYear().toString();
  const currentYearData = availableRiskCapturePeriods.find(
    (period) =>
      period.id === currentYear &&
      period.type === "yearly" &&
      period.isComplete,
  );
  if (currentYearData) return currentYearData;

  const quarterlyData = availableRiskCapturePeriods
    .filter(
      (period) =>
        period.type === "quarterly" && period.id.includes(currentYear),
    )
    .sort((a, b) => b.id.localeCompare(a.id))[0];
  if (quarterlyData) return quarterlyData;

  const previousYear = (parseInt(currentYear) - 1).toString();
  const previousYearData = availableRiskCapturePeriods.find(
    (period) => period.id === previousYear && period.type === "yearly",
  );
  if (previousYearData) return previousYearData;

  return availableRiskCapturePeriods[0];
};

// Invoice Status data for different periods
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

// Aging Receivables data for different periods
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

// Available periods for invoice status
const availableInvoiceStatusPeriods: InvoiceStatusDataPeriod[] = [
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

// Available periods for aging receivables
const availableAgingReceivablesPeriods: AgingReceivablesDataPeriod[] = [
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

// Smart detection for invoice status
const detectBestInvoiceStatusPeriod = (): InvoiceStatusDataPeriod => {
  const currentYear = new Date().getFullYear().toString();
  const currentYearData = availableInvoiceStatusPeriods.find(
    (period) =>
      period.id === currentYear &&
      period.type === "yearly" &&
      period.isComplete,
  );
  if (currentYearData) return currentYearData;

  const quarterlyData = availableInvoiceStatusPeriods
    .filter(
      (period) =>
        period.type === "quarterly" && period.id.includes(currentYear),
    )
    .sort((a, b) => b.id.localeCompare(a.id))[0];
  if (quarterlyData) return quarterlyData;

  const previousYear = (parseInt(currentYear) - 1).toString();
  const previousYearData = availableInvoiceStatusPeriods.find(
    (period) => period.id === previousYear && period.type === "yearly",
  );
  if (previousYearData) return previousYearData;

  return availableInvoiceStatusPeriods[0];
};

// Smart detection for aging receivables
const detectBestAgingReceivablesPeriod = (): AgingReceivablesDataPeriod => {
  const currentYear = new Date().getFullYear().toString();
  const currentYearData = availableAgingReceivablesPeriods.find(
    (period) =>
      period.id === currentYear &&
      period.type === "yearly" &&
      period.isComplete,
  );
  if (currentYearData) return currentYearData;

  const quarterlyData = availableAgingReceivablesPeriods
    .filter(
      (period) =>
        period.type === "quarterly" && period.id.includes(currentYear),
    )
    .sort((a, b) => b.id.localeCompare(a.id))[0];
  if (quarterlyData) return quarterlyData;

  const previousYear = (parseInt(currentYear) - 1).toString();
  const previousYearData = availableAgingReceivablesPeriods.find(
    (period) => period.id === previousYear && period.type === "yearly",
  );
  if (previousYearData) return previousYearData;

  return availableAgingReceivablesPeriods[0];
};

export default function Index() {
  // Dynamic project summary based on performance period
  const calculateProjectSummary = (
    performancePeriod: DataPeriod,
  ): ProjectSummary => {
    const totalProjects = performancePeriod.data.reduce(
      (sum, item) => sum + item.projects,
      0,
    );

    // Calculate running projects (assume 60-65% of total are running)
    const runningPercentage = performancePeriod.type === "yearly" ? 0.62 : 0.65;
    const running = Math.round(totalProjects * runningPercentage);

    // Calculate completed projects (remaining from total)
    const completed = totalProjects - running;

    return {
      total: totalProjects,
      running: running,
      completed: completed,
    };
  };

  const [projectSummary, setProjectSummary] = useState<ProjectSummary>(
    calculateProjectSummary(detectBestPerformancePeriod()),
  );

  // Performance chart state
  const performanceChartRef = useRef<HTMLDivElement>(null);
  const [selectedPerformancePeriod, setSelectedPerformancePeriod] =
    useState<DataPeriod>(detectBestPerformancePeriod());
  const [showPerformanceDropdown, setShowPerformanceDropdown] = useState(false);
  const [performanceAutoSelected, setPerformanceAutoSelected] = useState(true);

  // Risk categories state with dynamic period management
  const [selectedRiskPeriod, setSelectedRiskPeriod] = useState<RiskDataPeriod>(
    detectBestRiskPeriod(),
  );
  const [showRiskDropdown, setShowRiskDropdown] = useState(false);
  const [riskAutoSelected, setRiskAutoSelected] = useState(true);
  const [riskCategories, setRiskCategories] = useState<RiskCategory[]>(
    detectBestRiskPeriod().data,
  );

  // Geographic data state
  const [selectedGeographicPeriod, setSelectedGeographicPeriod] =
    useState<GeographicDataPeriod>(detectBestGeographicPeriod());
  const [showGeographicDropdown, setShowGeographicDropdown] = useState(false);
  const [geographicAutoSelected, setGeographicAutoSelected] = useState(true);
  const [provinceData, setProvinceData] = useState<ProvinceData[]>(
    detectBestGeographicPeriod().data,
  );

  // Risk capture data state
  const [selectedRiskCapturePeriod, setSelectedRiskCapturePeriod] =
    useState<RiskCaptureDataPeriod>(detectBestRiskCapturePeriod());
  const [showRiskCaptureDropdown, setShowRiskCaptureDropdown] = useState(false);
  const [riskCaptureAutoSelected, setRiskCaptureAutoSelected] = useState(true);
  const [riskCaptureData, setRiskCaptureData] = useState(
    detectBestRiskCapturePeriod().data,
  );

  // Invoice status state with dynamic period management
  const [selectedInvoiceStatusPeriod, setSelectedInvoiceStatusPeriod] =
    useState<InvoiceStatusDataPeriod>(detectBestInvoiceStatusPeriod());
  const [showInvoiceStatusDropdown, setShowInvoiceStatusDropdown] =
    useState(false);
  const [invoiceStatusAutoSelected, setInvoiceStatusAutoSelected] =
    useState(true);
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>(
    detectBestInvoiceStatusPeriod().data,
  );

  // Aging receivables state with dynamic period management
  const [selectedAgingReceivablesPeriod, setSelectedAgingReceivablesPeriod] =
    useState<AgingReceivablesDataPeriod>(detectBestAgingReceivablesPeriod());
  const [showAgingReceivablesDropdown, setShowAgingReceivablesDropdown] =
    useState(false);
  const [agingReceivablesAutoSelected, setAgingReceivablesAutoSelected] =
    useState(true);
  const [agingReceivables, setAgingReceivables] = useState<AgingReceivable[]>(
    detectBestAgingReceivablesPeriod().data,
  );

  // Dialog state for risk category details
  const [selectedRiskCategory, setSelectedRiskCategory] =
    useState<RiskCategory | null>(null);
  const [isRiskDialogOpen, setIsRiskDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    return formatCurrency(amount);
  };

  const updatePerformanceChart = (dataPeriod: DataPeriod) => {
    if (performanceChartRef.current) {
      Highcharts.chart(performanceChartRef.current, {
        chart: {
          type: "column",
          height: 350,
          backgroundColor: "transparent",
        },
        title: {
          text: "",
        },
        xAxis: {
          categories: dataPeriod.data.map((stat) =>
            dataPeriod.type === "yearly"
              ? stat.period.split(" ")[0]
              : stat.period,
          ),
          crosshair: true,
        },
        yAxis: [
          {
            min: 0,
            title: {
              text: "Jumlah Proyek & Risiko",
              style: {
                color: "#666",
              },
            },
            labels: {
              style: {
                color: "#666",
              },
            },
          },
          {
            title: {
              text: "Revenue (Milyar IDR)",
              style: {
                color: "#f59e0b",
              },
            },
            labels: {
              formatter: function () {
                return (this.value / 1000000000).toFixed(1) + "B";
              },
              style: {
                color: "#f59e0b",
              },
            },
            opposite: true,
          },
        ],
        tooltip: {
          shared: true,
          formatter: function () {
            let tooltip = `<b>${this.x}</b><br/>`;
            this.points?.forEach((point) => {
              if (point.series.name === "Revenue") {
                tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${formatCurrency(point.y!)}</b><br/>`;
              } else {
                tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b><br/>`;
              }
            });
            return tooltip;
          },
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
        },
        series: [
          {
            name: "Proyek",
            data: dataPeriod.data.map((stat) => stat.projects),
            color: "#3b82f6",
            yAxis: 0,
          },
          {
            name: "Risiko",
            data: dataPeriod.data.map((stat) => stat.risks),
            color: "#ef4444",
            yAxis: 0,
          },
          {
            name: "Revenue",
            data: dataPeriod.data.map((stat) => stat.revenue),
            color: "#f59e0b",
            type: "line",
            yAxis: 1,
            marker: {
              enabled: true,
              radius: 4,
            },
          },
        ],
        credits: {
          enabled: false,
        },
        legend: {
          align: "center",
          verticalAlign: "bottom",
          layout: "horizontal",
        },
      });
    }
  };

  useEffect(() => {
    updatePerformanceChart(selectedPerformancePeriod);
  }, [selectedPerformancePeriod]);

  const handlePerformancePeriodChange = (period: DataPeriod) => {
    setSelectedPerformancePeriod(period);
    setProjectSummary(calculateProjectSummary(period));
    setPerformanceAutoSelected(false);
    setShowPerformanceDropdown(false);
  };

  // Update project summary when performance period changes
  useEffect(() => {
    setProjectSummary(calculateProjectSummary(selectedPerformancePeriod));
  }, [selectedPerformancePeriod]);

  const shouldShowPerformanceFallbackMessage = () => {
    const currentYear = new Date().getFullYear().toString();
    return (
      performanceAutoSelected &&
      selectedPerformancePeriod.type === "quarterly" &&
      selectedPerformancePeriod.id.includes(currentYear)
    );
  };

  const handleRiskPeriodChange = (period: RiskDataPeriod) => {
    setSelectedRiskPeriod(period);
    setRiskCategories(period.data);
    setRiskAutoSelected(false);
    setShowRiskDropdown(false);
  };

  const shouldShowRiskFallbackMessage = () => {
    const currentYear = new Date().getFullYear().toString();
    return (
      riskAutoSelected &&
      selectedRiskPeriod.type === "quarterly" &&
      selectedRiskPeriod.id.includes(currentYear)
    );
  };

  // Calculate risk insights
  const getRiskInsights = (categories: RiskCategory[]) => {
    const totalRisks = categories.reduce((sum, cat) => sum + cat.total, 0);
    const totalOverdue = categories.reduce((sum, cat) => sum + cat.overdue, 0);
    const totalInProcess = categories.reduce(
      (sum, cat) => sum + cat.inProcess,
      0,
    );
    const totalClosed = categories.reduce((sum, cat) => sum + cat.closed, 0);
    const overduePercentage =
      totalRisks > 0 ? Math.round((totalOverdue / totalRisks) * 100) : 0;
    const closedPercentage =
      totalRisks > 0 ? Math.round((totalClosed / totalRisks) * 100) : 0;

    return {
      totalRisks,
      totalOverdue,
      totalInProcess,
      totalClosed,
      overduePercentage,
      closedPercentage,
    };
  };

  const handleInvoiceStatusPeriodChange = (period: InvoiceStatusDataPeriod) => {
    setSelectedInvoiceStatusPeriod(period);
    setInvoiceStatus(period.data);
    setInvoiceStatusAutoSelected(false);
    setShowInvoiceStatusDropdown(false);
  };

  const shouldShowInvoiceStatusFallbackMessage = () => {
    const currentYear = new Date().getFullYear().toString();
    return (
      invoiceStatusAutoSelected &&
      selectedInvoiceStatusPeriod.type === "quarterly" &&
      selectedInvoiceStatusPeriod.id.includes(currentYear)
    );
  };

  const handleAgingReceivablesPeriodChange = (
    period: AgingReceivablesDataPeriod,
  ) => {
    setSelectedAgingReceivablesPeriod(period);
    setAgingReceivables(period.data);
    setAgingReceivablesAutoSelected(false);
    setShowAgingReceivablesDropdown(false);
  };

  const shouldShowAgingReceivablesFallbackMessage = () => {
    const currentYear = new Date().getFullYear().toString();
    return (
      agingReceivablesAutoSelected &&
      selectedAgingReceivablesPeriod.type === "quarterly" &&
      selectedAgingReceivablesPeriod.id.includes(currentYear)
    );
  };

  // Calculate financial insights
  const getFinancialInsights = (
    invoiceData: InvoiceStatus,
    agingData: AgingReceivable[],
  ) => {
    const totalInvoices =
      invoiceData.completed_no_invoice +
      invoiceData.issued_unpaid +
      invoiceData.paid;
    const totalOutstanding = agingData.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const paidPercentage =
      totalInvoices > 0
        ? Math.round((invoiceData.paid / totalInvoices) * 100)
        : 0;
    const overdueAmount =
      agingData.find((item) => item.days === ">90")?.amount || 0;
    const overduePercentage =
      totalOutstanding > 0
        ? Math.round((overdueAmount / totalOutstanding) * 100)
        : 0;

    return {
      totalInvoices,
      totalOutstanding,
      paidPercentage,
      overdueAmount,
      overduePercentage,
    };
  };

  const handleGeographicPeriodChange = (period: GeographicDataPeriod) => {
    setSelectedGeographicPeriod(period);
    setProvinceData(period.data);
    setGeographicAutoSelected(false);
    setShowGeographicDropdown(false);
  };

  const shouldShowGeographicFallbackMessage = () => {
    const currentYear = new Date().getFullYear().toString();
    return (
      geographicAutoSelected &&
      selectedGeographicPeriod.type === "quarterly" &&
      selectedGeographicPeriod.id.includes(currentYear)
    );
  };

  const handleRiskCapturePeriodChange = (period: RiskCaptureDataPeriod) => {
    setSelectedRiskCapturePeriod(period);
    setRiskCaptureData(period.data);
    setRiskCaptureAutoSelected(false);
    setShowRiskCaptureDropdown(false);
  };

  const shouldShowRiskCaptureFallbackMessage = () => {
    const currentYear = new Date().getFullYear().toString();
    return (
      riskCaptureAutoSelected &&
      selectedRiskCapturePeriod.type === "quarterly" &&
      selectedRiskCapturePeriod.id.includes(currentYear)
    );
  };

  // Calculate geographic insights
  const getGeographicInsights = (data: ProvinceData[]) => {
    const totalProjects = data.reduce(
      (sum, province) => sum + province.value,
      0,
    );
    const totalRevenue = data.reduce(
      (sum, province) => sum + province.revenue,
      0,
    );
    const avgProjectsPerProvince =
      data.length > 0 ? Math.round(totalProjects / data.length) : 0;
    const avgRevenuePerProvince =
      data.length > 0 ? totalRevenue / data.length : 0;

    return {
      totalProjects,
      totalRevenue,
      totalProvinces: data.length,
      avgProjectsPerProvince,
      avgRevenuePerProvince,
    };
  };

  // Calculate risk capture insights
  const getRiskCaptureInsights = (
    data: Array<{ name: string; y: number; color: string }>,
  ) => {
    const totalItems = data.reduce((sum, item) => sum + item.y, 0);
    const highRiskItems = data.find((item) => item.name === "High")?.y || 0;
    const lowRiskItems = data.find((item) => item.name === "Low")?.y || 0;
    const highRiskPercentage =
      totalItems > 0 ? Math.round((highRiskItems / totalItems) * 100) : 0;
    const lowRiskPercentage =
      totalItems > 0 ? Math.round((lowRiskItems / totalItems) * 100) : 0;

    return {
      totalItems,
      highRiskItems,
      lowRiskItems,
      highRiskPercentage,
      lowRiskPercentage,
    };
  };

  const getStatusColor = (status: "overdue" | "inProcess" | "closed") => {
    switch (status) {
      case "overdue":
        return "bg-red-500";
      case "inProcess":
        return "bg-yellow-500";
      case "closed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAgingColor = (color: "green" | "yellow" | "red") => {
    switch (color) {
      case "green":
        return "text-green-600 bg-green-50 border-green-200";
      case "yellow":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "red":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Handle risk category card click
  const handleRiskCategoryClick = (category: RiskCategory) => {
    setSelectedRiskCategory(category);
    setIsRiskDialogOpen(true);
  };

  const closeRiskDialog = () => {
    setIsRiskDialogOpen(false);
    setSelectedRiskCategory(null);
  };

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Management Risiko
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor dan kelola risiko proyek secara real-time
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
              <Badge variant="outline" className="px-3 py-1">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue & Invoice Status */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start justify-between">
                <div className="flex flex-col items-start gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-6 w-6 text-green-500" />
                      <CardTitle className="flex items-center gap-2">
                        <span>Status Pendapatan & Invoice</span>
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex my-3">
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedInvoiceStatusPeriod.label}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${
                        selectedInvoiceStatusPeriod.type === "yearly"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {selectedInvoiceStatusPeriod.type === "yearly" ? (
                        <>
                          <Calendar className="w-3 h-3 mr-1" />
                          Tahunan
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Triwulan
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Period Selector */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setShowInvoiceStatusDropdown(!showInvoiceStatusDropdown)
                    }
                    className="flex items-center gap-2 mb-3 md:mb-0"
                  >
                    <Calendar className="w-4 h-4" />
                    Ubah Periode
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  {showInvoiceStatusDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                          PILIH PERIODE DATA
                        </div>
                        {availableInvoiceStatusPeriods.map((period) => (
                          <button
                            key={period.id}
                            onClick={() =>
                              handleInvoiceStatusPeriodChange(period)
                            }
                            className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center justify-between ${
                              selectedInvoiceStatusPeriod.id === period.id
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {period.type === "yearly" ? (
                                <Calendar className="w-4 h-4" />
                              ) : (
                                <TrendingUp className="w-4 h-4" />
                              )}
                              <span>{period.label}</span>
                            </div>
                            {!period.isComplete && (
                              <Badge variant="secondary" className="text-xs">
                                Parsial
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fallback Message */}
              {shouldShowInvoiceStatusFallbackMessage() && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Menampilkan Data Invoice Triwulan
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Data invoice tahun {new Date().getFullYear()} belum
                      lengkap, menampilkan data triwulan terakhir.
                    </p>
                  </div>
                </div>
              )}

              {/* Invoice Insights */}
              <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {(() => {
                  const insights = getFinancialInsights(
                    invoiceStatus,
                    agingReceivables,
                  );
                  return (
                    <>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-blue-800">
                          Total Invoice
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {insights.totalInvoices}
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-green-800">
                          Paid Rate
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {insights.paidPercentage}%
                        </div>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-red-800">
                          Overdue
                        </div>
                        <div className="text-lg font-bold text-red-600">
                          {insights.overduePercentage}%
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-red-800">
                        Selesai, Belum Ada Invoice
                      </p>
                      <p className="text-sm text-red-600">
                        Proyek completed tanpa invoice
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-700">
                    {invoiceStatus.completed_no_invoice}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-yellow-800">
                        Invoice Issued, Belum Dibayar
                      </p>
                      <p className="text-sm text-yellow-600">
                        Menunggu pembayaran
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-yellow-700">
                    {invoiceStatus.issued_unpaid}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-green-800">
                        Invoice Sudah Dibayar
                      </p>
                      <p className="text-sm text-green-600">
                        Pembayaran completed
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-700">
                    {invoiceStatus.paid}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aging Receivables */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start justify-between">
                <div className="flex flex-col items-start gap-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-orange-500" />
                      <CardTitle>
                        <span>Aging Piutang Proyek</span>
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex my-2">
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedAgingReceivablesPeriod.label}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${
                        selectedAgingReceivablesPeriod.type === "yearly"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {selectedAgingReceivablesPeriod.type === "yearly" ? (
                        <>
                          <Calendar className="w-3 h-3 mr-1" />
                          Tahunan
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Triwulan
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Period Selector */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setShowAgingReceivablesDropdown(
                        !showAgingReceivablesDropdown,
                      )
                    }
                    className="flex items-center gap-2 mb-3"
                  >
                    <Calendar className="w-4 h-4" />
                    Ubah Periode
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  {showAgingReceivablesDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                          PILIH PERIODE DATA
                        </div>
                        {availableAgingReceivablesPeriods.map((period) => (
                          <button
                            key={period.id}
                            onClick={() =>
                              handleAgingReceivablesPeriodChange(period)
                            }
                            className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center justify-between ${
                              selectedAgingReceivablesPeriod.id === period.id
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {period.type === "yearly" ? (
                                <Calendar className="w-4 h-4" />
                              ) : (
                                <TrendingUp className="w-4 h-4" />
                              )}
                              <span>{period.label}</span>
                            </div>
                            {!period.isComplete && (
                              <Badge variant="secondary" className="text-xs">
                                Parsial
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fallback Message */}
              {shouldShowAgingReceivablesFallbackMessage() && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Menampilkan Data Piutang Triwulan
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Data aging piutang tahun {new Date().getFullYear()} belum
                      lengkap, menampilkan data triwulan terakhir.
                    </p>
                  </div>
                </div>
              )}

              {/* Aging Insights */}
              <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {(() => {
                  const insights = getFinancialInsights(
                    invoiceStatus,
                    agingReceivables,
                  );
                  return (
                    <>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-gray-800">
                          Total Outstanding
                        </div>
                        <div className="text-lg font-bold text-gray-600">
                          {formatCurrencyShort(insights.totalOutstanding)}
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-yellow-800">
                          31-90 Hari
                        </div>
                        <div className="text-lg font-bold text-yellow-600">
                          {formatCurrencyShort(
                            agingReceivables.find(
                              (item) => item.days === "31-90",
                            )?.amount || 0,
                          )}
                        </div>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-red-800">
                          &gt;90 Hari
                        </div>
                        <div className="text-lg font-bold text-red-600">
                          {formatCurrencyShort(insights.overdueAmount)}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm">
                  Urutkan: Nilai Terbesar
                </Button>
                <Button variant="outline" size="sm">
                  Urutkan: Risiko Proyek
                </Button>
              </div> */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agingReceivables.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${getAgingColor(item.color)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.category}</p>
                        <p className="text-sm opacity-75">
                          Outstanding piutang
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {formatCurrency(item.amount)}
                        </p>
                        <p className="text-xs opacity-75">{item.days} hari</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      Total Outstanding:
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(
                        agingReceivables.reduce(
                          (sum, item) => sum + item.amount,
                          0,
                        ),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-blue-100 text-sm font-medium">
                      Total Proyek
                    </p>
                    <Badge
                      variant="secondary"
                      className={`text-xs px-2 py-0.5 ${
                        selectedPerformancePeriod.type === "yearly"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-orange-200 text-orange-800"
                      }`}
                    >
                      {selectedPerformancePeriod.type === "yearly"
                        ? "Tahunan"
                        : "Triwulan"}
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold">{projectSummary.total}</p>
                  <p className="text-blue-200 text-xs mt-1">
                    Periode: {selectedPerformancePeriod.label}
                  </p>
                </div>
                <BarChart3 className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-green-100 text-sm font-medium">
                      Proyek Berjalan
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0.5 bg-green-200 text-green-800"
                    >
                      {Math.round(
                        (projectSummary.running / projectSummary.total) * 100,
                      )}
                      %
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold">{projectSummary.running}</p>
                  <p className="text-green-200 text-xs mt-1">
                    Dari {projectSummary.total} total proyek
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-purple-100 text-sm font-medium">
                      Proyek Selesai
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0.5 bg-purple-200 text-purple-800"
                    >
                      {Math.round(
                        (projectSummary.completed / projectSummary.total) * 100,
                      )}
                      %
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold">
                    {projectSummary.completed}
                  </p>
                  <p className="text-purple-200 text-xs mt-1">
                    Completion rate
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview Chart */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start justify-between gap-5">
              <div className="flex items-center gap-2">
                <div>
                  <div className="flex gap-3">
                    <Activity className="w-5 h-5" />
                    <CardTitle className="flex items-center gap-2">
                      Performance Overview
                    </CardTitle>
                  </div>
                  <div className="flex items-center my-2">
                    <p className="text-sm text-gray-600">
                      {selectedPerformancePeriod.label}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${
                        selectedPerformancePeriod.type === "yearly"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {selectedPerformancePeriod.type === "yearly" ? (
                        <>
                          <Calendar className="w-3 h-3 mr-1" />
                          Tahunan
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Triwulan
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Period Selector */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setShowPerformanceDropdown(!showPerformanceDropdown)
                  }
                  className="flex items-center gap-2 mb-3"
                >
                  <Calendar className="w-4 h-4" />
                  Ubah Periode
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {showPerformanceDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                        PILIH PERIODE DATA
                      </div>
                      {availablePerformancePeriods.map((period) => (
                        <button
                          key={period.id}
                          onClick={() => handlePerformancePeriodChange(period)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center justify-between ${
                            selectedPerformancePeriod.id === period.id
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {period.type === "yearly" ? (
                              <Calendar className="w-4 h-4" />
                            ) : (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            <span>{period.label}</span>
                          </div>
                          {!period.isComplete && (
                            <Badge variant="secondary" className="text-xs">
                              Parsial
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fallback Message */}
            {shouldShowPerformanceFallbackMessage() && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Menampilkan Data Triwulan
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Data tahun {new Date().getFullYear()} belum lengkap,
                    menampilkan data triwulan terakhir yang tersedia.
                  </p>
                </div>
              </div>
            )}

            {/* Performance Insights */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-800">
                  Total Proyek
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {selectedPerformancePeriod.data.reduce(
                    (sum, item) => sum + item.projects,
                    0,
                  )}
                </div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-amber-800">
                  Total Revenue
                </div>
                <div className="text-lg font-bold text-amber-600">
                  {formatCurrencyShort(
                    selectedPerformancePeriod.data.reduce(
                      (sum, item) => sum + item.revenue,
                      0,
                    ),
                  )}
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-red-800">
                  Total Risiko
                </div>
                <div className="text-lg font-bold text-red-600">
                  {selectedPerformancePeriod.data.reduce(
                    (sum, item) => sum + item.risks,
                    0,
                  )}
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-green-800">
                  Avg Revenue/Proyek
                </div>
                <div className="text-lg font-bold text-green-600">
                  {(() => {
                    const totalProjects = selectedPerformancePeriod.data.reduce(
                      (sum, item) => sum + item.projects,
                      0,
                    );
                    const totalRevenue = selectedPerformancePeriod.data.reduce(
                      (sum, item) => sum + item.revenue,
                      0,
                    );
                    return formatCurrencyShort(totalRevenue / totalProjects);
                  })()}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div ref={performanceChartRef} className="w-full" />
          </CardContent>
        </Card>

        {/* Risk Status by RMC Categories */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start justify-between gap-5">
              <div className="flex items-center gap-2">
                <div>
                  <div className="flex gap-3">
                    <Shield className="h-6 w-6 text-red-500" />
                    <CardTitle className="flex items-center gap-2">
                      Status Risiko Proyek (Kategori RMC)
                    </CardTitle>
                  </div>
                  <div className="flex items-center my-2">
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedRiskPeriod.label}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${
                        selectedRiskPeriod.type === "yearly"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {selectedRiskPeriod.type === "yearly" ? (
                        <>
                          <Calendar className="w-3 h-3 mr-1" />
                          Tahunan
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Triwulan
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Period Selector */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRiskDropdown(!showRiskDropdown)}
                  className="flex items-center gap-2 mb-3"
                >
                  <Calendar className="w-4 h-4" />
                  Ubah Periode
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {showRiskDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                        PILIH PERIODE DATA
                      </div>
                      {availableRiskPeriods.map((period) => (
                        <button
                          key={period.id}
                          onClick={() => handleRiskPeriodChange(period)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center justify-between ${
                            selectedRiskPeriod.id === period.id
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {period.type === "yearly" ? (
                              <Calendar className="w-4 h-4" />
                            ) : (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            <span>{period.label}</span>
                          </div>
                          {!period.isComplete && (
                            <Badge variant="secondary" className="text-xs">
                              Parsial
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fallback Message */}
            {shouldShowRiskFallbackMessage() && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Menampilkan Data Risiko Triwulan
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Data risiko tahun {new Date().getFullYear()} belum lengkap,
                    menampilkan data triwulan terakhir yang tersedia.
                  </p>
                </div>
              </div>
            )}

            {/* Risk Insights Summary */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              {(() => {
                const insights = getRiskInsights(riskCategories);
                return (
                  <>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-800">
                        Total Risiko
                      </div>
                      <div className="text-lg font-bold text-gray-600">
                        {insights.totalRisks}
                      </div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-red-800">
                        Overdue
                      </div>
                      <div className="text-lg font-bold text-red-600">
                        {insights.totalOverdue} ({insights.overduePercentage}%)
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-yellow-800">
                        In Process
                      </div>
                      <div className="text-lg font-bold text-yellow-600">
                        {insights.totalInProcess}
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-green-800">
                        Closed
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {insights.totalClosed} ({insights.closedPercentage}%)
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="flex flex-wrap gap-4 text-sm mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Belum ditindaklanjuti &gt;14 hari</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Dalam proses mitigasi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Closed dengan bukti mitigasi</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              💡 <strong>Klik pada card</strong> untuk melihat detail risiko per
              kategori
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {riskCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300 hover:bg-blue-50"
                    onClick={() => handleRiskCategoryClick(category)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <h3 className="font-medium text-sm">{category.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total:</span>
                        <span className="font-semibold">{category.total}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor("overdue")}`}
                            ></div>
                            <span className="text-xs">Overdue</span>
                          </div>
                          <span className="text-xs font-medium">
                            {category.overdue}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor("inProcess")}`}
                            ></div>
                            <span className="text-xs">In Process</span>
                          </div>
                          <span className="text-xs font-medium">
                            {category.inProcess}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor("closed")}`}
                            ></div>
                            <span className="text-xs">Closed</span>
                          </div>
                          <span className="text-xs font-medium">
                            {category.closed}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Charts Section - Geographic Distribution and Risk Capture */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Geographic Distribution Chart */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start justify-between gap-5">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="flex gap-3">
                      <BarChart3 className="h-6 w-6 text-blue-500" />
                      <CardTitle>Distribusi Project per Provinsi</CardTitle>
                    </div>
                    <div className="flex items-center my-2">
                      <p className="text-sm text-gray-600">
                        {selectedGeographicPeriod.label}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`ml-2 ${
                          selectedGeographicPeriod.type === "yearly"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {selectedGeographicPeriod.type === "yearly" ? (
                          <>
                            <Calendar className="w-3 h-3 mr-1" />
                            Tahunan
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Triwulan
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Period Selector */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setShowGeographicDropdown(!showGeographicDropdown)
                    }
                    className="flex items-center gap-2 mb-3"
                  >
                    <Calendar className="w-4 h-4" />
                    Ubah Periode
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  {showGeographicDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                          PILIH PERIODE DATA
                        </div>
                        {availableGeographicPeriods.map((period) => (
                          <button
                            key={period.id}
                            onClick={() => handleGeographicPeriodChange(period)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center justify-between ${
                              selectedGeographicPeriod.id === period.id
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {period.type === "yearly" ? (
                                <Calendar className="w-4 h-4" />
                              ) : (
                                <TrendingUp className="w-4 h-4" />
                              )}
                              <span>{period.label}</span>
                            </div>
                            {!period.isComplete && (
                              <Badge variant="secondary" className="text-xs">
                                Parsial
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fallback Message */}
              {shouldShowGeographicFallbackMessage() && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Menampilkan Data Geografis Triwulan
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Data distribusi proyek tahun {new Date().getFullYear()}{" "}
                      belum lengkap, menampilkan data triwulan terakhir.
                    </p>
                  </div>
                </div>
              )}

              {/* Geographic Insights */}
              <div className="mb-4 grid grid-cols-2 gap-3">
                {(() => {
                  const insights = getGeographicInsights(provinceData);
                  return (
                    <>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-blue-800">
                          Total Proyek
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {insights.totalProjects}
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-green-800">
                          Total Revenue
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrencyShort(insights.totalRevenue)}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardHeader>
            <CardContent>
              <ProjectDistributionChart data={provinceData} title="" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Ringkasan Geografis</CardTitle>
                <Badge
                  variant="outline"
                  className={`${
                    selectedGeographicPeriod.type === "yearly"
                      ? "text-blue-600 border-blue-200"
                      : "text-orange-600 border-orange-200"
                  }`}
                >
                  {selectedGeographicPeriod.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {provinceData
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((province, index) => (
                    <div
                      key={province.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {province.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(province.revenue)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {province.value} project
                          {province.value !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-2">
                    <span>Total Provinsi:</span>
                    <span className="font-semibold">{provinceData.length}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Total Pendapatan:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(
                        provinceData.reduce((sum, p) => sum + p.revenue, 0),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rata-rata per Provinsi:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(
                        Math.round(
                          provinceData.reduce((sum, p) => sum + p.revenue, 0) /
                            provinceData.length,
                        ),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Capture Pie Chart */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start justify-between gap-5">
              <div className="flex items-center gap-2">
                <div>
                  <div className="flex gap-3">
                    <PieChart className="h-6 w-6 text-blue-500" />
                    <CardTitle className="flex items-center gap-2">
                      Risk Capture Distribution
                    </CardTitle>
                  </div>
                  <div className="flex items-center my-2">
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedRiskCapturePeriod.label} - Distribusi level
                      risiko berdasarkan severity assessment
                    </p>
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${
                        selectedRiskCapturePeriod.type === "yearly"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {selectedRiskCapturePeriod.type === "yearly" ? (
                        <>
                          <Calendar className="w-3 h-3 mr-1" />
                          Tahunan
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Triwulan
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Period Selector */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setShowRiskCaptureDropdown(!showRiskCaptureDropdown)
                  }
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Ubah Periode
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {showRiskCaptureDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                        PILIH PERIODE DATA
                      </div>
                      {availableRiskCapturePeriods.map((period) => (
                        <button
                          key={period.id}
                          onClick={() => handleRiskCapturePeriodChange(period)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center justify-between ${
                            selectedRiskCapturePeriod.id === period.id
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {period.type === "yearly" ? (
                              <Calendar className="w-4 h-4" />
                            ) : (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            <span>{period.label}</span>
                          </div>
                          {!period.isComplete && (
                            <Badge variant="secondary" className="text-xs">
                              Parsial
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fallback Message */}
            {shouldShowRiskCaptureFallbackMessage() && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Menampilkan Data Risk Capture Triwulan
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Data risk capture tahun {new Date().getFullYear()} belum
                    lengkap, menampilkan data triwulan terakhir.
                  </p>
                </div>
              </div>
            )}

            {/* Risk Capture Insights */}
            <div className="mb-4 flex flex-col md:flex-row gap-3">
              {(() => {
                const insights = getRiskCaptureInsights(riskCaptureData);
                return (
                  <>
                    <div className="flex justify-between gap-5 mt-5">
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-red-800">
                          High Risk
                        </div>
                        <div className="text-lg font-bold text-red-600">
                          {insights.highRiskItems} (
                          {insights.highRiskPercentage}
                          %)
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-green-800">
                          Low Risk
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {insights.lowRiskItems} ({insights.lowRiskPercentage}
                          %)
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </CardHeader>
          <CardContent>
            <RiskCapturePieChart data={riskCaptureData} title="" />
            <div className="mt-4 space-y-2">
              <div className="text-sm text-gray-600">
                <div className="flex gap-5 mb-1">
                  <span>Total Risk Items:</span>
                  <span className="font-semibold">
                    {riskCaptureData.reduce((sum, item) => sum + item.y, 0)}
                  </span>
                </div>
                <div className="flex gap-5">
                  <span>High Risk Items:</span>
                  <span className="font-semibold text-red-600">
                    {riskCaptureData.find((item) => item.name === "High")?.y ||
                      0}{" "}
                    (
                    {Math.round(
                      ((riskCaptureData.find((item) => item.name === "High")
                        ?.y || 0) /
                        riskCaptureData.reduce(
                          (sum, item) => sum + item.y,
                          0,
                        )) *
                        100,
                    )}
                    %)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Laporan Risiko</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <FileText className="h-6 w-6" />
                <span>Generate Invoice</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <BarChart3 className="h-6 w-6" />
                <span>Analytics</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Risk Category Detail Dialog */}
        <RiskCategoryDetailDialog
          isOpen={isRiskDialogOpen}
          onClose={closeRiskDialog}
          category={selectedRiskCategory}
        />
      </div>
    </div>
  );
}
