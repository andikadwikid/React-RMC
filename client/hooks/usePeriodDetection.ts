import {
  DataPeriod,
  RiskDataPeriod,
  GeographicDataPeriod,
  RiskCaptureDataPeriod,
  InvoiceStatusDataPeriod,
  AgingReceivablesDataPeriod,
  availablePerformancePeriods,
  availableRiskPeriods,
  availableGeographicPeriods,
  availableRiskCapturePeriods,
  availableInvoiceStatusPeriods,
  availableAgingReceivablesPeriods,
} from "./useDashboardData";

// Smart detection logic for performance data
export const detectBestPerformancePeriod = (): DataPeriod => {
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

// Smart detection logic for risk data
export const detectBestRiskPeriod = (): RiskDataPeriod => {
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

// Smart detection for geographic data
export const detectBestGeographicPeriod = (): GeographicDataPeriod => {
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
export const detectBestRiskCapturePeriod = (): RiskCaptureDataPeriod => {
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

// Smart detection for invoice status
export const detectBestInvoiceStatusPeriod = (): InvoiceStatusDataPeriod => {
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
export const detectBestAgingReceivablesPeriod = (): AgingReceivablesDataPeriod => {
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
