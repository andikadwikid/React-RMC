import React, { useState, useCallback, Suspense, lazy } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { Search, FileX } from "lucide-react";
import { useRiskCaptureData } from "@/hooks/verification/useRiskCaptureData";
import type { ProjectRiskDetail } from "@/hooks/verification/useRiskCaptureData";
import RiskCaptureStatsCards from "@/components/verification/RiskCaptureStatsCards";
import VirtualizedProjectTable from "@/components/verification/VirtualizedProjectTable";

// Lazy load the modal component for better performance
const ProjectRiskDetailModal = lazy(() => import("@/components/verification/ProjectRiskDetailModal"));

const RiskCaptureVerificationOptimized = () => {
  const {
    filteredProjects,
    statistics,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadDetailData,
  } = useRiskCaptureData();

  const [selectedProjectDetail, setSelectedProjectDetail] = useState<ProjectRiskDetail | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewDetail = useCallback((projectId: string) => {
    const projectDetail = loadDetailData(projectId);
    setSelectedProjectDetail(projectDetail);
    setIsDetailModalOpen(true);
  }, [loadDetailData]);

  const handleCloseDetail = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedProjectDetail(null);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Risk Capture Verification"
          description="Review dan verifikasi risk capture data berdasarkan readiness categories dan items dari setiap project"
          icon="Shield"
        />
        <div className="py-12">
          <LoadingSpinner />
          <p className="text-center text-gray-500 mt-4">
            Memuat data risk capture...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Capture Verification"
        description="Review dan verifikasi risk capture data berdasarkan readiness categories dan items dari setiap project"
        icon="Shield"
      />

      {/* Summary Cards */}
      <RiskCaptureStatsCards statistics={statistics} />

      {/* Search */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari berdasarkan nama project..."
              className="pl-10 h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Capture Summary Table</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorBoundary>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <FileX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm
                    ? "Tidak ada project yang ditemukan dengan kriteria pencarian"
                    : "Tidak ada project dengan data risk capture"}
                </p>
              </div>
            ) : (
              <VirtualizedProjectTable
                projects={filteredProjects}
                onViewDetail={handleViewDetail}
              />
            )}
          </ErrorBoundary>
        </CardContent>
      </Card>

      {/* Detail Modal with Suspense for lazy loading */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProjectRiskDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetail}
          projectDetail={selectedProjectDetail}
        />
      </Suspense>
    </div>
  );
};

export default RiskCaptureVerificationOptimized;
