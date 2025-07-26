import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  PieChart,
  Shield,
  Activity,
} from "lucide-react";

// Lazy imports for better code splitting
import { lazy, Suspense } from "react";
const ProjectDistributionChart = lazy(
  () => import("@/components/ProjectDistributionChart"),
);
const RiskCapturePieChart = lazy(
  () => import("@/components/RiskCapturePieChart"),
);
const IndonesiaMap = lazy(() => import("@/components/IndonesiaMapChart"));

// Optimized imports
import { RiskCategoryDetailDialog } from "@/components/dashboard/RiskCategoryDetailDialog";
import { InvoiceStatusSection } from "@/components/dashboard/InvoiceStatusSection";
import { AgingReceivablesSection } from "@/components/dashboard/AgingReceivablesSection";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { FallbackMessage } from "@/components/dashboard/FallbackMessage";
import { InsightCardsGrid } from "@/components/dashboard/InsightCards";
import { DashboardLoadingSpinner } from "@/components/common/DashboardLoadingSpinner";

// Custom hooks
import { useDashboardState } from "@/hooks/dashboard/useDashboardState";
import { usePerformanceChart } from "@/hooks/dashboard/usePerformanceChart";
import {
  useFallbackMessage,
  usePerformanceInsights,
  useRiskInsights,
  useGeographicInsights,
  useFinancialInsights,
  useRiskCaptureInsightsData,
} from "@/hooks/dashboard/useDashboardHelpers";

// Data imports
import {
  availablePerformancePeriods,
  availableRiskPeriods,
  availableGeographicPeriods,
  availableRiskCapturePeriods,
} from "@/hooks/dashboard";
import { formatCurrency, getStatusColor } from "@/hooks/dashboard";

// Memoized header component
const DashboardHeader = memo(() => (
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
          <Badge
            variant="outline"
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
          >
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
));

DashboardHeader.displayName = "DashboardHeader";

// Memoized project overview cards
const ProjectOverviewCards = memo(
  ({
    projectSummary,
    selectedPerformancePeriod,
  }: {
    projectSummary: any;
    selectedPerformancePeriod: any;
  }) => (
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
              <p className="text-2xl sm:text-3xl font-bold">
                {projectSummary.total}
              </p>
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
              <p className="text-2xl sm:text-3xl font-bold">
                {projectSummary.running}
              </p>
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
              <p className="text-purple-200 text-xs mt-1">Completion rate</p>
            </div>
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-purple-200 flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </div>
  ),
);

ProjectOverviewCards.displayName = "ProjectOverviewCards";

// Memoized performance chart section
const PerformanceChartSection = memo(
  ({
    selectedPerformancePeriod,
    performanceAutoSelected,
    handlePerformancePeriodChange,
    performanceInsights,
    isLoading,
  }: {
    selectedPerformancePeriod: any;
    performanceAutoSelected: boolean;
    handlePerformancePeriodChange: any;
    performanceInsights: any[];
    isLoading: boolean;
  }) => {
    const chartRef = usePerformanceChart(selectedPerformancePeriod, isLoading);
    const showFallback = useFallbackMessage(
      performanceAutoSelected,
      selectedPerformancePeriod,
    );

    return (
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
            show={showFallback}
          />

          <InsightCardsGrid
            insights={performanceInsights}
            className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <DashboardLoadingSpinner />
          ) : (
            <div ref={chartRef} className="w-full" />
          )}
        </CardContent>
      </Card>
    );
  },
);

PerformanceChartSection.displayName = "PerformanceChartSection";

