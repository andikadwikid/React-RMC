import { useMemo } from "react";
import {
  getRiskInsights,
  getGeographicInsights,
  getRiskCaptureInsights,
  getFinancialInsights,
  formatCurrencyShort,
} from "./useDashboardCalculations";

// Helper for fallback message logic
export const useFallbackMessage = (
  autoSelected: boolean,
  period: { type: string; id: string },
) => {
  return useMemo(() => {
    const currentYear = new Date().getFullYear().toString();
    return (
      autoSelected &&
      period.type === "quarterly" &&
      period.id.includes(currentYear)
    );
  }, [autoSelected, period.type, period.id]);
};

// Memoized performance insights
export const usePerformanceInsights = (selectedPeriod: any) => {
  return useMemo(
    () => [
      {
        title: "Total Proyek",
        value: selectedPeriod.data.reduce(
          (sum: number, item: any) => sum + item.projects,
          0,
        ),
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
      },
      {
        title: "Total Revenue",
        value: formatCurrencyShort(
          selectedPeriod.data.reduce(
            (sum: number, item: any) => sum + item.revenue,
            0,
          ),
        ),
        bgColor: "bg-amber-50",
        textColor: "text-amber-800",
      },
      {
        title: "Total Risiko",
        value: selectedPeriod.data.reduce(
          (sum: number, item: any) => sum + item.risks,
          0,
        ),
        bgColor: "bg-red-50",
        textColor: "text-red-800",
      },
      {
        title: "Avg Revenue/Proyek",
        value: (() => {
          const totalProjects = selectedPeriod.data.reduce(
            (sum: number, item: any) => sum + item.projects,
            0,
          );
          const totalRevenue = selectedPeriod.data.reduce(
            (sum: number, item: any) => sum + item.revenue,
            0,
          );
          return formatCurrencyShort(totalRevenue / totalProjects);
        })(),
        bgColor: "bg-green-50",
        textColor: "text-green-800",
      },
    ],
    [selectedPeriod],
  );
};

// Memoized risk insights
export const useRiskInsights = (riskCategories: any[]) => {
  return useMemo(() => {
    const insights = getRiskInsights(riskCategories);
    return [
      {
        title: "Total Risiko",
        value: insights.totalRisks,
        bgColor: "bg-gray-50",
        textColor: "text-gray-800",
      },
      {
        title: "Overdue",
        value: `${insights.totalOverdue} (${insights.overduePercentage}%)`,
        bgColor: "bg-red-50",
        textColor: "text-red-800",
      },
      {
        title: "In Process",
        value: insights.totalInProcess,
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-800",
      },
      {
        title: "Closed",
        value: `${insights.totalClosed} (${insights.closedPercentage}%)`,
        bgColor: "bg-green-50",
        textColor: "text-green-800",
      },
    ];
  }, [riskCategories]);
};

// Memoized geographic insights
export const useGeographicInsights = (provinceData: any[]) => {
  return useMemo(() => {
    const insights = getGeographicInsights(provinceData);
    return [
      {
        title: "Total Proyek",
        value: insights.totalProjects,
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
      },
      {
        title: "Total Revenue",
        value: formatCurrencyShort(insights.totalRevenue),
        bgColor: "bg-green-50",
        textColor: "text-green-800",
      },
    ];
  }, [provinceData]);
};

// Memoized financial insights
export const useFinancialInsights = (
  invoiceStatus: any,
  agingReceivables: any[],
) => {
  return useMemo(() => {
    const insights = getFinancialInsights(invoiceStatus, agingReceivables);

    const invoiceInsights = [
      {
        title: "Total Invoice",
        value: insights.totalInvoices,
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
      },
      {
        title: "Paid Rate",
        value: `${insights.paidPercentage}%`,
        bgColor: "bg-green-50",
        textColor: "text-green-800",
      },
      {
        title: "Overdue",
        value: `${insights.overduePercentage}%`,
        bgColor: "bg-red-50",
        textColor: "text-red-800",
      },
    ];

    const agingInsights = [
      {
        title: "Total Outstanding",
        value: formatCurrencyShort(insights.totalOutstanding),
        bgColor: "bg-gray-50",
        textColor: "text-gray-800",
      },
      {
        title: "31-90 Hari",
        value: formatCurrencyShort(
          agingReceivables.find((item: any) => item.days === "31-90")?.amount ||
            0,
        ),
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-800",
      },
      {
        title: ">90 Hari",
        value: formatCurrencyShort(insights.overdueAmount),
        bgColor: "bg-red-50",
        textColor: "text-red-800",
      },
    ];

    return { invoiceInsights, agingInsights };
  }, [invoiceStatus, agingReceivables]);
};

// Memoized risk capture insights data
export const useRiskCaptureInsightsData = (riskCaptureData: any[]) => {
  return useMemo(() => {
    const insights = getRiskCaptureInsights(riskCaptureData);
    return {
      highRiskItems: insights.highRiskItems,
      highRiskPercentage: insights.highRiskPercentage,
      lowRiskItems: insights.lowRiskItems,
      lowRiskPercentage: insights.lowRiskPercentage,
      totalItems: insights.totalItems,
    };
  }, [riskCaptureData]);
};
