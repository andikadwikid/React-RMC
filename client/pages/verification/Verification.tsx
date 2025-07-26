import React, { useState, useMemo, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { SummaryCard } from "@/components/common/SummaryCard";
import { SearchInput } from "@/components/common/SearchInput";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { SubmissionItem } from "@/components/verification/SubmissionItem";
import { ProjectReadinessVerificationModal } from "@/components/verification/ProjectReadinessVerificationModal";
import { useVerificationData } from "@/hooks/verification";
import { useDebounce } from "@/hooks/common";
import {
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  FileX,
} from "lucide-react";
import type { ProjectReadiness } from "@/types";

// Memoized SubmissionsList component to prevent unnecessary re-renders
const SubmissionsList = React.memo(({
  submissions,
  onOpenModal,
  isLoading,
}: {
  submissions: ProjectReadiness[];
  onOpenModal: (submission: ProjectReadiness) => void;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <LoadingSpinner message="Memuat data submission..." />;
  }

  if (submissions.length === 0) {
    return (
      <EmptyState
        icon={FileX}
        message="Tidak ada submission yang ditemukan"
      />
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <SubmissionItem
          key={submission.id}
          submission={submission}
          onOpenModal={onOpenModal}
        />
      ))}
    </div>
  );
});

SubmissionsList.displayName = "SubmissionsList";

// Memoized TabContent component
const TabContent = React.memo(({
  value,
  submissions,
  onOpenModal,
  isLoading,
}: {
  value: string;
  submissions: ProjectReadiness[];
  onOpenModal: (submission: ProjectReadiness) => void;
  isLoading: boolean;
}) => (
  <TabsContent value={value}>
    <SubmissionsList
      submissions={submissions}
      onOpenModal={onOpenModal}
      isLoading={isLoading}
    />
  </TabsContent>
));

TabContent.displayName = "TabContent";

export default function Verification() {
  const {
    filteredSubmissions,
    isLoading,
    searchTerm,
    activeTab,
    setSearchTerm,
    setActiveTab,
    updateSubmission,
    getCounts,
  } = useVerificationData();

  const [selectedSubmission, setSelectedSubmission] = useState<ProjectReadiness | null>(null);
  const [verificationModal, setVerificationModal] = useState(false);

  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtered submissions based on debounced search
  const filteredByTab = useMemo(() => {
    return filteredSubmissions.filter((submission) => {
      const matchesSearch =
        submission.projectName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        submission.submittedBy.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [filteredSubmissions, debouncedSearchTerm]);

  // Memoized counts
  const counts = useMemo(() => getCounts(), [getCounts]);

  // Memoized handlers
  const openVerificationModal = useCallback((submission: ProjectReadiness) => {
    setSelectedSubmission(submission);
    setVerificationModal(true);
  }, []);

  const closeVerificationModal = useCallback(() => {
    setVerificationModal(false);
    setSelectedSubmission(null);
  }, []);

  const handleVerificationSave = useCallback((
    submissionId: string,
    verificationData: any,
  ) => {
    console.log("Verification updated:", submissionId, verificationData);
    updateSubmission(submissionId, verificationData);
    closeVerificationModal();
  }, [updateSubmission, closeVerificationModal]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verifikator"
        description="Validasi dan review data readiness project yang disubmit oleh user"
        icon="CheckCircle"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard
          title="Total Submission"
          value={counts.total}
          description="Total keseluruhan"
          icon={Shield}
        />
        
        <SummaryCard
          title="Menunggu Review"
          value={counts.pending}
          description="Memerlukan perhatian"
          icon={Clock}
          iconColor="text-yellow-700"
          borderColor="border-yellow-200"
          valueColor="text-yellow-600"
          descriptionColor="text-yellow-600"
        />
        
        <SummaryCard
          title="Terverifikasi"
          value={counts.verified}
          description="Sudah selesai"
          icon={CheckCircle}
          iconColor="text-green-700"
          borderColor="border-green-200"
          valueColor="text-green-600"
          descriptionColor="text-green-600"
        />
        
        <SummaryCard
          title="Perlu Revisi"
          value={counts.revision}
          description="Butuh perbaikan"
          icon={AlertTriangle}
          iconColor="text-red-700"
          borderColor="border-red-200"
          valueColor="text-red-600"
          descriptionColor="text-red-600"
        />
      </div>

      {/* Search */}
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Cari berdasarkan nama project atau submitter..."
      />

      {/* Tabs for Status Tracking */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid w-full grid-cols-5 min-w-[500px] sm:min-w-[600px] lg:min-w-0">
            <TabsTrigger
              value="all"
              className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm"
            >
              <Shield className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Semua</span>
              <span className="sm:hidden">All</span>
              <span className="hidden lg:inline">({counts.total})</span>
            </TabsTrigger>
            <TabsTrigger
              value="submitted"
              className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm"
            >
              <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Menunggu</span>
              <span className="sm:hidden">Wait</span>
              <span className="hidden lg:inline">({counts.pending})</span>
            </TabsTrigger>
            <TabsTrigger
              value="under_review"
              className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm"
            >
              <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Review</span>
              <span className="sm:hidden">Rev</span>
              <span className="hidden lg:inline">({counts.underReview})</span>
            </TabsTrigger>
            <TabsTrigger
              value="verified"
              className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm"
            >
              <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Verified</span>
              <span className="sm:hidden">Ver</span>
              <span className="hidden lg:inline">({counts.verified})</span>
            </TabsTrigger>
            <TabsTrigger
              value="needs_revision"
              className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm"
            >
              <AlertTriangle className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Revisi</span>
              <span className="sm:hidden">Fix</span>
              <span className="hidden lg:inline">({counts.revision})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabContent
          value="all"
          submissions={filteredByTab}
          onOpenModal={openVerificationModal}
          isLoading={isLoading}
        />

        <TabContent
          value="submitted"
          submissions={filteredByTab.filter(s => s.status === "submitted")}
          onOpenModal={openVerificationModal}
          isLoading={isLoading}
        />

        <TabContent
          value="under_review"
          submissions={filteredByTab.filter(s => s.status === "under_review")}
          onOpenModal={openVerificationModal}
          isLoading={isLoading}
        />

        <TabContent
          value="verified"
          submissions={filteredByTab.filter(s => s.status === "verified")}
          onOpenModal={openVerificationModal}
          isLoading={isLoading}
        />

        <TabContent
          value="needs_revision"
          submissions={filteredByTab.filter(s => s.status === "needs_revision")}
          onOpenModal={openVerificationModal}
          isLoading={isLoading}
        />
      </Tabs>

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
