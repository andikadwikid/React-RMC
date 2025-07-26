// Dashboard hooks
export { useDashboardData } from "./useDashboardData";
export { usePeriodDetection } from "./usePeriodDetection";

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
  getRiskCaptureInsights,
  formatCurrency,
  formatCurrencyShort,
  getStatusColor,
  calculateInsights,
  getRiskCategoryInsights,
  calculateGeographicInsights,
  calculateDefaultInsights,
  getQuarterlyTrends,
  getYearlyTrends,
  getDefaultProvinceData,
  getInvoiceData,
  getAgingReceivablesData,
  hasDataForPeriod,
  getFinancialInsights,
  getInvoiceInsights,
  getAgingReceivablesInsights,
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
