// Data loader utility for dashboard and project JSON files
import performanceData from '../data/performance.json';
import riskCategoriesData from '../data/risk-categories.json';
import geographicData from '../data/geographic.json';
import riskCaptureData from '../data/risk-capture.json';
import invoiceStatusData from '../data/invoice-status.json';
import agingReceivablesData from '../data/aging-receivables.json';
import projectsData from '../data/projects.json';
import projectDetailsData from '../data/project-details.json';
import projectCategoriesData from '../data/project-categories.json';
import projectReadinessData from '../data/project-readiness.json';
import riskCaptureData from '../data/risk-capture.json';
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
    quarterly: {}
  };
  
  Object.keys(riskCategoriesData.yearly).forEach(year => {
    processedData.yearly[year] = riskCategoriesData.yearly[year].map(category => ({
      ...category,
      icon: iconMap[category.icon as keyof typeof iconMap]
    }));
  });
  
  Object.keys(riskCategoriesData.quarterly).forEach(quarter => {
    processedData.quarterly[quarter] = riskCategoriesData.quarterly[quarter].map(category => ({
      ...category,
      icon: iconMap[category.icon as keyof typeof iconMap]
    }));
  });
  
  return processedData;
};

export const loadGeographicData = () => {
  return geographicData;
};

export const loadRiskCaptureData = () => {
  return riskCaptureData;
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
  return projectDetailsData.projectDetails[projectId] || null;
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
  return projectReadinessData.projectReadiness[projectId] || null;
};

// Risk capture data loaders
export const loadRiskCaptureData = () => {
  return riskCaptureData;
};

export const getProjectRiskCapture = (projectId: string) => {
  return riskCaptureData.riskCapture[projectId] || null;
};

// Helper functions to get project status synchronized with readiness and risk capture
export const getProjectReadinessStatus = (projectId: string) => {
  const readiness = getProjectReadiness(projectId);
  if (!readiness) {
    return {
      status: 'not-started',
      score: 0
    };
  }

  return {
    status: readiness.status === 'verified' ? 'completed' :
           readiness.status === 'submitted' ? 'in-progress' : 'not-started',
    score: readiness.completionPercentage
  };
};

export const getProjectRiskCaptureStatus = (projectId: string) => {
  const riskCapture = getProjectRiskCapture(projectId);
  if (!riskCapture) {
    return {
      status: 'not-started',
      score: 0
    };
  }

  // Calculate score based on risk level distribution
  const total = Object.values(riskCapture.riskLevelDistribution).reduce((sum, count) => sum + count, 0);
  const lowRisk = riskCapture.riskLevelDistribution.sangatRendah + riskCapture.riskLevelDistribution.rendah;
  const score = total > 0 ? Math.round((lowRisk / total) * 100) : 0;

  return {
    status: riskCapture.status === 'verified' ? 'completed' :
           riskCapture.status === 'submitted' || riskCapture.status === 'under_review' ? 'in-progress' : 'not-started',
    score: score
  };
};

// Helper function to get synchronized project data with readiness and risk capture status
export const getProjectsWithStatus = () => {
  return projectsData.projects.map(project => {
    const readinessStatus = getProjectReadinessStatus(project.id);
    const riskCaptureStatus = getProjectRiskCaptureStatus(project.id);

    return {
      ...project,
      readinessStatus: readinessStatus.status,
      readinessScore: readinessStatus.score,
      riskCaptureStatus: riskCaptureStatus.status,
      riskCaptureScore: riskCaptureStatus.score
    };
  });
};
