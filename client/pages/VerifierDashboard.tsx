import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/common/PageHeader";
import {
  UserCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  MessageSquare,
  BarChart3,
  Target,
  Calendar,
  ChevronDown,
  Info,
  TrendingUp,
  Shield,
} from "lucide-react";
import { formatDateTime } from "@/utils/formatters";
import { loadSubmissionTracking } from "@/utils/dataLoader";
import * as Highcharts from "highcharts";

// Calculate dynamic statistics from actual data
const getVerificationStats = () => {
  const submissionData = loadSubmissionTracking();

  // Risk Capture Statistics
  const riskCaptureSubmissions = submissionData.risk_capture_submissions || [];
  const readinessSubmissions = submissionData.readiness_submissions || [];

  const riskCaptureStats = {
    total: riskCaptureSubmissions.length,
    verified: riskCaptureSubmissions.filter((s) => s.status === "verified")
      .length,
    underReview: riskCaptureSubmissions.filter(
      (s) => s.status === "under_review",
    ).length,
    pending: riskCaptureSubmissions.filter((s) => s.status === "submitted")
      .length,
    needsRevision: riskCaptureSubmissions.filter(
      (s) => s.status === "needs_revision",
    ).length,
    totalRisks: riskCaptureSubmissions.reduce(
      (sum, s) => sum + (s.totalRisks || 0),
      0,
    ),
  };

  // Readiness Statistics
  const readinessStats = {
    total: readinessSubmissions.length,
    verified: readinessSubmissions.filter((s) => s.status === "verified")
      .length,
    underReview: readinessSubmissions.filter((s) => s.status === "under_review")
      .length,
    pending: readinessSubmissions.filter((s) => s.status === "submitted")
      .length,
    needsRevision: readinessSubmissions.filter(
      (s) => s.status === "needs_revision",
    ).length,
    totalItems: readinessSubmissions.reduce(
      (sum, s) => sum + (s.totalItems || 0),
      0,
    ),
  };

  return {
    riskCapture: riskCaptureStats,
    readiness: readinessStats,
    overall: {
      totalVerified: riskCaptureStats.verified + readinessStats.verified,
      totalPending: riskCaptureStats.pending + readinessStats.pending,
      totalUnderReview:
        riskCaptureStats.underReview + readinessStats.underReview,
    },
  };
};

const verificationStats = getVerificationStats();

const recentActivities = [
  {
    id: "1",
    projectName: "Sistem ERP PT. ABC Manufacturing",
    action: "Verified",
    timestamp: "2024-01-15T14:30:00Z",
    status: "verified",
    items: 14,
    notes: "Semua dokumen telah memenuhi standar",
  },
  {
    id: "2",
    projectName: "Portal E-Commerce Fashion",
    action: "Needs Revision",
    timestamp: "2024-01-15T11:20:00Z",
    status: "needs_revision",
    items: 12,
    notes: "Beberapa dokumen legal perlu dilengkapi",
  },
  {
    id: "3",
    projectName: "Dashboard Analytics Marketing",
    action: "Under Review",
    timestamp: "2024-01-15T09:15:00Z",
    status: "under_review",
    items: 16,
    notes: "Sedang mereview dokumen teknis",
  },
  {
    id: "4",
    projectName: "Aplikasi Mobile Banking",
    action: "Verified",
    timestamp: "2024-01-14T16:45:00Z",
    status: "verified",
    items: 11,
    notes: "Dokumen lengkap dan sesuai requirement",
  },
];

const pendingAssignments = [
  {
    id: "1",
    projectName: "Sistem Inventory Management",
    submittedBy: "John Doe",
    submittedAt: "2024-01-15T10:30:00Z",
    priority: "high",
    category: "Administrative",
    estimatedTime: "3 jam",
  },
  {
    id: "2",
    projectName: "Platform Learning Management",
    submittedBy: "Jane Smith",
    submittedAt: "2024-01-15T08:15:00Z",
    priority: "medium",
    category: "Technical",
    estimatedTime: "2 jam",
  },
  {
    id: "3",
    projectName: "CRM Customer Service",
    submittedBy: "Bob Wilson",
    submittedAt: "2024-01-14T15:20:00Z",
    priority: "low",
    category: "Legal & Financial",
    estimatedTime: "1.5 jam",
  },
];

