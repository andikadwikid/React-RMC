import { useState, useMemo, useCallback, useEffect } from "react";
import {
  DataPeriod,
  RiskDataPeriod,
  GeographicDataPeriod,
  RiskCaptureDataPeriod,
  InvoiceStatusDataPeriod,
  AgingReceivablesDataPeriod,
  RiskCategory,
  ProjectSummary,
} from "./useDashboardData";
import {
  detectBestPerformancePeriod,
  detectBestRiskPeriod,
  detectBestGeographicPeriod,
  detectBestRiskCapturePeriod,
  detectBestInvoiceStatusPeriod,
  detectBestAgingReceivablesPeriod,
} from "./usePeriodDetection";
import { calculateProjectSummary } from "./useDashboardCalculations";

export interface DashboardState {
  // Performance data
  selectedPerformancePeriod: DataPeriod;
  performanceAutoSelected: boolean;
  projectSummary: ProjectSummary;
  
  // Risk data
  selectedRiskPeriod: RiskDataPeriod;
  riskAutoSelected: boolean;
  riskCategories: RiskCategory[];
  
  // Geographic data
  selectedGeographicPeriod: GeographicDataPeriod;
  geographicAutoSelected: boolean;
  provinceData: any[];
  
  // Risk capture data
  selectedRiskCapturePeriod: RiskCaptureDataPeriod;
  riskCaptureAutoSelected: boolean;
  riskCaptureData: any[];
  
  // Financial data
  selectedInvoiceStatusPeriod: InvoiceStatusDataPeriod;
  invoiceStatusAutoSelected: boolean;
  invoiceStatus: any;
  
  selectedAgingReceivablesPeriod: AgingReceivablesDataPeriod;
  agingReceivablesAutoSelected: boolean;
  agingReceivables: any[];
  
  // Dialog state
  selectedRiskCategory: RiskCategory | null;
  isRiskDialogOpen: boolean;
  
  // Loading state
  isLoading: boolean;
}

export interface DashboardActions {
  handlePerformancePeriodChange: (period: DataPeriod) => void;
  handleRiskPeriodChange: (period: RiskDataPeriod) => void;
  handleGeographicPeriodChange: (period: GeographicDataPeriod) => void;
  handleRiskCapturePeriodChange: (period: RiskCaptureDataPeriod) => void;
  handleInvoiceStatusPeriodChange: (period: InvoiceStatusDataPeriod) => void;
  handleAgingReceivablesPeriodChange: (period: AgingReceivablesDataPeriod) => void;
  handleRiskCategoryClick: (category: RiskCategory) => void;
  closeRiskDialog: () => void;
}

