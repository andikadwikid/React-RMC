import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { RiskCaptureVerificationModal } from "@/components/verification/RiskCaptureVerificationModal";
import {
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  FileX,
} from "lucide-react";
import type { RiskCapture } from "@/types";
import { formatDateTime } from "@/utils/formatters";

// Mock data for demonstration - Risk Capture submissions
const mockRiskCaptureSubmissions: RiskCapture[] = [
  {
    id: "risk-001",
    projectId: "proj-001",
    projectName: "Sistem ERP PT. ABC Manufacturing",
    submittedBy: "John Doe",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "submitted",
    totalRisks: 8,
    riskLevelDistribution: {
      sangatRendah: 2,
      rendah: 3,
      sedang: 2,
      tinggi: 1,
      sangatTinggi: 0,
    },
    createdAt: "2024-01-15T10:30:00Z",
    risks: [
      {
        id: "risk-item-1",
        sasaran: "Keamanan Data",
        kode: "RSK-001",
        taksonomi: "Operational Risk",
        peristiwaRisiko: "Kehilangan data customer akibat kerusakan server",
        sumberRisiko: "Hardware failure",
        dampakKualitatif: "Kehilangan kepercayaan customer",
        dampakKuantitatif: "Kerugian finansial hingga 500 juta rupiah",
        kontrolEksisting: "Backup data harian dan redundant server",
        risikoAwal: { kejadian: 3, dampak: 4, level: 12 },
        resikoAkhir: { kejadian: 2, dampak: 3, level: 6 },
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "risk-item-2",
        sasaran: "Operasional",
        kode: "RSK-002",
        taksonomi: "Process Risk",
        peristiwaRisiko: "Keterlambatan implementasi sistem",
        sumberRisiko: "Resource constraints",
        dampakKualitatif: "Delay project timeline",
        dampakKuantitatif: "Penalty 100 juta rupiah",
        kontrolEksisting: "Project monitoring dan milestone tracking",
        risikoAwal: { kejadian: 4, dampak: 3, level: 12 },
        resikoAkhir: { kejadian: 2, dampak: 2, level: 4 },
        createdAt: "2024-01-15T10:30:00Z",
      },
    ],
  },
  {
    id: "risk-002",
    projectId: "proj-002",
    projectName: "Portal E-Commerce Fashion",
    submittedBy: "Jane Smith",
    submittedAt: "2024-01-14T14:20:00Z",
    status: "under_review",
    totalRisks: 6,
    riskLevelDistribution: {
      sangatRendah: 1,
      rendah: 2,
      sedang: 2,
      tinggi: 1,
      sangatTinggi: 0,
    },
    verifierName: "Senior Risk Officer",
    createdAt: "2024-01-14T14:20:00Z",
    risks: [
      {
        id: "risk-item-3",
        sasaran: "Payment Security",
        kode: "RSK-003",
        taksonomi: "Security Risk",
        peristiwaRisiko: "Fraud transaksi payment gateway",
        sumberRisiko: "Security vulnerabilities",
        dampakKualitatif: "Kerugian customer dan reputasi",
        dampakKuantitatif: "Chargeback hingga 200 juta rupiah",
        kontrolEksisting: "SSL encryption dan fraud detection",
        risikoAwal: { kejadian: 5, dampak: 4, level: 20 },
        resikoAkhir: { kejadian: 2, dampak: 3, level: 6 },
        createdAt: "2024-01-14T14:20:00Z",
      },
    ],
  },
  {
    id: "risk-003",
    projectId: "proj-003",
    projectName: "Aplikasi Mobile Banking",
    submittedBy: "Robert Johnson",
    submittedAt: "2024-01-13T09:15:00Z",
    status: "verified",
    totalRisks: 12,
    riskLevelDistribution: {
      sangatRendah: 4,
      rendah: 5,
      sedang: 2,
      tinggi: 1,
      sangatTinggi: 0,
    },
    verifierName: "Chief Risk Officer",
    verifiedAt: "2024-01-14T16:45:00Z",
    overallComment: "Risk assessment comprehensive and mitigation strategies adequate",
    createdAt: "2024-01-13T09:15:00Z",
    risks: [],
  },
  {
    id: "risk-004",
    projectId: "proj-004",
    projectName: "Dashboard Analytics Marketing",
    submittedBy: "Sarah Wilson",
    submittedAt: "2024-01-12T11:00:00Z",
    status: "needs_revision",
    totalRisks: 5,
    riskLevelDistribution: {
      sangatRendah: 1,
      rendah: 2,
      sedang: 1,
      tinggi: 1,
      sangatTinggi: 0,
    },
    verifierName: "Senior Risk Analyst",
    verifiedAt: "2024-01-13T10:30:00Z",
    overallComment: "Several high-impact risks need additional mitigation controls",
    createdAt: "2024-01-12T11:00:00Z",
    risks: [],
  },
];