// Main optimized dashboard component
const DashboardOptimized = () => {
  const [state, actions] = useDashboardState();

  // Memoized insights
  const performanceInsights = usePerformanceInsights(
    state.selectedPerformancePeriod,
  );
  const riskInsights = useRiskInsights(state.riskCategories);
  const geographicInsights = useGeographicInsights(state.provinceData);
  const { invoiceInsights, agingInsights } = useFinancialInsights(
    state.invoiceStatus,
    state.agingReceivables,
  );
  const riskCaptureInsights = useRiskCaptureInsightsData(state.riskCaptureData);

  // Memoized fallback messages
  const riskFallback = useFallbackMessage(
    state.riskAutoSelected,
    state.selectedRiskPeriod,
  );
  const geographicFallback = useFallbackMessage(
    state.geographicAutoSelected,
    state.selectedGeographicPeriod,
  );
  const riskCaptureFallback = useFallbackMessage(
    state.riskCaptureAutoSelected,
    state.selectedRiskCapturePeriod,
  );

  return (
    <div className="bg-gray-50">
      <DashboardHeader />

      <div className="p-4 sm:p-6">
        {/* Financial Section - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 sm:mb-8">
          <InvoiceStatusSection
            selectedPeriod={state.selectedInvoiceStatusPeriod}
            invoiceStatus={state.invoiceStatus}
            agingReceivables={state.agingReceivables}
            onPeriodChange={actions.handleInvoiceStatusPeriodChange}
            autoSelected={state.invoiceStatusAutoSelected}
          />

          <AgingReceivablesSection
            selectedPeriod={state.selectedAgingReceivablesPeriod}
            agingReceivables={state.agingReceivables}
            invoiceStatus={state.invoiceStatus}
            onPeriodChange={actions.handleAgingReceivablesPeriodChange}
            autoSelected={state.agingReceivablesAutoSelected}
          />
        </div>

        {/* Project Overview Cards - Row 2 */}
        <ProjectOverviewCards
          projectSummary={state.projectSummary}
          selectedPerformancePeriod={state.selectedPerformancePeriod}
        />

        {/* Performance Overview Chart - Row 3 */}
        <PerformanceChartSection
          selectedPerformancePeriod={state.selectedPerformancePeriod}
          performanceAutoSelected={state.performanceAutoSelected}
          handlePerformancePeriodChange={actions.handlePerformancePeriodChange}
          performanceInsights={performanceInsights}
          isLoading={state.isLoading}
        />

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
                      {state.selectedRiskPeriod.label}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${
                        state.selectedRiskPeriod.type === "yearly"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {state.selectedRiskPeriod.type === "yearly" ? (
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
                selectedPeriod={state.selectedRiskPeriod}
                onPeriodChange={actions.handleRiskPeriodChange}
                className="mb-3"
              />
            </div>

            <FallbackMessage
              title="Menampilkan Data Risiko Triwulan"
              description={`Data risiko tahun ${new Date().getFullYear()} belum lengkap, menampilkan data triwulan terakhir yang tersedia.`}
              show={riskFallback}
            />

            <InsightCardsGrid
              insights={riskInsights}
              className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {state.riskCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50"
                    onClick={() => actions.handleRiskCategoryClick(category)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <IconComponent className="h-5 w-5 text-gray-600 flex-shrink-0" />
                      <h3 className="font-medium text-sm leading-tight">
                        {category.name}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold text-gray-900">
                          {category.total}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor("overdue")}`}
                            ></div>
                            <span className="text-xs text-gray-600">
                              Overdue
                            </span>
                          </div>
                          <span className="text-xs font-medium text-red-600">
                            {category.overdue}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor("inProcess")}`}
                            ></div>
                            <span className="text-xs text-gray-600">
                              In Process
                            </span>
                          </div>
                          <span className="text-xs font-medium text-yellow-600">
                            {category.inProcess}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor("closed")}`}
                            ></div>
                            <span className="text-xs text-gray-600">
                              Closed
                            </span>
                          </div>
                          <span className="text-xs font-medium text-green-600">
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

        {/* Geographic Distribution - Row 5 */}
        <Card className="my-10">
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
                      {state.selectedGeographicPeriod.label}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${
                        state.selectedGeographicPeriod.type === "yearly"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {state.selectedGeographicPeriod.type === "yearly" ? (
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
                selectedPeriod={state.selectedGeographicPeriod}
                onPeriodChange={actions.handleGeographicPeriodChange}
                className="mb-3"
              />
            </div>

            <FallbackMessage
              title="Menampilkan Data Geografis Triwulan"
              description={`Data distribusi proyek tahun ${new Date().getFullYear()} belum lengkap, menampilkan data triwulan terakhir.`}
              show={geographicFallback}
            />

            <InsightCardsGrid
              insights={geographicInsights}
              className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
            />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<DashboardLoadingSpinner />}>
              <IndonesiaMap data={state.provinceData} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Geographic Summary and Risk Capture - Row 6 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 sm:mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Ringkasan Geografis</CardTitle>
                <Badge
                  variant="outline"
                  className={`${
                    state.selectedGeographicPeriod.type === "yearly"
                      ? "text-blue-600 border-blue-200"
                      : "text-orange-600 border-orange-200"
                  }`}
                >
                  {state.selectedGeographicPeriod.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {state.provinceData
                  .sort((a: any, b: any) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((province: any, index: number) => (
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
                    <span className="font-semibold">
                      {state.provinceData.length}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Total Pendapatan:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(
                        state.provinceData.reduce(
                          (sum: number, p: any) => sum + p.revenue,
                          0,
                        ),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rata-rata per Provinsi:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(
                        Math.round(
                          state.provinceData.reduce(
                            (sum: number, p: any) => sum + p.revenue,
                            0,
                          ) / state.provinceData.length,
                        ),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Capture Pie Chart - Row 7 */}
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
                      {state.selectedRiskCapturePeriod.label} - Distribusi level
                      risiko berdasarkan severity assessment
                    </p>
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${
                        state.selectedRiskCapturePeriod.type === "yearly"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {state.selectedRiskCapturePeriod.type === "yearly" ? (
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
                selectedPeriod={state.selectedRiskCapturePeriod}
                onPeriodChange={actions.handleRiskCapturePeriodChange}
              />
            </div>

            <FallbackMessage
              title="Menampilkan Data Risk Capture Triwulan"
              description={`Data risk capture tahun ${new Date().getFullYear()} belum lengkap, menampilkan data triwulan terakhir.`}
              show={riskCaptureFallback}
            />

            <div className="mb-4 flex flex-col md:flex-row gap-3">
              <div className="flex justify-between gap-5 mt-5">
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-red-800">
                    High Risk
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    {riskCaptureInsights.highRiskItems} (
                    {riskCaptureInsights.highRiskPercentage}%)
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-green-800">
                    Low Risk
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {riskCaptureInsights.lowRiskItems} (
                    {riskCaptureInsights.lowRiskPercentage}%)
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<DashboardLoadingSpinner />}>
              <RiskCapturePieChart data={state.riskCaptureData} title="" />
            </Suspense>
            <div className="mt-4 space-y-2">
              <div className="text-sm text-gray-600">
                <div className="flex gap-5 mb-1">
                  <span>Total Risk Items:</span>
                  <span className="font-semibold">
                    {riskCaptureInsights.totalItems}
                  </span>
                </div>
                <div className="flex gap-5">
                  <span>High Risk Items:</span>
                  <span className="font-semibold text-red-600">
                    {riskCaptureInsights.highRiskItems} (
                    {riskCaptureInsights.highRiskPercentage}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Category Detail Dialog */}
        <RiskCategoryDetailDialog
          isOpen={state.isRiskDialogOpen}
          onClose={actions.closeRiskDialog}
          category={state.selectedRiskCategory}
        />
      </div>
    </div>
  );
};

export default memo(DashboardOptimized);
