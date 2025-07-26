import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getProjectById, getProjectReadiness } from "@/utils/dataLoader";
import { formatCurrency } from "@/utils/formatters";
import type { Project } from "@/types";

export interface ProjectDetailStats {
  budgetUsedPercentage: number;
  remainingBudget: number;
  daysElapsed: number;
  totalDays: number;
  timeElapsedPercentage: number;
}

export interface UseProjectDetailReturn {
  project: Project | null;
  isLoading: boolean;
  activeTab: string;
  readinessStatus: string | null;
  stats: ProjectDetailStats | null;
  setActiveTab: (tab: string) => void;
  refreshReadinessStatus: () => void;
  generateReport: () => Promise<void>;
  isGeneratingReport: boolean;
  canEditReadiness: (status: string | null) => boolean;
}

export const useProjectDetail = (
  projectId: string | undefined,
): UseProjectDetailReturn => {
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [readinessStatus, setReadinessStatus] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Load project data
  useEffect(() => {
    if (projectId) {
      const foundProject = getProjectById(projectId);
      if (foundProject) {
        setProject(foundProject);
        const readinessData = getProjectReadiness(projectId);
        setReadinessStatus(readinessData?.status || null);
      } else {
        navigate("/projects");
      }
    }
    setIsLoading(false);
  }, [projectId, navigate]);

  // Refresh readiness status
  const refreshReadinessStatus = useCallback(() => {
    if (projectId) {
      const readinessData = getProjectReadiness(projectId);
      setReadinessStatus(readinessData?.status || null);
    }
  }, [projectId]);

  // Check if user can edit readiness
  const canEditReadiness = useCallback((status: string | null) => {
    return !status || status !== "verified";
  }, []);

  // Calculate project stats
  const stats = useMemo(() => {
    if (!project) return null;

    const startDate = project.start_date || project.startDate;
    const endDate = project.end_date || project.endDate;

    const budgetUsedPercentage = (project.spent / project.budget) * 100;
    const remainingBudget = project.budget - project.spent;

    const daysElapsed = Math.floor(
      (new Date().getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const totalDays = Math.floor(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const timeElapsedPercentage = (daysElapsed / totalDays) * 100;

    return {
      budgetUsedPercentage,
      remainingBudget,
      daysElapsed,
      totalDays,
      timeElapsedPercentage,
    };
  }, [project]);

  // Generate report
  const generateReport = useCallback(async () => {
    if (!project) return;

    setIsGeneratingReport(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const reportContent = `
PROJECT REPORT
==============

Project: ${project.name}
Client: ${project.client}
Project Manager: ${project.projectManager}
Category: ${project.category}

PROGRESS OVERVIEW
================
Overall Progress: ${project.progress}%
Budget Used: ${stats ? ((project.spent / project.budget) * 100).toFixed(1) : 0}%
Time Elapsed: ${stats ? stats.timeElapsedPercentage.toFixed(1) : 0}%

FINANCIAL SUMMARY
================
Total Budget: ${formatCurrency(project.budget)}
Amount Spent: ${formatCurrency(project.spent)}
Remaining Budget: ${formatCurrency(project.budget - project.spent)}

TIMELINE
========
Start Date: ${new Date(project.startDate).toLocaleDateString("id-ID")}
End Date: ${new Date(project.endDate).toLocaleDateString("id-ID")}
${project.timeline ? `\nMilestones: ${project.timeline.length} defined` : ""}

Report generated on: ${new Date().toLocaleDateString("id-ID")} ${new Date().toLocaleTimeString("id-ID")}
      `;

      const blob = new Blob([reportContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Project_Report_${project.id}_${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Report berhasil di-generate dan di-download!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Gagal generate report. Silakan coba lagi.");
    } finally {
      setIsGeneratingReport(false);
    }
  }, [project, stats]);

  return {
    project,
    isLoading,
    activeTab,
    readinessStatus,
    stats,
    setActiveTab,
    refreshReadinessStatus,
    generateReport,
    isGeneratingReport,
    canEditReadiness,
  };
};
