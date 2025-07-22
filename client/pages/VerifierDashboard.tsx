import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/common/PageHeader";
import {
  UserCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileX,
  TrendingUp,
  Calendar,
  Award,
  Eye,
  MessageSquare,
  BarChart3,
  Target,
} from "lucide-react";
import { formatDateTime } from "@/utils/formatters";

// Mock verifier data
const verifierProfile = {
  id: "verifier-001",
  name: "Dr. Ahmad Wijaya",
  email: "ahmad.wijaya@company.com",
  role: "Senior Verifier",
  department: "Quality Assurance",
  joinDate: "2023-01-15",
  phone: "+62 821-1234-5678",
  expertise: [
    "Legal Documents",
    "Financial Records",
    "Technical Specifications",
  ],
  certifications: [
    "ISO 9001 Auditor",
    "PMP Certified",
    "Risk Management Professional",
  ],
};

const verificationStats = {
  totalVerified: 156,
  thisMonth: 23,
  pending: 8,
  averageTime: "2.5 jam",
  accuracyRate: 97.3,
  completionRate: 94.8,
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

const monthlyStats = [
  { month: "Jan", verified: 23, revised: 5 },
  { month: "Feb", verified: 28, revised: 3 },
  { month: "Mar", verified: 31, revised: 7 },
  { month: "Apr", verified: 25, revised: 4 },
  { month: "May", verified: 29, revised: 6 },
  { month: "Jun", verified: 33, revised: 2 },
];

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Verifikator"
        description="Panel kontrol untuk verifikator project readiness"
        icon="UserCheck"
      />

      {/* Verifier Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Profil Verifikator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-700">
                {verifierProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {verifierProfile.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {verifierProfile.role}
                  </p>
                  <p className="text-sm text-gray-500">
                    {verifierProfile.department}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span className="text-gray-600">
                      {verifierProfile.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Phone:</span>
                    <span className="text-gray-600">
                      {verifierProfile.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Bergabung:</span>
                    <span className="text-gray-600">
                      {new Date(verifierProfile.joinDate).toLocaleDateString(
                        "id-ID",
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Keahlian:</h4>
                <div className="flex flex-wrap gap-2">
                  {verifierProfile.expertise.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <h4 className="font-medium text-gray-900 mb-2">Sertifikasi:</h4>
                <div className="flex flex-wrap gap-2">
                  {verifierProfile.certifications.map((cert, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800">
                      <Award className="w-3 h-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Rata-rata Waktu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {verificationStats.averageTime}
            </div>
            <p className="text-xs text-gray-500">Per verifikasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Akurasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {verificationStats.accuracyRate}%
            </div>
            <p className="text-xs text-gray-500">Tingkat akurasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {verificationStats.completionRate}%
            </div>
            <p className="text-xs text-gray-500">Tingkat penyelesaian</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance 6 Bulan Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-600">
                  {stat.month}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-green-700">
                      Verified: {stat.verified}
                    </span>
                    <span className="text-sm text-red-700">
                      Revised: {stat.revised}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Progress
                      value={(stat.verified / 35) * 100}
                      className="flex-1 h-2"
                    />
                    <div className="w-12 text-xs text-gray-500">
                      {Math.round(
                        (stat.verified / (stat.verified + stat.revised)) * 100,
                      )}
                      %
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  Lihat Semua Verifikasi
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

          {/* Goals & Targets */}
          <Card>
            <CardHeader>
              <CardTitle>Target Bulanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Verifikasi Completed</span>
                  <span>{verificationStats.thisMonth}/30</span>
                </div>
                <Progress value={(verificationStats.thisMonth / 30) * 100} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Accuracy Rate</span>
                  <span>{verificationStats.accuracyRate}%/95%</span>
                </div>
                <Progress value={(verificationStats.accuracyRate / 95) * 100} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Response Time</span>
                  <span>2.5h/3h target</span>
                </div>
                <Progress value={(2.5 / 3) * 100} />
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
