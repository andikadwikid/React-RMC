import React, { useState, useMemo, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { SummaryCard } from "@/components/common/SummaryCard";
import { SearchInput } from "@/components/common/SearchInput";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { SubmissionItem } from "@/components/verification/SubmissionItemOptimized";
import { ProjectReadinessVerificationModal } from "@/components/verification/ProjectReadinessVerificationModalOptimized";
import { useVerificationData } from "@/hooks/verification";
import { useDebounce } from "@/hooks/common";
import {
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  FileX,
  Search,
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
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner message="Memuat data submission..." />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <EmptyState
          icon={FileX}
          message="Tidak ada submission yang ditemukan"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
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
  <TabsContent value={value} className="mt-4 sm:mt-6">
    <SubmissionsList
      submissions={submissions}
      onOpenModal={onOpenModal}
      isLoading={isLoading}
    />
  </TabsContent>
));

TabContent.displayName = "TabContent";

export default function VerificationOptimized() {
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
        submission.submittedBy.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        submission.projectId.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

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

  // Tab configuration for responsiveness
  const tabConfig = [
    {
      value: "all",
      label: { full: "Semua", short: "All" },
      icon: Shield,
      count: counts.total,
      submissions: filteredByTab,
    },
    {
      value: "submitted",
      label: { full: "Menunggu", short: "Wait" },
      icon: Clock,
      count: counts.pending,
      submissions: filteredByTab.filter(s => s.status === "submitted"),
    },
    {
      value: "under_review",
      label: { full: "Review", short: "Rev" },
      icon: Eye,
      count: counts.underReview,
      submissions: filteredByTab.filter(s => s.status === "under_review"),
    },
    {
      value: "verified",
      label: { full: "Verified", short: "Ver" },
      icon: CheckCircle,
      count: counts.verified,
      submissions: filteredByTab.filter(s => s.status === "verified"),
    },
    {
      value: "needs_revision",
      label: { full: "Revisi", short: "Fix" },
      icon: AlertTriangle,
      count: counts.revision,
      submissions: filteredByTab.filter(s => s.status === "needs_revision"),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Mobile Optimized */}
      <PageHeader
        title="Verifikator"
        description="Validasi dan review data readiness project yang disubmit oleh user"
        icon="CheckCircle"
      />

      {/* Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard
          title="Total"
          value={counts.total}
          description="Keseluruhan"
          icon={Shield}
          iconColor="text-blue-700"
          borderColor="border-blue-200"
          valueColor="text-blue-600"
          descriptionColor="text-blue-600"
        />
        
        <SummaryCard
          title="Menunggu"
          value={counts.pending}
          description="Perlu review"
          icon={Clock}
          iconColor="text-yellow-700"
          borderColor="border-yellow-200"
          valueColor="text-yellow-600"
          descriptionColor="text-yellow-600"
        />
        
        <SummaryCard
          title="Verified"
          value={counts.verified}
          description="Selesai"
          icon={CheckCircle}
          iconColor="text-green-700"
          borderColor="border-green-200"
          valueColor="text-green-600"
          descriptionColor="text-green-600"
        />
        
        <SummaryCard
          title="Revisi"
          value={counts.revision}
          description="Perbaikan"
          icon={AlertTriangle}
          iconColor="text-red-700"
          borderColor="border-red-200"
          valueColor="text-red-600"
          descriptionColor="text-red-600"
        />
      </div>

      {/* Search - Mobile Enhanced */}
      <div className="relative">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Cari project, submitter, atau ID..."
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {/* Tabs for Status Tracking - Mobile Optimized */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4 sm:space-y-6"
      >
        {/* Tab List - Horizontal Scroll on Mobile */}
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid w-full grid-cols-5 min-w-[500px] sm:min-w-[600px] lg:min-w-0 h-auto p-1">
            {tabConfig.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                >
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  
                  {/* Responsive Labels */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
                    <span className="hidden sm:inline">{tab.label.full}</span>
                    <span className="sm:hidden">{tab.label.short}</span>
                    
                    {/* Count Badge - Responsive */}
                    <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full sm:bg-transparent sm:px-0 sm:py-0 sm:rounded-none">
                      <span className="sm:hidden">{tab.count}</span>
                      <span className="hidden sm:inline">({tab.count})</span>
                    </span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Contents */}
        {tabConfig.map((tab) => (
          <TabContent
            key={tab.value}
            value={tab.value}
            submissions={tab.submissions}
            onOpenModal={openVerificationModal}
            isLoading={isLoading}
          />
        ))}
      </Tabs>

      {/* Verification Modal - Responsive */}
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
