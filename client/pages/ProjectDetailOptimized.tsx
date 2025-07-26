import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { ProjectDetailHeader } from "@/components/project/ProjectDetailHeader";
import { ProjectQuickStats } from "@/components/project/ProjectQuickStats";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ProjectReadinessForm } from "@/components/project/ProjectReadinessForm";
import { ProjectReadinessResults } from "@/components/project/ProjectReadinessResults";
import { RiskCaptureForm } from "@/components/project/RiskCaptureForm";

// Memoized tabs content components
const ProjectDetails = React.memo(({ project }: { project: any }) => (
  <div>Project Details Content</div>
));

const ProjectTimeline = React.memo(({ project }: { project: any }) => (
  <div>Project Timeline Content</div>
));

const ProjectFinancial = React.memo(({ project }: { project: any }) => (
  <div>Project Financial Content</div>
));

ProjectDetails.displayName = "ProjectDetails";
ProjectTimeline.displayName = "ProjectTimeline";
ProjectFinancial.displayName = "ProjectFinancial";

export default function ProjectDetailOptimized() {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    project,
    isLoading,
    activeTab,
    readinessStatus,
    stats,
    setActiveTab,
    refreshReadinessStatus,
    canEditReadiness,
  } = useProjectDetail(projectId);

  // Modal states
  const [readinessForm, setReadinessForm] = useState({
    isOpen: false,
    projectId: "",
    projectName: "",
  });

  const [readinessResults, setReadinessResults] = useState({
    isOpen: false,
    projectId: "",
    projectName: "",
  });

  const [riskCaptureForm, setRiskCaptureForm] = useState({
    isOpen: false,
    projectId: "",
    projectName: "",
  });

  // Memoized handlers
  const openReadinessForm = useCallback(() => {
    if (project) {
      setReadinessForm({
        isOpen: true,
        projectId: project.id,
        projectName: project.name,
      });
    }
  }, [project]);

  const openReadinessResults = useCallback(() => {
    if (project) {
      setReadinessResults({
        isOpen: true,
        projectId: project.id,
        projectName: project.name,
      });
    }
  }, [project]);

  const openRiskCaptureForm = useCallback(() => {
    if (project) {
      setRiskCaptureForm({
        isOpen: true,
        projectId: project.id,
        projectName: project.name,
      });
    }
  }, [project]);

  const closeReadinessForm = useCallback(() => {
    setReadinessForm({
      isOpen: false,
      projectId: "",
      projectName: "",
    });
  }, []);

  const closeReadinessResults = useCallback(() => {
    setReadinessResults({
      isOpen: false,
      projectId: "",
      projectName: "",
    });
  }, []);

  const closeRiskCaptureForm = useCallback(() => {
    setRiskCaptureForm({
      isOpen: false,
      projectId: "",
      projectName: "",
    });
  }, []);

  const handleReadinessSave = useCallback((data: any) => {
    console.log("Readiness data saved for project:", project?.id, data);
    closeReadinessForm();
    refreshReadinessStatus();
    toast.success("Project Readiness assessment berhasil disimpan!");
  }, [project?.id, closeReadinessForm, refreshReadinessStatus]);

  const handleRiskCaptureSave = useCallback((data: any) => {
    console.log("Risk capture data saved for project:", project?.id, data);
    closeRiskCaptureForm();
    toast.success("Risk Assessment berhasil disimpan!");
  }, [project?.id, closeRiskCaptureForm]);

  if (isLoading || !project || !stats) {
    return <LoadingSpinner message="Loading project details..." />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <ProjectDetailHeader project={project} />

      {/* Quick Stats */}
      <ProjectQuickStats progress={project.progress} stats={stats} />

      {/* Main Content - Responsive Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-4 min-w-[320px]">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs sm:text-sm">
              Details
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs sm:text-sm">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="financial" className="text-xs sm:text-sm">
              Financial
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <ProjectOverview project={project} />
        </TabsContent>

        <TabsContent value="details" className="space-y-4 sm:space-y-6">
          <ProjectDetails project={project} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4 sm:space-y-6">
          <ProjectTimeline project={project} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 sm:space-y-6">
          <ProjectFinancial project={project} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ProjectReadinessResults
        isOpen={readinessResults.isOpen}
        onClose={closeReadinessResults}
        projectId={readinessResults.projectId}
        projectName={readinessResults.projectName}
        onEdit={openReadinessForm}
      />

      <ProjectReadinessForm
        isOpen={readinessForm.isOpen}
        onClose={closeReadinessForm}
        projectId={readinessForm.projectId}
        projectName={readinessForm.projectName}
        onSave={handleReadinessSave}
      />

      <RiskCaptureForm
        isOpen={riskCaptureForm.isOpen}
        onClose={closeRiskCaptureForm}
        projectId={riskCaptureForm.projectId}
        projectName={riskCaptureForm.projectName}
        onSave={handleRiskCaptureSave}
      />
    </div>
  );
}
