// Data loader utility for dashboard and project JSON files
import performanceData from "../data/dashboard/performance.json";
import riskCategoriesData from "../data/dashboard/risk-categories.json";
import geographicData from "../data/dashboard/geographic.json";
import dashboardRiskCaptureData from "../data/dashboard/dashboard-risk-capture.json";
import invoiceStatusData from "../data/dashboard/invoice-status.json";
import agingReceivablesData from "../data/dashboard/aging-receivables.json";
import projectsData from "../data/project/projects.json";
import projectDetailsData from "../data/project/project-details.json";
import projectCategoriesData from "../data/project/project-categories.json";
import projectReadinessData from "../data/project/project-readiness.json";
import projectRiskCaptureData from "../data/project/project-risk-capture.json";
import verificationAssignmentsData from "../data/verification/verification-assignments.json";
import verificationActivitiesData from "../data/verification/verification-activities.json";
import riskCaptureVerificationAssignmentsData from "../data/verification/risk-capture-verification-assignments.json";
import riskCaptureVerificationActivitiesData from "../data/verification/risk-capture-verification-activities.json";
import verifierWorkloadData from "../data/verification/verifier-workload.json";
import verificationSummaryData from "../data/verification/verification-summary.json";
import submissionTrackingData from "../data/verification/submission-tracking.json";
import {
  Target,
  Building,
  DollarSign,
  Gavel,
  FileText,
  Leaf,
  Cpu,
  Users,
} from "lucide-react";

// Icon mapping for risk categories
const iconMap = {
  Target,
  Building,
  DollarSign,
  Gavel,
  FileText,
  Leaf,
  Cpu,
  Users,
};

export const loadPerformanceData = () => {
  return performanceData;
};

export const loadRiskCategoriesData = () => {
  // Add icon components to the data
  const processedData = {
    yearly: {},
    quarterly: {},
  };

  Object.keys(riskCategoriesData.yearly).forEach((year) => {
    processedData.yearly[year] = riskCategoriesData.yearly[year].map(
      (category) => ({
        ...category,
        icon: iconMap[category.icon as keyof typeof iconMap],
      }),
    );
  });

  Object.keys(riskCategoriesData.quarterly).forEach((quarter) => {
    processedData.quarterly[quarter] = riskCategoriesData.quarterly[
      quarter
    ].map((category) => ({
      ...category,
      icon: iconMap[category.icon as keyof typeof iconMap],
    }));
  });

  return processedData;
};

export const loadGeographicData = () => {
  return geographicData;
};

export const loadRiskCaptureData = () => {
  return dashboardRiskCaptureData;
};

export const loadInvoiceStatusData = () => {
  return invoiceStatusData;
};

export const loadAgingReceivablesData = () => {
  return agingReceivablesData;
};

// Project data loaders
export const loadProjectsData = () => {
  return projectsData;
};

export const loadProjectDetailsData = () => {
  return projectDetailsData;
};

export const loadProjectCategoriesData = () => {
  return projectCategoriesData;
};

// Helper function to get a single project by ID
export const getProjectById = (projectId: string) => {
  // First try to find in projects.json (which has the updated structure)
  const projectFromList = projectsData.projects.find(
    (project) => project.id === projectId,
  );

  if (projectFromList) {
    // Look for additional details in project-details.json using UUID
    const additionalDetails = projectDetailsData.projectDetails[projectId];

    // Merge data if additional details exist
    if (additionalDetails) {
      return {
        ...projectFromList,
        ...additionalDetails,
        // Ensure UUID takes precedence over old ID
        id: projectFromList.id,
      };
    }

    return projectFromList;
  }

  return null;
};

// Helper function to get all projects list
export const getAllProjects = () => {
  return projectsData.projects;
};

// Readiness data loaders
export const loadProjectReadinessData = () => {
  return projectReadinessData;
};

export const getReadinessTemplate = () => {
  return projectReadinessData.readinessTemplate;
};

export const getProjectReadiness = (projectId: string) => {
  return (
    projectReadinessData.project_readiness.find(
      (readiness) => readiness.project_id === projectId,
    ) || null
  );
};

export const getProjectReadinessItems = (projectId: string) => {
  const readiness = getProjectReadiness(projectId);
  if (!readiness) return [];

  return projectReadinessData.readiness_items.filter(
    (item) => item.readiness_id === readiness.id,
  );
};

// Risk capture data loaders
export const loadProjectRiskCaptureData = () => {
  return projectRiskCaptureData;
};

