import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProjectDistributionChart from "@/components/ProjectDistributionChart";
import RiskCapturePieChart from "@/components/RiskCapturePieChart";
import { RiskCategoryDetailDialog } from "@/components/dashboard/RiskCategoryDetailDialog";
import { InvoiceStatusSection } from "@/components/dashboard/InvoiceStatusSection";
import { AgingReceivablesSection } from "@/components/dashboard/AgingReceivablesSection";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { FallbackMessage } from "@/components/dashboard/FallbackMessage";
import { InsightCardsGrid } from "@/components/dashboard/InsightCards";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  PieChart,
  Shield,
  Activity,
  FileText,
  Users,
} from "lucide-react";
import * as Highcharts from "highcharts";
import {
  ProjectSummary,
  RiskCategory,
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
} from "@/hooks/useDashboardData";
import {
  detectBestPerformancePeriod,
  detectBestRiskPeriod,
  detectBestGeographicPeriod,
  detectBestRiskCapturePeriod,
  detectBestInvoiceStatusPeriod,
  detectBestAgingReceivablesPeriod,
} from "@/hooks/usePeriodDetection";
import {
  calculateProjectSummary,
  getRiskInsights,
  getGeographicInsights,
  getRiskCaptureInsights,
  formatCurrency,
  formatCurrencyShort,
  getStatusColor,
} from "@/hooks/useDashboardCalculations";