// Mock data for different periods
const yearlyStats2024 = [
  { period: "Jan 2024", verified: 23, revised: 5 },
  { period: "Feb 2024", verified: 28, revised: 3 },
  { period: "Mar 2024", verified: 31, revised: 7 },
  { period: "Apr 2024", verified: 25, revised: 4 },
  { period: "May 2024", verified: 29, revised: 6 },
  { period: "Jun 2024", verified: 33, revised: 2 },
  { period: "Jul 2024", verified: 27, revised: 4 },
  { period: "Aug 2024", verified: 35, revised: 3 },
  { period: "Sep 2024", verified: 30, revised: 6 },
  { period: "Oct 2024", verified: 32, revised: 5 },
  { period: "Nov 2024", verified: 28, revised: 2 },
  { period: "Dec 2024", verified: 26, revised: 4 },
];

const yearlyStats2023 = [
  { period: "Jan 2023", verified: 18, revised: 7 },
  { period: "Feb 2023", verified: 22, revised: 4 },
  { period: "Mar 2023", verified: 25, revised: 8 },
  { period: "Apr 2023", verified: 20, revised: 5 },
  { period: "May 2023", verified: 24, revised: 6 },
  { period: "Jun 2023", verified: 28, revised: 3 },
  { period: "Jul 2023", verified: 23, revised: 5 },
  { period: "Aug 2023", verified: 30, revised: 4 },
  { period: "Sep 2023", verified: 27, revised: 7 },
  { period: "Oct 2023", verified: 29, revised: 6 },
  { period: "Nov 2023", verified: 25, revised: 3 },
  { period: "Dec 2023", verified: 22, revised: 5 },
];

// Q4 2024 data (fallback when current year is incomplete)
const quarterlyStatsQ4_2024 = [
  { period: "Oct 2024", verified: 32, revised: 5 },
  { period: "Nov 2024", verified: 28, revised: 2 },
  { period: "Dec 2024", verified: 26, revised: 4 },
];

// Q3 2024 data (another fallback example)
const quarterlyStatsQ3_2024 = [
  { period: "Jul 2024", verified: 27, revised: 4 },
  { period: "Aug 2024", verified: 35, revised: 3 },
  { period: "Sep 2024", verified: 30, revised: 6 },
];

import type { PeriodType, DataPeriod } from "@/types";

const availableDataPeriods: DataPeriod[] = [
  {
    id: "2024",
    label: "2024 (Tahunan)",
    type: "yearly",
    data: yearlyStats2024,
    isComplete: true, // Set to false to simulate incomplete year
  },
  {
    id: "2023",
    label: "2023 (Tahunan)",
    type: "yearly",
    data: yearlyStats2023,
    isComplete: true,
  },
  {
    id: "q4-2024",
    label: "Q4 2024 (Triwulan)",
    type: "quarterly",
    data: quarterlyStatsQ4_2024,
    isComplete: true,
  },
  {
    id: "q3-2024",
    label: "Q3 2024 (Triwulan)",
    type: "quarterly",
    data: quarterlyStatsQ3_2024,
    isComplete: true,
  },
];

// Smart detection logic
const detectBestDataPeriod = (): DataPeriod => {
  const currentYear = new Date().getFullYear().toString();

  // First, try to find complete yearly data for current year
  const currentYearData = availableDataPeriods.find(
    (period) =>
      period.id === currentYear &&
      period.type === "yearly" &&
      period.isComplete,
  );

  if (currentYearData) {
    return currentYearData;
  }

  // If current year is incomplete, find the latest quarterly data
  const quarterlyData = availableDataPeriods
    .filter(
      (period) =>
        period.type === "quarterly" && period.id.includes(currentYear),
    )
    .sort((a, b) => b.id.localeCompare(a.id))[0]; // Get latest quarter

  if (quarterlyData) {
    return quarterlyData;
  }

  // Fallback to previous year if available
  const previousYear = (parseInt(currentYear) - 1).toString();
  const previousYearData = availableDataPeriods.find(
    (period) => period.id === previousYear && period.type === "yearly",
  );

  if (previousYearData) {
    return previousYearData;
  }

  // Ultimate fallback - return first available data
  return availableDataPeriods[0];
};

