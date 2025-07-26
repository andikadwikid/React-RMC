// Dashboard hooks (individual functions are exported below)

// Re-export all types and functions from useDashboardData
export type {
  ProjectSummary,
  RiskCategory,
  DataPeriod,
  RiskDataPeriod,
  GeographicDataPeriod,
  RiskCaptureDataPeriod,
  InvoiceStatusDataPeriod,
  AgingReceivablesDataPeriod,
  InvoiceStatus,
  AgingReceivable,
  ProvinceData,
} from "./useDashboardData";

export {
  availablePerformancePeriods,
  availableRiskPeriods,
  availableGeographicPeriods,
  availableRiskCapturePeriods,
  availableInvoiceStatusPeriods,
  availableAgingReceivablesPeriods,
} from "./useDashboardData";

// Re-export all functions from useDashboardCalculations
export {
  calculateProjectSummary,
  getRiskInsights,
  getGeographicInsights,
  getRiskCaptureInsights,
  formatCurrency,
  formatCurrencyShort,
  getStatusColor,
  getFinancialInsights,
  getAgingColor,
} from "./useDashboardCalculations";

// Re-export all functions from usePeriodDetection
export {
  detectBestPerformancePeriod,
  detectBestRiskPeriod,
  detectBestGeographicPeriod,
  detectBestRiskCapturePeriod,
  detectBestInvoiceStatusPeriod,
  detectBestAgingReceivablesPeriod,
} from "./usePeriodDetection";
