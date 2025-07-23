import { 
  ProjectSummary, 
  DataPeriod, 
  RiskCategory, 
  InvoiceStatus, 
  AgingReceivable, 
  ProvinceData 
} from "./useDashboardData";

// Calculate project summary based on performance period
export const calculateProjectSummary = (
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

// Calculate risk insights
export const getRiskInsights = (categories: RiskCategory[]) => {
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

// Calculate financial insights
export const getFinancialInsights = (
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

// Calculate geographic insights
export const getGeographicInsights = (data: ProvinceData[]) => {
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
export const getRiskCaptureInsights = (
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

// Utility functions for formatting
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyShort = (amount: number) => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  return formatCurrency(amount);
};

// Color utility functions
export const getStatusColor = (status: "overdue" | "inProcess" | "closed") => {
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

export const getAgingColor = (color: "green" | "yellow" | "red") => {
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
