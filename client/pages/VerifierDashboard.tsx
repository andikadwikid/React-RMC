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

const verificationStats = {
  totalVerified: 156,
  thisMonth: 23,
  pending: 8,
};

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

  const updateChart = (dataPeriod: DataPeriod) => {
    if (chartRef.current) {
      Highcharts.chart(chartRef.current, {
        chart: {
          type: "column",
          height: 300,
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
    updateChart(selectedPeriod);
  }, [selectedPeriod]);

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
        description="Panel kontrol untuk verifikator project readiness"
        icon="UserCheck"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Terverifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {verificationStats.totalVerified}
            </div>
            <p className="text-xs text-gray-500">Sepanjang masa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {verificationStats.thisMonth}
            </div>
            <p className="text-xs text-gray-500">Verifikasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {verificationStats.pending}
            </div>
            <p className="text-xs text-gray-500">Menunggu review</p>
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
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-green-800">
                Total Verified
              </div>
              <div className="text-lg font-bold text-green-600">
                {selectedPeriod.data.reduce(
                  (sum, item) => sum + item.verified,
                  0,
                )}
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-red-800">
                Total Revised
              </div>
              <div className="text-lg font-bold text-red-600">
                {selectedPeriod.data.reduce(
                  (sum, item) => sum + item.revised,
                  0,
                )}
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                Success Rate
              </div>
              <div className="text-lg font-bold text-blue-600">
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
          <div ref={chartRef} className="w-full" />
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "overview"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Target className="w-4 h-4 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("activities")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "activities"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Aktivitas Terbaru
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "pending"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <AlertTriangle className="w-4 h-4 inline mr-2" />
          Pending ({pendingAssignments.length})
        </button>
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

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Info Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Sistem Pembaruan
                  </p>
                  <p className="text-xs text-blue-600">
                    Fitur notifikasi real-time telah diaktifkan
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    Performance
                  </p>
                  <p className="text-xs text-green-600">
                    Waktu loading dashboard berkurang 40%
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">
                    Maintenance
                  </p>
                  <p className="text-xs text-yellow-600">
                    Maintenance terjadwal Minggu pagi 02:00 - 04:00
                  </p>
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
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {activity.projectName}
                        </h3>
                        {getStatusBadge(activity.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                        <div>
                          <span className="font-medium">Action:</span>{" "}
                          {activity.action}
                        </div>
                        <div>
                          <span className="font-medium">Items:</span>{" "}
                          {activity.items} item
                        </div>
                        <div>
                          <span className="font-medium">Waktu:</span>{" "}
                          {formatDateTime(activity.timestamp)}
                        </div>
                      </div>

                      {activity.notes && (
                        <div className="bg-gray-100 rounded p-2 text-sm">
                          <span className="font-medium">Notes:</span>{" "}
                          {activity.notes}
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
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {assignment.projectName}
                          </h3>
                          {getPriorityBadge(assignment.priority)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Submitter:</span>{" "}
                            {assignment.submittedBy}
                          </div>
                          <div>
                            <span className="font-medium">Category:</span>{" "}
                            {assignment.category}
                          </div>
                          <div>
                            <span className="font-medium">Est. Time:</span>{" "}
                            {assignment.estimatedTime}
                          </div>
                          <div>
                            <span className="font-medium">Submitted:</span>{" "}
                            {formatDateTime(assignment.submittedAt)}
                          </div>
                        </div>
                      </div>

                      <div className="ml-4">
                        <Link to="/verification">
                          <Button variant="outline" size="sm">
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
