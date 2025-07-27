import React, { ReactNode } from "react";
import { PeriodType } from "./base";

// =============================================================================
// DASHBOARD & ANALYTICS TYPES
// =============================================================================

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

// =============================================================================
// CHART COMPONENT PROPS
// =============================================================================

export interface IndonesiaMapChartProps {
  data: RegionData[];
}

export interface ProjectDistributionChartProps {
  data: ProvinceData[];
}
