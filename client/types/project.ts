import { BaseEntity, MilestoneStatus } from "./base";

// =============================================================================
// PROJECT RELATED TYPES
// =============================================================================

export interface Project extends BaseEntity {
  name: string;
  description: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  province: string;
  projectManager: string;
  category: string;
  progress: number;
  lastUpdate: string;
  timeline?: TimelineMilestone[];
  readinessStatus?: "not-started" | "in-progress" | "completed";
  readinessScore?: number;
  riskCaptureStatus?: "not-started" | "in-progress" | "completed";
  riskCaptureScore?: number;
}

export interface TimelineMilestone extends BaseEntity {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  budget: string;
  startDate: string;
  endDate: string;
  province: string;
  projectManager: string;
  category: string;
  timeline: TimelineMilestone[];
}

// =============================================================================
// PROJECT SUMMARY & STATISTICS
// =============================================================================

export interface ProjectSummary {
  total: number;
  inProgress: number;
  completed: number;
}

// =============================================================================
// TIMELINE COMPONENT PROPS
// =============================================================================

export interface TimelineOverviewProps {
  timeline: TimelineMilestone[];
}

export interface TimelineCardProps {
  milestone: TimelineMilestone;
  index: number;
}

export interface TimelinePreviewProps {
  timeline: TimelineMilestone[];
}
