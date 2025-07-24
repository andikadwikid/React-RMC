// Data loader utility for dashboard JSON files
import performanceData from '../data/performance.json';
import riskCategoriesData from '../data/risk-categories.json';
import geographicData from '../data/geographic.json';
import riskCaptureData from '../data/risk-capture.json';
import invoiceStatusData from '../data/invoice-status.json';
import agingReceivablesData from '../data/aging-receivables.json';
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

// Icon mapping for risk categories
const iconMap = {
  Target,
  Building,
  DollarSign,
  Gavel,
  FileText,
  Leaf,
  Cpu,
  Users,
};

export const loadPerformanceData = () => {
  return performanceData;
};

export const loadRiskCategoriesData = () => {
  // Add icon components to the data
  const processedData = {
    yearly: {},
    quarterly: {}
  };
  
  Object.keys(riskCategoriesData.yearly).forEach(year => {
    processedData.yearly[year] = riskCategoriesData.yearly[year].map(category => ({
      ...category,
      icon: iconMap[category.icon as keyof typeof iconMap]
    }));
  });
  
  Object.keys(riskCategoriesData.quarterly).forEach(quarter => {
    processedData.quarterly[quarter] = riskCategoriesData.quarterly[quarter].map(category => ({
      ...category,
      icon: iconMap[category.icon as keyof typeof iconMap]
    }));
  });
  
  return processedData;
};

export const loadGeographicData = () => {
  return geographicData;
};

export const loadRiskCaptureData = () => {
  return riskCaptureData;
};

export const loadInvoiceStatusData = () => {
  return invoiceStatusData;
};

export const loadAgingReceivablesData = () => {
  return agingReceivablesData;
};