const getStatusBadge = (status: string) => {
  const config = {
    verified: {
      label: "Terverifikasi",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    needs_revision: {
      label: "Perlu Revisi",
      color: "bg-red-100 text-red-800",
      icon: AlertTriangle,
    },
    under_review: {
      label: "Sedang Review",
      color: "bg-blue-100 text-blue-800",
      icon: Clock,
    },
  };

  const statusConfig = config[status as keyof typeof config];
  if (!statusConfig) return null;

  const IconComponent = statusConfig.icon;
  return (
    <Badge className={statusConfig.color}>
      <IconComponent className="w-3 h-3 mr-1" />
      {statusConfig.label}
    </Badge>
  );
};

const getPriorityBadge = (priority: string) => {
  const config = {
    high: { label: "Tinggi", color: "bg-red-100 text-red-800" },
    medium: { label: "Sedang", color: "bg-yellow-100 text-yellow-800" },
    low: { label: "Rendah", color: "bg-green-100 text-green-800" },
  };

  const priorityConfig = config[priority as keyof typeof config];
  return <Badge className={priorityConfig.color}>{priorityConfig.label}</Badge>;
};

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function VerifierDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "activities" | "pending"
  >("overview");
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<DataPeriod>(
    detectBestDataPeriod(),
  );
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [autoSelected, setAutoSelected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const updateChart = (dataPeriod: DataPeriod) => {
    if (chartRef.current) {
      Highcharts.chart(chartRef.current, {
        chart: {
          type: "column",
          height: window.innerWidth < 768 ? 250 : 300,
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
        yAxis: {
          min: 0,
          title: {
            text: "Jumlah Verifikasi",
          },
        },
        tooltip: {
          headerFormat:
            '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat:
            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
          footerFormat: "</table>",
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
        },
        series: [
          {
            name: "Verified",
            data: dataPeriod.data.map((stat) => stat.verified),
            color: "#10b981",
          },
          {
            name: "Revised",
            data: dataPeriod.data.map((stat) => stat.revised),
            color: "#ef4444",
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

  useEffect(() => {
    // Initialize chart after loading is complete
    if (!isLoading) {
      updateChart(selectedPeriod);
    }
  }, [selectedPeriod, isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handlePeriodChange = (period: DataPeriod) => {
    setSelectedPeriod(period);
    setAutoSelected(false);
    setShowPeriodDropdown(false);
  };

  const shouldShowFallbackMessage = () => {
    const currentYear = new Date().getFullYear().toString();
    return (
      autoSelected &&
      selectedPeriod.type === "quarterly" &&
      selectedPeriod.id.includes(currentYear)
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Verifikator"
        description="Panel kontrol untuk verifikasi Risk Capture dan Project Readiness"
        icon="UserCheck"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow duration-200 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Total Terverifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {verificationStats.overall.totalVerified}
            </div>
            <p className="text-xs text-green-600 mt-1">Risk Capture + Readiness</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Sedang Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {verificationStats.overall.totalUnderReview}
            </div>
            <p className="text-xs text-blue-600 mt-1">Under review</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {verificationStats.overall.totalPending}
            </div>
            <p className="text-xs text-yellow-600 mt-1">Menunggu review</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {(() => {
                const total =
                  verificationStats.riskCapture.total +
                  verificationStats.readiness.total;
                const verified = verificationStats.overall.totalVerified;
                return total > 0 ? Math.round((verified / total) * 100) : 0;
              })()}
              %
            </div>
            <p className="text-xs text-purple-600 mt-1">Tingkat keberhasilan</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Capture & Readiness Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Capture Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Risk Capture Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-xl lg:text-2xl font-bold text-gray-800">
                  {verificationStats.riskCapture.total}
                </div>
                <div className="text-sm text-gray-600">Total Submissions</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <div className="text-xl lg:text-2xl font-bold text-red-600">
                  {verificationStats.riskCapture.totalRisks}
                </div>
                <div className="text-sm text-gray-600">Total Risks</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Terverifikasi</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-green-600">
                    {verificationStats.riskCapture.verified}
                  </span>
                  <div className="w-20 lg:w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${verificationStats.riskCapture.total > 0 ? (verificationStats.riskCapture.verified / verificationStats.riskCapture.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Under Review</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-600">
                    {verificationStats.riskCapture.underReview}
                  </span>
                  <div className="w-20 lg:w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${verificationStats.riskCapture.total > 0 ? (verificationStats.riskCapture.underReview / verificationStats.riskCapture.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Needs Revision</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-red-600">
                    {verificationStats.riskCapture.needsRevision}
                  </span>
                  <div className="w-20 lg:w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${verificationStats.riskCapture.total > 0 ? (verificationStats.riskCapture.needsRevision / verificationStats.riskCapture.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Pending</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-yellow-600">
                    {verificationStats.riskCapture.pending}
                  </span>
                  <div className="w-20 lg:w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-yellow-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${verificationStats.riskCapture.total > 0 ? (verificationStats.riskCapture.pending / verificationStats.riskCapture.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Readiness Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Project Readiness Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-xl lg:text-2xl font-bold text-gray-800">
                  {verificationStats.readiness.total}
                </div>
                <div className="text-sm text-gray-600">Total Submissions</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="text-xl lg:text-2xl font-bold text-green-600">
                  {verificationStats.readiness.totalItems}
                </div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Terverifikasi</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-green-600">
                    {verificationStats.readiness.verified}
                  </span>
                  <div className="w-20 lg:w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${verificationStats.readiness.total > 0 ? (verificationStats.readiness.verified / verificationStats.readiness.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Under Review</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-600">
                    {verificationStats.readiness.underReview}
                  </span>
                  <div className="w-20 lg:w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${verificationStats.readiness.total > 0 ? (verificationStats.readiness.underReview / verificationStats.readiness.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Needs Revision</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-red-600">
                    {verificationStats.readiness.needsRevision}
                  </span>
                  <div className="w-20 lg:w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${verificationStats.readiness.total > 0 ? (verificationStats.readiness.needsRevision / verificationStats.readiness.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Pending</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-yellow-600">
                    {verificationStats.readiness.pending}
                  </span>
                  <div className="w-20 lg:w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-yellow-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${verificationStats.readiness.total > 0 ? (verificationStats.readiness.pending / verificationStats.readiness.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  Performance Data
                  <Badge
                    variant="secondary"
                    className={`ml-2 ${
                      selectedPeriod.type === "yearly"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {selectedPeriod.type === "yearly" ? (
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
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedPeriod.label}
                </p>
              </div>
            </div>

            {/* Period Selector */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Ubah Periode
                <ChevronDown className="w-4 h-4" />
              </Button>

              {showPeriodDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                      PILIH PERIODE DATA
                    </div>
                    {availableDataPeriods.map((period) => (
                      <button
                        key={period.id}
                        onClick={() => handlePeriodChange(period)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center justify-between ${
                          selectedPeriod.id === period.id
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {period.type === "yearly" ? (
                            <Calendar className="w-4 h-4" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                          <span>{period.label}</span>
                        </div>
                        {!period.isComplete && (
                          <Badge variant="secondary" className="text-xs">
                            Parsial
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fallback Message */}
          {shouldShowFallbackMessage() && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Menampilkan Data Triwulan
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Data tahun {new Date().getFullYear()} belum lengkap,
                  menampilkan data triwulan terakhir yang tersedia.
                </p>
              </div>
            </div>
          )}

          {/* Chart Insights */}
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg hover:bg-green-100 transition-colors">
              <div className="text-sm font-medium text-green-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Total Verified
              </div>
              <div className="text-lg lg:text-xl font-bold text-green-600 mt-1">
                {selectedPeriod.data.reduce(
                  (sum, item) => sum + item.verified,
                  0,
                )}
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg hover:bg-red-100 transition-colors">
              <div className="text-sm font-medium text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Total Revised
              </div>
              <div className="text-lg lg:text-xl font-bold text-red-600 mt-1">
                {selectedPeriod.data.reduce(
                  (sum, item) => sum + item.revised,
                  0,
                )}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="text-sm font-medium text-blue-800 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Success Rate
              </div>
              <div className="text-lg lg:text-xl font-bold text-blue-600 mt-1">
                {(() => {
                  const totalVerified = selectedPeriod.data.reduce(
                    (sum, item) => sum + item.verified,
                    0,
                  );
                  const totalRevised = selectedPeriod.data.reduce(
                    (sum, item) => sum + item.revised,
                    0,
                  );
                  return Math.round(
                    (totalVerified / (totalVerified + totalRevised)) * 100,
                  );
                })()}
                %
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div ref={chartRef} className="w-full" />
          )}
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="overflow-x-auto">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit min-w-full sm:min-w-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Target className="w-3 h-3 lg:w-4 lg:h-4 inline mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Info</span>
          </button>
          <button
            onClick={() => setActiveTab("activities")}
            className={`px-3 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "activities"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Clock className="w-3 h-3 lg:w-4 lg:h-4 inline mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Aktivitas Terbaru</span>
            <span className="sm:hidden">Activity</span>
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "pending"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <AlertTriangle className="w-3 h-3 lg:w-4 lg:h-4 inline mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Pending ({pendingAssignments.length})</span>
            <span className="sm:hidden">Pending</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/verification">
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Verifikasi Readiness
                </Button>
              </Link>
              <Link to="/risk-capture-verification">
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Verifikasi Risk Capture
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Download Laporan Bulanan
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Kirim Feedback ke Management
              </Button>
            </CardContent>
          </Card>

          {/* Verification Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Verifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Risk Capture Summary */}
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-600" />
                      <p className="text-sm font-medium text-red-800">
                        Risk Capture
                      </p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">
                      {verificationStats.riskCapture.total} submissions
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-red-600">
                      Total Risks: {verificationStats.riskCapture.totalRisks}
                    </div>
                    <div className="text-red-600">
                      Success Rate:{" "}
                      {verificationStats.riskCapture.total > 0
                        ? Math.round(
                            (verificationStats.riskCapture.verified /
                              verificationStats.riskCapture.total) *
                              100,
                          )
                        : 0}
                      %
                    </div>
                  </div>
                </div>

                {/* Readiness Summary */}
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-medium text-green-800">
                        Project Readiness
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {verificationStats.readiness.total} submissions
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-green-600">
                      Total Items: {verificationStats.readiness.totalItems}
                    </div>
                    <div className="text-green-600">
                      Success Rate:{" "}
                      {verificationStats.readiness.total > 0
                        ? Math.round(
                            (verificationStats.readiness.verified /
                              verificationStats.readiness.total) *
                              100,
                          )
                        : 0}
                      %
                    </div>
                  </div>
                </div>

                {/* Overall Performance */}
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      <p className="text-sm font-medium text-purple-800">
                        Overall Performance
                      </p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">
                      {(() => {
                        const total =
                          verificationStats.riskCapture.total +
                          verificationStats.readiness.total;
                        const verified =
                          verificationStats.overall.totalVerified;
                        return total > 0
                          ? Math.round((verified / total) * 100)
                          : 0;
                      })()}
                      % success rate
                    </Badge>
                  </div>
                  <div className="text-xs text-purple-600">
                    {verificationStats.overall.totalVerified} terverifikasi dari{" "}
                    {verificationStats.riskCapture.total +
                      verificationStats.readiness.total}{" "}
                    total submissions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "activities" && (
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Verifikasi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="border rounded-lg p-4 sm:p-6 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {activity.projectName}
                        </h3>
                        {getStatusBadge(activity.status)}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">Action:</span>
                          <span className="text-gray-900">{activity.action}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">Items:</span>
                          <span className="text-gray-900">{activity.items} item</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">Waktu:</span>
                          <span className="text-gray-900">{formatDateTime(activity.timestamp)}</span>
                        </div>
                      </div>

                      {activity.notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                          <span className="font-medium text-blue-900">Notes:</span>
                          <p className="mt-1 text-blue-800">{activity.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle>Assignment Menunggu Verifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-500">Tidak ada assignment pending</p>
                </div>
              ) : (
                pendingAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="border rounded-lg p-4 sm:p-6 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {assignment.projectName}
                          </h3>
                          {getPriorityBadge(assignment.priority)}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">Submitter:</span>
                            <span className="text-gray-900">{assignment.submittedBy}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">Category:</span>
                            <span className="text-gray-900">{assignment.category}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">Est. Time:</span>
                            <span className="text-gray-900">{assignment.estimatedTime}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">Submitted:</span>
                            <span className="text-gray-900">{formatDateTime(assignment.submittedAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end lg:ml-4">
                        <Link to="/verification">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto hover:bg-blue-50 hover:border-blue-300">
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
