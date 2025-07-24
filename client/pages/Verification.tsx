import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { ProjectReadinessVerificationModal } from "@/components/verification/ProjectReadinessVerificationModal";
import {
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileX,
  Shield,
} from "lucide-react";
import type { ProjectReadiness } from "@/types";
import { formatDateTime } from "@/utils/formatters";

// Mock data for demonstration
const mockReadinessSubmissions: ProjectReadiness[] = [
  {
    id: "1",
    projectId: "proj-001",
    projectName: "Sistem ERP PT. ABC Manufacturing",
    submittedBy: "John Doe",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "submitted",
    createdAt: "2024-01-15T10:30:00Z",
    items: [
      {
        id: "item-1",
        category: "Administrative",
        item: "Surat Izin Usaha",
        userStatus: "lengkap",
        userComment: "Dokumen sudah lengkap dan valid",
      },
      {
        id: "item-2",
        category: "Administrative",
        item: "NPWP Perusahaan",
        userStatus: "lengkap",
      },
      {
        id: "item-3",
        category: "User Data",
        item: "Master Data Customer",
        userStatus: "parsial",
        userComment: "Data customer masih dalam proses migrasi",
      },
    ],
  },
  {
    id: "2",
    projectId: "proj-002",
    projectName: "Portal E-Commerce Fashion",
    submittedBy: "Jane Smith",
    submittedAt: "2024-01-14T14:20:00Z",
    status: "under_review",
    verifierName: "Admin Verifier",
    createdAt: "2024-01-14T14:20:00Z",
    items: [
      {
        id: "item-4",
        category: "Administrative",
        item: "Surat Izin Usaha",
        userStatus: "lengkap",
        verifierStatus: "parsial",
        verifierComment:
          "Dokumen perlu diperbaharui, masa berlaku hampir habis",
      },
    ],
  },
  {
    id: "3",
    projectId: "proj-003",
    projectName: "Aplikasi Mobile Banking",
    submittedBy: "Robert Johnson",
    submittedAt: "2024-01-13T09:15:00Z",
    status: "verified",
    verifierName: "Senior Verifier",
    verifiedAt: "2024-01-14T16:45:00Z",
    overallComment: "Semua dokumen telah memenuhi standar requirement",
    createdAt: "2024-01-13T09:15:00Z",
    items: [],
  },
  {
    id: "4",
    projectId: "proj-004",
    projectName: "Dashboard Analytics Marketing",
    submittedBy: "Sarah Wilson",
    submittedAt: "2024-01-12T11:00:00Z",
    status: "needs_revision",
    verifierName: "Quality Assurance",
    verifiedAt: "2024-01-13T10:30:00Z",
    overallComment:
      "Beberapa dokumen legal perlu dilengkapi sebelum project dapat dimulai",
    createdAt: "2024-01-12T11:00:00Z",
    items: [],
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

export default function Verification() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] =
    useState<ProjectReadiness | null>(null);
  const [verificationModal, setVerificationModal] = useState(false);

  const filteredSubmissions = useMemo(() => {
    return mockReadinessSubmissions.filter((submission) => {
      const matchesSearch =
        submission.projectName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || submission.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const openVerificationModal = (submission: ProjectReadiness) => {
    setSelectedSubmission(submission);
    setVerificationModal(true);
  };

  const closeVerificationModal = () => {
    setVerificationModal(false);
    setSelectedSubmission(null);
  };

  const handleVerificationSave = (submissionId: string, data: any) => {
    console.log("Verification updated:", submissionId, data);
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

  const getPendingCount = () => {
    return mockReadinessSubmissions.filter((s) => s.status === "submitted")
      .length;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verifikator"
        description="Validasi dan review data readiness project yang disubmit oleh user"
        icon="CheckCircle"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Submission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockReadinessSubmissions.length}
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
                mockReadinessSubmissions.filter((s) => s.status === "verified")
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
                mockReadinessSubmissions.filter(
                  (s) => s.status === "needs_revision",
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari berdasarkan nama project atau submitter..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="submitted">Menunggu Review</SelectItem>
                  <SelectItem value="under_review">Sedang Direview</SelectItem>
                  <SelectItem value="verified">Terverifikasi</SelectItem>
                  <SelectItem value="needs_revision">Perlu Revisi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Submission Readiness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <FileX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Tidak ada submission yang ditemukan
                </p>
              </div>
            ) : (
              filteredSubmissions.map((submission) => (
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
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

                      {submission.overallComment && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                          <span className="font-medium">Komentar:</span>{" "}
                          {submission.overallComment}
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openVerificationModal(submission)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Verification Modal */}
      {verificationModal && selectedSubmission && (
        <ProjectReadinessVerificationModal
          isOpen={verificationModal}
          onClose={closeVerificationModal}
          submission={selectedSubmission}
          onSave={handleVerificationSave}
        />
      )}
    </div>
  );
}
