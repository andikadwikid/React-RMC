import React, { ReactNode } from "react";

// =============================================================================
// CORE BASE TYPES
// =============================================================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// =============================================================================
// COMMON ENUMS & UTILITY TYPES
// =============================================================================

export type ProjectStatus = "planning" | "running" | "on-hold" | "completed";
export type RiskLevel = "low" | "medium" | "high";
export type Priority = "low" | "medium" | "high" | "critical";
export type MilestoneStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "blocked";
export type EntityStatus = "active" | "inactive";
export type ReadinessStatus = "lengkap" | "parsial" | "tidak_tersedia";
export type RiskVerificationStatus = "pending" | "approved" | "rejected";
export type VerificationStatus =
  | "not_submitted"
  | "submitted"
  | "under_review"
  | "verified"
  | "needs_revision";
export type PeriodType = "yearly" | "quarterly";

// =============================================================================
// FILTER & SEARCH TYPES
// =============================================================================

export interface FilterOptions {
  search?: string;
  status?: string;
  category?: string;
  province?: string;
  riskLevel?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// Import VariantProps for components that need it
export type { VariantProps } from "class-variance-authority";
