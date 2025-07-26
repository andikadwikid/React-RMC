import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  ClipboardCheck,
} from "lucide-react";
import type { Project } from "@/types";

export interface BadgeConfig {
  label: string;
  color: string;
  icon?: React.ComponentType<any>;
}

export const PROJECT_STATUS_CONFIG: Record<string, BadgeConfig> = {
  completed: {
    label: "Selesai",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  running: {
    label: "Berjalan",
    color: "bg-green-100 text-green-800",
    icon: Clock,
  },
  planning: {
    label: "Perencanaan",
    color: "bg-gray-100 text-gray-800",
    icon: AlertTriangle,
  },
};

export const RISK_STATUS_CONFIG: Record<string, BadgeConfig> = {
  low: {
    label: "Rendah",
    color: "bg-green-100 text-green-800",
  },
  medium: {
    label: "Sedang",
    color: "bg-yellow-100 text-yellow-800",
  },
  high: {
    label: "Tinggi",
    color: "bg-red-100 text-red-800",
  },
  not_assessed: {
    label: "Belum Dinilai",
    color: "bg-gray-100 text-gray-800",
  },
};

export const VERIFICATION_STATUS_CONFIG: Record<string, BadgeConfig> = {
  not_submitted: {
    label: "Belum Submit",
    color: "bg-gray-100 text-gray-800",
  },
  submitted: {
    label: "Menunggu Review",
    color: "bg-yellow-100 text-yellow-800",
  },
  under_review: {
    label: "Sedang Direview",
    color: "bg-blue-100 text-blue-800",
  },
  verified: {
    label: "Terverifikasi",
    color: "bg-green-100 text-green-800",
  },
  needs_revision: {
    label: "Perlu Revisi",
    color: "bg-red-100 text-red-800",
  },
};

export const READINESS_STATUS_CONFIG: Record<string, BadgeConfig> = {
  "not-started": {
    label: "Belum Mulai",
    color: "bg-red-100 text-red-800",
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800",
  },
  completed: {
    label: "Selesai",
    color: "bg-green-100 text-green-800",
  },
};

export const useProjectBadges = () => {
  const getStatusConfig = (progress: number): BadgeConfig => {
    const status = progress === 100 ? "completed" : progress > 0 ? "running" : "planning";
    return PROJECT_STATUS_CONFIG[status];
  };

  const getRiskConfig = (riskCaptureScore?: number): BadgeConfig => {
    let status: string;
    if (!riskCaptureScore || riskCaptureScore === 0) {
      status = "not_assessed";
    } else if (riskCaptureScore >= 80) {
      status = "low";
    } else if (riskCaptureScore >= 60) {
      status = "medium";
    } else {
      status = "high";
    }
    
    return RISK_STATUS_CONFIG[status];
  };

  const getVerificationConfig = (projectId: string): BadgeConfig => {
    // Mock verification statuses - in real app, this would come from API
    const mockStatuses: Record<string, string> = {
      "proj-001": "verified",
      "proj-002": "needs_revision",
      "proj-003": "under_review",
      "proj-004": "submitted",
      "proj-005": "verified",
    };

    const status = mockStatuses[projectId] || "not_submitted";
    return VERIFICATION_STATUS_CONFIG[status];
  };

  const getReadinessConfig = (status?: Project["readinessStatus"]): BadgeConfig => {
    if (!status) {
      return {
        label: "Belum Diisi",
        color: "bg-gray-100 text-gray-800",
        icon: ClipboardCheck,
      };
    }

    return READINESS_STATUS_CONFIG[status];
  };

  const getRiskCaptureConfig = (status?: Project["riskCaptureStatus"]): BadgeConfig => {
    if (!status) {
      return {
        label: "Belum Diisi",
        color: "bg-gray-100 text-gray-800",
        icon: Shield,
      };
    }

    return READINESS_STATUS_CONFIG[status];
  };

  return {
    getStatusConfig,
    getRiskConfig,
    getVerificationConfig,
    getReadinessConfig,
    getRiskCaptureConfig,
    PROJECT_STATUS_CONFIG,
    RISK_STATUS_CONFIG,
    VERIFICATION_STATUS_CONFIG,
    READINESS_STATUS_CONFIG,
  };
};
