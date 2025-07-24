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
import { loadSubmissionTracking } from "@/utils/dataLoader";

// Load risk capture submissions from JSON data
const getRiskCaptureSubmissions = (): RiskCapture[] => {
  try {
    const submissionData = loadSubmissionTracking();

    if (!submissionData || !submissionData.risk_capture_submissions) {
      console.error("No risk capture submissions found in data");
      return [];
    }

    // Map the data to match RiskCapture interface
    const mappedData = submissionData.risk_capture_submissions.map(
      (submission) => ({
        ...submission,
        createdAt: submission.createdAt || submission.submittedAt,
        updatedAt: submission.verifiedAt || undefined,
        overallComment: submission.notes || "",
        risks: submission.risks || [],
      }),
    );

    return mappedData;
  } catch (error) {
    console.error("Error loading risk capture submissions:", error);
    return [];
  }
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

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

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
  isLoading?: boolean;
}

function SubmissionsList({
  submissions,
  onOpenModal,
  getStatusBadge,
  getRiskLevelSummary,
  isLoading = false,
}: SubmissionsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <LoadingSpinner />
          <p className="text-center text-gray-500 mt-4">
            Memuat data submission...
          </p>
        </CardContent>
      </Card>
    );
  }

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
                className="border rounded-lg p-4 sm:p-6 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {submission.projectName}
                      </h3>
                      {getStatusBadge(submission.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">Submitter:</span>
                        <span className="text-gray-900">{submission.submittedBy}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">Tanggal Submit:</span>
                        <span className="text-gray-900">{formatDateTime(submission.submittedAt)}</span>
                      </div>
                      {submission.verifierName && (
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">Verifier:</span>
                          <span className="text-gray-900">{submission.verifierName}</span>
                        </div>
                      )}
                    </div>

                    {/* Risk Distribution Summary */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Total Risks:</span>
                        <Badge variant="outline" className="font-semibold">{submission.totalRisks}</Badge>
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
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Rendah:{" "}
                        {submission.riskLevelDistribution.sangatRendah +
                          submission.riskLevelDistribution.rendah}
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Sedang: {submission.riskLevelDistribution.sedang}
                      </Badge>
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Tinggi:{" "}
                        {submission.riskLevelDistribution.tinggi +
                          submission.riskLevelDistribution.sangatTinggi}
                      </Badge>
                    </div>

                    {submission.overallComment && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                        <span className="font-medium text-blue-900">Komentar:</span>
                        <p className="mt-1 text-blue-800">{submission.overallComment}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end lg:ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenModal(submission)}
                      className="w-full sm:w-auto hover:bg-blue-50 hover:border-blue-300"
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
  const [isLoading, setIsLoading] = useState(true);

  const [riskCaptureSubmissions, setRiskCaptureSubmissions] = useState<RiskCapture[]>([]);

  // Simulate loading data
  useState(() => {
    setTimeout(() => {
      setRiskCaptureSubmissions(getRiskCaptureSubmissions());
      setIsLoading(false);
    }, 800);
  });

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {riskCaptureSubmissions.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total keseluruhan</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Menunggu Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {getPendingCount()}
            </div>
            <p className="text-xs text-yellow-600 mt-1">Memerlukan perhatian</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Terverifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                riskCaptureSubmissions.filter((s) => s.status === "verified")
                  .length
              }
            </div>
            <p className="text-xs text-green-600 mt-1">Sudah selesai</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
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
            <p className="text-xs text-red-600 mt-1">Butuh perbaikan</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari berdasarkan nama project atau submitter..."
              className="pl-10 h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
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
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-5 min-w-[600px] lg:min-w-0">
            <TabsTrigger value="all" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
              <Shield className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Semua</span>
              <span className="sm:hidden">All</span>
              <span className="hidden lg:inline">({riskCaptureSubmissions.length})</span>
            </TabsTrigger>
            <TabsTrigger value="submitted" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
              <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Menunggu</span>
              <span className="sm:hidden">Wait</span>
              <span className="hidden lg:inline">
                ({
                  riskCaptureSubmissions.filter((s) => s.status === "submitted")
                    .length
                })
              </span>
            </TabsTrigger>
            <TabsTrigger value="under_review" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
              <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Review</span>
              <span className="sm:hidden">Rev</span>
              <span className="hidden lg:inline">
                ({
                  riskCaptureSubmissions.filter((s) => s.status === "under_review")
                    .length
                })
              </span>
            </TabsTrigger>
            <TabsTrigger value="verified" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
              <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Verified</span>
              <span className="sm:hidden">Ver</span>
              <span className="hidden lg:inline">
                ({
                  riskCaptureSubmissions.filter((s) => s.status === "verified")
                    .length
                })
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="needs_revision"
              className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm"
            >
              <AlertTriangle className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Revisi</span>
              <span className="sm:hidden">Fix</span>
              <span className="hidden lg:inline">
                ({
                  riskCaptureSubmissions.filter(
                    (s) => s.status === "needs_revision",
                  ).length
                })
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

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
