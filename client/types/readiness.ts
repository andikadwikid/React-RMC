import { BaseEntity, ReadinessStatus, VerificationStatus } from "./base";
import { RiskItem } from "./risk";

// =============================================================================
// PROJECT READINESS TYPES
// =============================================================================

export interface ReadinessItem {
  id: string;
  category: string;
  item: string;
  userStatus: ReadinessStatus;
  verifierStatus?: ReadinessStatus;
  userComment?: string;
  verifierComment?: string;
  verifierName?: string;
  verifiedAt?: string;
  riskCapture?: RiskItem[];
}

export interface ReadinessCategory {
  id: string;
  name: string;
  items: string[];
}

export interface ProjectReadiness extends BaseEntity {
  projectId: string;
  projectName: string;
  submittedBy: string;
  submittedAt: string;
  items: ReadinessItem[];
  status: VerificationStatus;
  verifierName?: string;
  verifiedAt?: string;
  overallComment?: string;
}

// =============================================================================
// READINESS COMPONENT PROPS
// =============================================================================

export interface ProjectReadinessFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onSave: (data: any) => void;
}

export interface ProjectReadinessFormWithFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onSave: (data: any) => void;
}

export interface ProjectReadinessVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: ProjectReadiness;
  onSave: (submissionId: string, data: any) => void;
}