const STATUS_CONFIG = {
  submitted: {
    label: "Menunggu Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  under_review: {
    label: "Sedang Direview",
    color: "bg-blue-100 text-blue-800",
    icon: Eye,
  },
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
};

export default function RiskCaptureVerification() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSubmission, setSelectedSubmission] =
    useState<RiskCapture | null>(null);
  const [verificationModal, setVerificationModal] = useState(false);

  const getFilteredSubmissions = (status: string) => {
    return mockRiskCaptureSubmissions.filter((submission) => {
      const matchesSearch =
        submission.projectName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = status === "all" || submission.status === status;

      return matchesSearch && matchesStatus;
    });
  };

  const openVerificationModal = (submission: RiskCapture) => {
    setSelectedSubmission(submission);
    setVerificationModal(true);
  };

  const closeVerificationModal = () => {
    setVerificationModal(false);
    setSelectedSubmission(null);
  };

  const handleVerificationSave = (submissionId: string, data: any) => {
    console.log("Risk capture verification updated:", submissionId, data);
    closeVerificationModal();
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    if (!config) return null;

    const IconComponent = config.icon;
    return (
      <Badge className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getRiskLevelSummary = (distribution: RiskCapture["riskLevelDistribution"]) => {
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    const highRisk = distribution.tinggi + distribution.sangatTinggi;
    
    return {
      total,
      highRisk,
      percentage: total > 0 ? Math.round((highRisk / total) * 100) : 0,
    };
  };

  const getPendingCount = () => {
    return mockRiskCaptureSubmissions.filter((s) => s.status === "submitted")
      .length;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Capture Verification"
        description="Review dan validasi risk capture assessment yang disubmit oleh user"
        icon="Shield"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockRiskCaptureSubmissions.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Menunggu Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {getPendingCount()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Terverifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                mockRiskCaptureSubmissions.filter((s) => s.status === "verified")
                  .length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Perlu Revisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {
                mockRiskCaptureSubmissions.filter(
                  (s) => s.status === "needs_revision",
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari berdasarkan nama project atau submitter..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Status Tracking */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Semua ({mockRiskCaptureSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="submitted" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Menunggu ({mockRiskCaptureSubmissions.filter(s => s.status === "submitted").length})
          </TabsTrigger>
          <TabsTrigger value="under_review" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Review ({mockRiskCaptureSubmissions.filter(s => s.status === "under_review").length})
          </TabsTrigger>
          <TabsTrigger value="verified" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Verified ({mockRiskCaptureSubmissions.filter(s => s.status === "verified").length})
          </TabsTrigger>
          <TabsTrigger value="needs_revision" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Revisi ({mockRiskCaptureSubmissions.filter(s => s.status === "needs_revision").length})
          </TabsTrigger>
        </TabsList>

        {/* Tab Content for All */}
        <TabsContent value="all">
          <SubmissionsList
            submissions={getFilteredSubmissions("all")}
            onOpenModal={openVerificationModal}
            getStatusBadge={getStatusBadge}
            getRiskLevelSummary={getRiskLevelSummary}
          />
        </TabsContent>

        {/* Tab Content for Submitted */}
        <TabsContent value="submitted">
          <SubmissionsList
            submissions={getFilteredSubmissions("submitted")}
            onOpenModal={openVerificationModal}
            getStatusBadge={getStatusBadge}
            getRiskLevelSummary={getRiskLevelSummary}
          />
        </TabsContent>

        {/* Tab Content for Under Review */}
        <TabsContent value="under_review">
          <SubmissionsList
            submissions={getFilteredSubmissions("under_review")}
            onOpenModal={openVerificationModal}
            getStatusBadge={getStatusBadge}
            getRiskLevelSummary={getRiskLevelSummary}
          />
        </TabsContent>

        {/* Tab Content for Verified */}
        <TabsContent value="verified">
          <SubmissionsList
            submissions={getFilteredSubmissions("verified")}
            onOpenModal={openVerificationModal}
            getStatusBadge={getStatusBadge}
            getRiskLevelSummary={getRiskLevelSummary}
          />
        </TabsContent>

        {/* Tab Content for Needs Revision */}
        <TabsContent value="needs_revision">
          <SubmissionsList
            submissions={getFilteredSubmissions("needs_revision")}
            onOpenModal={openVerificationModal}
            getStatusBadge={getStatusBadge}
            getRiskLevelSummary={getRiskLevelSummary}
          />
        </TabsContent>
      </Tabs>

      {/* Verification Modal */}
      {verificationModal && selectedSubmission && (
        <RiskCaptureVerificationModal
          isOpen={verificationModal}
          onClose={closeVerificationModal}
          submission={selectedSubmission}
          onSave={handleVerificationSave}
        />
      )}
    </div>
  );
}
