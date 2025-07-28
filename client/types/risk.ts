import React from "react";
import { BaseEntity, VerificationStatus } from "./base";

// =============================================================================
// RISK MANAGEMENT TYPES
// =============================================================================

export interface RiskCategory extends BaseEntity {
  name: string;
  icon: string;
  total: number;
  overdue: number;
  inProcess: number;
  closed: number;
}

export interface RiskItem extends BaseEntity {
  sasaran: string;
  peristiwaRisiko: string;
  sumberRisiko: string;
  dampakKualitatif: string;
  dampakKuantitatif: string;
  kontrolEksisting: string;
  verifierComment?: string;
  verifierName?: string;
  verifiedAt?: string;
  isVerified?: boolean;
}

export interface RiskCapture extends BaseEntity {
  projectId: string;
  projectName: string;
  submittedBy: string;
  submittedAt: string;
  totalRisks: number;
  status: VerificationStatus;
  verifierName?: string;
  verifiedAt?: string;
  overallComment?: string;
  risks: RiskItem[];
}

export interface RiskCaptureData {
  name: string;
  value: number;
  color: string;
}

// =============================================================================
// RISK COMPONENT PROPS
// =============================================================================

export interface RiskCaptureFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onSave: (data: any) => void;
}

export interface RiskCaptureVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: RiskCapture;
  onSave: (submissionId: string, data: any) => void;
}

export interface RiskCategoryDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    total: number;
    overdue: number;
    inProcess: number;
    closed: number;
  } | null;
}

export interface RiskCapturePieChartProps {
  data: RiskCaptureData[];
}