export const getProjectRiskCapture = (projectId: string) => {
  return (
    projectRiskCaptureData.risk_captures.find(
      (riskCapture) => riskCapture.project_id === projectId,
    ) || null
  );
};

// Helper functions to get project status synchronized with readiness and risk capture
export const getProjectReadinessStatus = (projectId: string) => {
  const readiness = getProjectReadiness(projectId);
  if (!readiness) {
    return {
      status: "not-started",
      score: 0,
    };
  }

  // Calculate completion percentage based on readiness items
  const readinessItems = projectReadinessData.readiness_items.filter(
    (item) => item.readiness_id === readiness.id,
  );
  const totalItems = readinessItems.length;
  const completedItems = readinessItems.filter(
    (item) => item.user_status === "lengkap",
  ).length;
  const partialItems = readinessItems.filter(
    (item) => item.user_status === "parsial",
  ).length;

  const score =
    totalItems > 0
      ? Math.round((completedItems * 100 + partialItems * 50) / totalItems)
      : 0;

  return {
    status:
      readiness.status === "verified"
        ? "completed"
        : readiness.status === "submitted"
          ? "in-progress"
          : "not-started",
    score: score,
  };
};

export const getProjectRiskCaptureStatus = (projectId: string) => {
  const riskCapture = getProjectRiskCapture(projectId);
  if (!riskCapture) {
    return {
      status: "not-started",
      score: 0,
    };
  }

  // Calculate score based on risk level distribution
  const total = Object.values(riskCapture.risk_level_distribution).reduce(
    (sum, count) => sum + count,
    0,
  );
  const lowRisk =
    riskCapture.risk_level_distribution.sangatRendah +
    riskCapture.risk_level_distribution.rendah;
  const score = total > 0 ? Math.round((lowRisk / total) * 100) : 0;

  return {
    status:
      riskCapture.status === "verified"
        ? "completed"
        : riskCapture.status === "submitted" ||
            riskCapture.status === "under_review"
          ? "in-progress"
          : "not-started",
    score: score,
  };
};

// Helper function to get synchronized project data with readiness and risk capture status
export const getProjectsWithStatus = () => {
  return projectsData.projects.map((project) => {
    const readinessStatus = getProjectReadinessStatus(project.id);
    const riskCaptureStatus = getProjectRiskCaptureStatus(project.id);

    return {
      ...project,
      readinessStatus: readinessStatus.status,
      readinessScore: readinessStatus.score,
      riskCaptureStatus: riskCaptureStatus.status,
      riskCaptureScore: riskCaptureStatus.score,
    };
  });
};

// Verification data loaders
export const loadVerificationAssignments = () => {
  return verificationAssignmentsData;
};

export const loadVerificationActivities = () => {
  return verificationActivitiesData;
};

export const loadRiskCaptureVerificationAssignments = () => {
  return riskCaptureVerificationAssignmentsData;
};

export const loadRiskCaptureVerificationActivities = () => {
  return riskCaptureVerificationActivitiesData;
};

export const loadVerifierWorkload = () => {
  return verifierWorkloadData;
};

export const loadVerificationSummary = () => {
  return verificationSummaryData;
};

export const loadSubmissionTracking = () => {
  return submissionTrackingData;
};

// Helper functions for verification
export const getVerificationAssignmentsByVerifier = (verifierId: string) => {
  return verificationAssignmentsData.verification_assignments.filter(
    (assignment) => assignment.assigned_to === verifierId,
  );
};

export const getRiskCaptureVerificationAssignmentsByVerifier = (
  verifierId: string,
) => {
  return riskCaptureVerificationAssignmentsData.risk_capture_verification_assignments.filter(
    (assignment) => assignment.assigned_to === verifierId,
  );
};

export const getVerificationActivitiesByReadiness = (readinessId: string) => {
  return verificationActivitiesData.verification_activities.filter(
    (activity) => activity.readiness_id === readinessId,
  );
};

export const getRiskCaptureVerificationActivitiesByCapture = (
  riskCaptureId: string,
) => {
  return riskCaptureVerificationActivitiesData.risk_capture_verification_activities.filter(
    (activity) => activity.risk_capture_id === riskCaptureId,
  );
};

export const getReadinessSubmissionsByStatus = (status?: string) => {
  const submissions = submissionTrackingData.readiness_submissions;
  return status ? submissions.filter((s) => s.status === status) : submissions;
};

export const getRiskCaptureSubmissionsByStatus = (status?: string) => {
  const submissions = submissionTrackingData.risk_capture_submissions;
  return status ? submissions.filter((s) => s.status === status) : submissions;
};
