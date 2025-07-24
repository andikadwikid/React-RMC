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
import { loadProjectRiskCaptureData } from "@/utils/dataLoader";

// Load risk capture submissions from JSON data
const getRiskCaptureSubmissions = (): RiskCapture[] => {
  const riskCaptureData = loadProjectRiskCaptureData();
  return Object.values(riskCaptureData.riskCapture);
};

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

// Submissions List Component
interface SubmissionsListProps {
  submissions: RiskCapture[];
  onOpenModal: (submission: RiskCapture) => void;
  getStatusBadge: (status: string) => JSX.Element | null;
  getRiskLevelSummary: (distribution: RiskCapture["riskLevelDistribution"]) => {
    total: number;
    highRisk: number;
    percentage: number;
  };
}

function SubmissionsList({
  submissions,
  onOpenModal,
  getStatusBadge,
  getRiskLevelSummary,
}: SubmissionsListProps) {
  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <FileX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Tidak ada risk capture submission yang ditemukan
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Capture Submissions ({submissions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.map((submission) => {
            const riskSummary = getRiskLevelSummary(
              submission.riskLevelDistribution,
            );

            return (
              <div
                key={submission.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {submission.projectName}
                      </h3>
                      {getStatusBadge(submission.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Submitter:</span>{" "}
                        {submission.submittedBy}
                      </div>
                      <div>
                        <span className="font-medium">Tanggal Submit:</span>{" "}
                        {formatDateTime(submission.submittedAt)}
                      </div>
                      {submission.verifierName && (
                        <div>
                          <span className="font-medium">Verifier:</span>{" "}
                          {submission.verifierName}
                        </div>
                      )}
                    </div>

                    {/* Risk Distribution Summary */}
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Total Risks:</span>
                        <Badge variant="outline">{submission.totalRisks}</Badge>
                      </div>
                      {riskSummary.highRisk > 0 && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-red-600 font-medium">
                            High Risk: {riskSummary.highRisk} (
                            {riskSummary.percentage}%)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Risk Level Distribution */}
                    <div className="flex gap-2 text-xs">
                      <Badge className="bg-green-100 text-green-800">
                        Rendah:{" "}
                        {submission.riskLevelDistribution.sangatRendah +
                          submission.riskLevelDistribution.rendah}
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Sedang: {submission.riskLevelDistribution.sedang}
                      </Badge>
                      <Badge className="bg-red-100 text-red-800">
                        Tinggi:{" "}
                        {submission.riskLevelDistribution.tinggi +
                          submission.riskLevelDistribution.sangatTinggi}
                      </Badge>
                    </div>

                    {submission.overallComment && (
                      <div className="mt-3 p-3 bg-gray-100 rounded text-sm">
                        <span className="font-medium">Komentar:</span>{" "}
                        {submission.overallComment}
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenModal(submission)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function RiskCaptureVerification() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSubmission, setSelectedSubmission] =
    useState<RiskCapture | null>(null);
  const [verificationModal, setVerificationModal] = useState(false);

  const [riskCaptureSubmissions] = useState<RiskCapture[]>(getRiskCaptureSubmissions());

  const getFilteredSubmissions = (status: string) => {
    return riskCaptureSubmissions.filter((submission) => {
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

  const getRiskLevelSummary = (
    distribution: RiskCapture["riskLevelDistribution"],
  ) => {
    const total = Object.values(distribution).reduce(
      (sum, count) => sum + count,
      0,
    );
    const highRisk = distribution.tinggi + distribution.sangatTinggi;

    return {
      total,
      highRisk,
      percentage: total > 0 ? Math.round((highRisk / total) * 100) : 0,
    };
  };

  const getPendingCount = () => {
    return riskCaptureSubmissions.filter((s) => s.status === "submitted")
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
              {riskCaptureSubmissions.length}
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
                riskCaptureSubmissions.filter(
                  (s) => s.status === "verified",
                ).length
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
                riskCaptureSubmissions.filter(
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
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Semua ({riskCaptureSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="submitted" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Menunggu (
            {
              riskCaptureSubmissions.filter((s) => s.status === "submitted")
                .length
            }
            )
          </TabsTrigger>
          <TabsTrigger value="under_review" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Review (
            {
              riskCaptureSubmissions.filter(
                (s) => s.status === "under_review",
              ).length
            }
            )
          </TabsTrigger>
          <TabsTrigger value="verified" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Verified (
            {
              riskCaptureSubmissions.filter((s) => s.status === "verified")
                .length
            }
            )
          </TabsTrigger>
          <TabsTrigger
            value="needs_revision"
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Revisi (
            {
              riskCaptureSubmissions.filter(
                (s) => s.status === "needs_revision",
              ).length
            }
            )
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