export default function Dashboard() {
  // Performance chart state
  const performanceChartRef = useRef<HTMLDivElement>(null);
  const [selectedPerformancePeriod, setSelectedPerformancePeriod] =
    useState<DataPeriod>(detectBestPerformancePeriod());
  const [performanceAutoSelected, setPerformanceAutoSelected] = useState(true);

  // Project summary state
  const [projectSummary, setProjectSummary] = useState<ProjectSummary>(
    calculateProjectSummary(detectBestPerformancePeriod()),
  );

  // Risk categories state
  const [selectedRiskPeriod, setSelectedRiskPeriod] = useState<RiskDataPeriod>(
    detectBestRiskPeriod(),
  );
  const [riskAutoSelected, setRiskAutoSelected] = useState(true);
  const [riskCategories, setRiskCategories] = useState(
    detectBestRiskPeriod().data,
  );

  // Geographic data state
  const [selectedGeographicPeriod, setSelectedGeographicPeriod] =
    useState<GeographicDataPeriod>(detectBestGeographicPeriod());
  const [geographicAutoSelected, setGeographicAutoSelected] = useState(true);
  const [provinceData, setProvinceData] = useState(
    detectBestGeographicPeriod().data,
  );

  // Risk capture data state
  const [selectedRiskCapturePeriod, setSelectedRiskCapturePeriod] =
    useState<RiskCaptureDataPeriod>(detectBestRiskCapturePeriod());
  const [riskCaptureAutoSelected, setRiskCaptureAutoSelected] = useState(true);
  const [riskCaptureData, setRiskCaptureData] = useState(
    detectBestRiskCapturePeriod().data,
  );

  // Financial data state
  const [selectedInvoiceStatusPeriod, setSelectedInvoiceStatusPeriod] =
    useState<InvoiceStatusDataPeriod>(detectBestInvoiceStatusPeriod());
  const [invoiceStatusAutoSelected, setInvoiceStatusAutoSelected] =
    useState(true);
  const [invoiceStatus, setInvoiceStatus] = useState(
    detectBestInvoiceStatusPeriod().data,
  );

  const [selectedAgingReceivablesPeriod, setSelectedAgingReceivablesPeriod] =
    useState<AgingReceivablesDataPeriod>(detectBestAgingReceivablesPeriod());
  const [agingReceivablesAutoSelected, setAgingReceivablesAutoSelected] =
    useState(true);
  const [agingReceivables, setAgingReceivables] = useState(
    detectBestAgingReceivablesPeriod().data,
  );

  // Dialog state for risk category details
  const [selectedRiskCategory, setSelectedRiskCategory] =
    useState<RiskCategory | null>(null);
  const [isRiskDialogOpen, setIsRiskDialogOpen] = useState(false);

  // Chart update function
  const updatePerformanceChart = (dataPeriod: DataPeriod) => {
    if (performanceChartRef.current) {
      (Highcharts as any).chart(performanceChartRef.current, {
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
                tooltip += `<span style="color:${point.color}">��</span> ${point.series.name}: <b>${formatCurrency(point.y as number)}</b><br/>`;
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

  // Event handlers
  const handlePerformancePeriodChange = (period: DataPeriod) => {
    setSelectedPerformancePeriod(period);
    setProjectSummary(calculateProjectSummary(period));
    setPerformanceAutoSelected(false);
  };

  const handleRiskPeriodChange = (period: RiskDataPeriod) => {
    setSelectedRiskPeriod(period);
    setRiskCategories(period.data);
    setRiskAutoSelected(false);
  };

  const handleGeographicPeriodChange = (period: GeographicDataPeriod) => {
    setSelectedGeographicPeriod(period);
    setProvinceData(period.data);
    setGeographicAutoSelected(false);
  };

  const handleRiskCapturePeriodChange = (period: RiskCaptureDataPeriod) => {
    setSelectedRiskCapturePeriod(period);
    setRiskCaptureData(period.data);
    setRiskCaptureAutoSelected(false);
  };

  const handleInvoiceStatusPeriodChange = (period: InvoiceStatusDataPeriod) => {
    setSelectedInvoiceStatusPeriod(period);
    setInvoiceStatus(period.data);
    setInvoiceStatusAutoSelected(false);
  };

  const handleAgingReceivablesPeriodChange = (
    period: AgingReceivablesDataPeriod,
  ) => {
    setSelectedAgingReceivablesPeriod(period);
    setAgingReceivables(period.data);
    setAgingReceivablesAutoSelected(false);
  };

  const handleRiskCategoryClick = (category: RiskCategory) => {
    setSelectedRiskCategory(category);
    setIsRiskDialogOpen(true);
  };

  const closeRiskDialog = () => {
    setIsRiskDialogOpen(false);
    setSelectedRiskCategory(null);
  };

  // Helper functions for fallback messages
  const shouldShowFallbackMessage = (
    autoSelected: boolean,
    period: { type: string; id: string },
  ) => {
    const currentYear = new Date().getFullYear().toString();
    return (
      autoSelected &&
      period.type === "quarterly" &&
      period.id.includes(currentYear)
    );
  };

  // Effects
  useEffect(() => {
    updatePerformanceChart(selectedPerformancePeriod);
  }, [selectedPerformancePeriod]);

  useEffect(() => {
    setProjectSummary(calculateProjectSummary(selectedPerformancePeriod));
  }, [selectedPerformancePeriod]);

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dashboard Management Risiko
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Monitor dan kelola risiko proyek secara real-time
              </p>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="sm:hidden">
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Financial Section - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <InvoiceStatusSection
            selectedPeriod={selectedInvoiceStatusPeriod}
            invoiceStatus={invoiceStatus}
            agingReceivables={agingReceivables}
            onPeriodChange={handleInvoiceStatusPeriodChange}
            autoSelected={invoiceStatusAutoSelected}
          />

          <AgingReceivablesSection
            selectedPeriod={selectedAgingReceivablesPeriod}
            agingReceivables={agingReceivables}
            invoiceStatus={invoiceStatus}
            onPeriodChange={handleAgingReceivablesPeriodChange}
            autoSelected={agingReceivablesAutoSelected}
          />
        </div>

        {/* Project Overview Cards - Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                    <p className="text-blue-100 text-sm font-medium">
                      Total Proyek
                    </p>
                    <Badge
                      variant="secondary"
                      className={`text-xs px-2 py-0.5 w-fit ${
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
                  <p className="text-2xl sm:text-3xl font-bold">{projectSummary.total}</p>
                  <p className="text-blue-200 text-xs mt-1">
                    Periode: {selectedPerformancePeriod.label}
                  </p>
                </div>
                <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-200 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                    <p className="text-green-100 text-sm font-medium">
                      Proyek Berjalan
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0.5 bg-green-200 text-green-800 w-fit"
                    >
                      {Math.round(
                        (projectSummary.running / projectSummary.total) * 100,
                      )}
                      %
                    </Badge>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold">{projectSummary.running}</p>
                  <p className="text-green-200 text-xs mt-1">
                    Dari {projectSummary.total} total proyek
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-green-200 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white relative overflow-hidden hover:shadow-lg transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                    <p className="text-purple-100 text-sm font-medium">
                      Proyek Selesai
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0.5 bg-purple-200 text-purple-800 w-fit"
                    >
                      {Math.round(
                        (projectSummary.completed / projectSummary.total) * 100,
                      )}
                      %
                    </Badge>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {projectSummary.completed}
                  </p>
                  <p className="text-purple-200 text-xs mt-1">
                    Completion rate
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-purple-200 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview Chart - Row 3 */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-5">
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      <CardTitle className="text-lg sm:text-xl">
                        Performance Overview
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                    <p className="text-sm text-gray-600">
                      {selectedPerformancePeriod.label}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`w-fit ${
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

              <PeriodSelector
                periods={availablePerformancePeriods}
                selectedPeriod={selectedPerformancePeriod}
                onPeriodChange={handlePerformancePeriodChange}
                className="mb-3"
              />
            </div>

            <FallbackMessage
              title="Menampilkan Data Triwulan"
              description={`Data tahun ${new Date().getFullYear()} belum lengkap, menampilkan data triwulan terakhir yang tersedia.`}
              show={shouldShowFallbackMessage(
                performanceAutoSelected,
                selectedPerformancePeriod,
              )}
            />

            {/* Performance Insights */}
            <InsightCardsGrid
              insights={[
                {
                  title: "Total Proyek",
                  value: selectedPerformancePeriod.data.reduce(
                    (sum, item) => sum + item.projects,
                    0,
                  ),
                  bgColor: "bg-blue-50",
                  textColor: "text-blue-800",
                },
                {
                  title: "Total Revenue",
                  value: formatCurrencyShort(
                    selectedPerformancePeriod.data.reduce(
                      (sum, item) => sum + item.revenue,
                      0,
                    ),
                  ),
                  bgColor: "bg-amber-50",
                  textColor: "text-amber-800",
                },
                {
                  title: "Total Risiko",
                  value: selectedPerformancePeriod.data.reduce(
                    (sum, item) => sum + item.risks,
                    0,
                  ),
                  bgColor: "bg-red-50",
                  textColor: "text-red-800",
                },
                {
                  title: "Avg Revenue/Proyek",
                  value: (() => {
                    const totalProjects = selectedPerformancePeriod.data.reduce(
                      (sum, item) => sum + item.projects,
                      0,
                    );
                    const totalRevenue = selectedPerformancePeriod.data.reduce(
                      (sum, item) => sum + item.revenue,
                      0,
                    );
                    return formatCurrencyShort(totalRevenue / totalProjects);
                  })(),
                  bgColor: "bg-green-50",
                  textColor: "text-green-800",
                },
              ]}
              className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3"
            />
          </CardHeader>
          <CardContent>
            <div ref={performanceChartRef} className="w-full" />
          </CardContent>
        </Card>

        {/* Risk Status by RMC Categories - Row 4 */}
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

              <PeriodSelector
                periods={availableRiskPeriods}
                selectedPeriod={selectedRiskPeriod}
                onPeriodChange={handleRiskPeriodChange}
                className="mb-3"
              />
            </div>

            <FallbackMessage
              title="Menampilkan Data Risiko Triwulan"
              description={`Data risiko tahun ${new Date().getFullYear()} belum lengkap, menampilkan data triwulan terakhir yang tersedia.`}
              show={shouldShowFallbackMessage(
                riskAutoSelected,
                selectedRiskPeriod,
              )}
            />

            {/* Risk Insights Summary */}
            <InsightCardsGrid
              insights={(() => {
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
              })()}
              className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3"
            />

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

        {/* Charts Section - Geographic Distribution and Risk Capture - Row 5 */}
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

                <PeriodSelector
                  periods={availableGeographicPeriods}
                  selectedPeriod={selectedGeographicPeriod}
                  onPeriodChange={handleGeographicPeriodChange}
                  className="mb-3"
                />
              </div>

              <FallbackMessage
                title="Menampilkan Data Geografis Triwulan"
                description={`Data distribusi proyek tahun ${new Date().getFullYear()} belum lengkap, menampilkan data triwulan terakhir.`}
                show={shouldShowFallbackMessage(
                  geographicAutoSelected,
                  selectedGeographicPeriod,
                )}
              />

              {/* Geographic Insights */}
              <InsightCardsGrid
                insights={(() => {
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
                })()}
                className="mb-4 grid grid-cols-2 gap-3"
              />
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

        {/* Risk Capture Pie Chart - Row 6 */}
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

              <PeriodSelector
                periods={availableRiskCapturePeriods}
                selectedPeriod={selectedRiskCapturePeriod}
                onPeriodChange={handleRiskCapturePeriodChange}
              />
            </div>

            <FallbackMessage
              title="Menampilkan Data Risk Capture Triwulan"
              description={`Data risk capture tahun ${new Date().getFullYear()} belum lengkap, menampilkan data triwulan terakhir.`}
              show={shouldShowFallbackMessage(
                riskCaptureAutoSelected,
                selectedRiskCapturePeriod,
              )}
            />

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

        {/* Quick Actions - Row 7 */}
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