export const useDashboardState = (): [DashboardState, DashboardActions] => {
  // Initialize periods using memoized values
  const initialPerformancePeriod = useMemo(() => detectBestPerformancePeriod(), []);
  const initialRiskPeriod = useMemo(() => detectBestRiskPeriod(), []);
  const initialGeographicPeriod = useMemo(() => detectBestGeographicPeriod(), []);
  const initialRiskCapturePeriod = useMemo(() => detectBestRiskCapturePeriod(), []);
  const initialInvoiceStatusPeriod = useMemo(() => detectBestInvoiceStatusPeriod(), []);
  const initialAgingReceivablesPeriod = useMemo(() => detectBestAgingReceivablesPeriod(), []);

  // Performance state
  const [selectedPerformancePeriod, setSelectedPerformancePeriod] = useState<DataPeriod>(initialPerformancePeriod);
  const [performanceAutoSelected, setPerformanceAutoSelected] = useState(true);

  // Risk state
  const [selectedRiskPeriod, setSelectedRiskPeriod] = useState<RiskDataPeriod>(initialRiskPeriod);
  const [riskAutoSelected, setRiskAutoSelected] = useState(true);

  // Geographic state
  const [selectedGeographicPeriod, setSelectedGeographicPeriod] = useState<GeographicDataPeriod>(initialGeographicPeriod);
  const [geographicAutoSelected, setGeographicAutoSelected] = useState(true);

  // Risk capture state
  const [selectedRiskCapturePeriod, setSelectedRiskCapturePeriod] = useState<RiskCaptureDataPeriod>(initialRiskCapturePeriod);
  const [riskCaptureAutoSelected, setRiskCaptureAutoSelected] = useState(true);

  // Financial state
  const [selectedInvoiceStatusPeriod, setSelectedInvoiceStatusPeriod] = useState<InvoiceStatusDataPeriod>(initialInvoiceStatusPeriod);
  const [invoiceStatusAutoSelected, setInvoiceStatusAutoSelected] = useState(true);

  const [selectedAgingReceivablesPeriod, setSelectedAgingReceivablesPeriod] = useState<AgingReceivablesDataPeriod>(initialAgingReceivablesPeriod);
  const [agingReceivablesAutoSelected, setAgingReceivablesAutoSelected] = useState(true);

  // Dialog state
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<RiskCategory | null>(null);
  const [isRiskDialogOpen, setIsRiskDialogOpen] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Memoized derived data
  const projectSummary = useMemo(
    () => calculateProjectSummary(selectedPerformancePeriod),
    [selectedPerformancePeriod]
  );

  const riskCategories = useMemo(
    () => selectedRiskPeriod.data,
    [selectedRiskPeriod]
  );

  const provinceData = useMemo(
    () => selectedGeographicPeriod.data,
    [selectedGeographicPeriod]
  );

  const riskCaptureData = useMemo(
    () => selectedRiskCapturePeriod.data,
    [selectedRiskCapturePeriod]
  );

  const invoiceStatus = useMemo(
    () => selectedInvoiceStatusPeriod.data,
    [selectedInvoiceStatusPeriod]
  );

  const agingReceivables = useMemo(
    () => selectedAgingReceivablesPeriod.data,
    [selectedAgingReceivablesPeriod]
  );

  // Memoized action handlers
  const handlePerformancePeriodChange = useCallback((period: DataPeriod) => {
    setSelectedPerformancePeriod(period);
    setPerformanceAutoSelected(false);
  }, []);

  const handleRiskPeriodChange = useCallback((period: RiskDataPeriod) => {
    setSelectedRiskPeriod(period);
    setRiskAutoSelected(false);
  }, []);

  const handleGeographicPeriodChange = useCallback((period: GeographicDataPeriod) => {
    setSelectedGeographicPeriod(period);
    setGeographicAutoSelected(false);
  }, []);

  const handleRiskCapturePeriodChange = useCallback((period: RiskCaptureDataPeriod) => {
    setSelectedRiskCapturePeriod(period);
    setRiskCaptureAutoSelected(false);
  }, []);

  const handleInvoiceStatusPeriodChange = useCallback((period: InvoiceStatusDataPeriod) => {
    setSelectedInvoiceStatusPeriod(period);
    setInvoiceStatusAutoSelected(false);
  }, []);

  const handleAgingReceivablesPeriodChange = useCallback((period: AgingReceivablesDataPeriod) => {
    setSelectedAgingReceivablesPeriod(period);
    setAgingReceivablesAutoSelected(false);
  }, []);

  const handleRiskCategoryClick = useCallback((category: RiskCategory) => {
    setSelectedRiskCategory(category);
    setIsRiskDialogOpen(true);
  }, []);

  const closeRiskDialog = useCallback(() => {
    setIsRiskDialogOpen(false);
    setSelectedRiskCategory(null);
  }, []);

  // Initialize loading state with useEffect
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const state: DashboardState = {
    selectedPerformancePeriod,
    performanceAutoSelected,
    projectSummary,
    selectedRiskPeriod,
    riskAutoSelected,
    riskCategories,
    selectedGeographicPeriod,
    geographicAutoSelected,
    provinceData,
    selectedRiskCapturePeriod,
    riskCaptureAutoSelected,
    riskCaptureData,
    selectedInvoiceStatusPeriod,
    invoiceStatusAutoSelected,
    invoiceStatus,
    selectedAgingReceivablesPeriod,
    agingReceivablesAutoSelected,
    agingReceivables,
    selectedRiskCategory,
    isRiskDialogOpen,
    isLoading,
  };

  const actions: DashboardActions = {
    handlePerformancePeriodChange,
    handleRiskPeriodChange,
    handleGeographicPeriodChange,
    handleRiskCapturePeriodChange,
    handleInvoiceStatusPeriodChange,
    handleAgingReceivablesPeriodChange,
    handleRiskCategoryClick,
    closeRiskDialog,
  };

  return [state, actions];
};
