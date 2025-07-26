import {
  CheckCircle,
  Clock,
  Eye,
  AlertTriangle,
} from "lucide-react";

export interface StatusConfig {
  label: string;
  color: string;
  icon: React.ComponentType<any>;
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  submitted: {
    label: "Menunggu Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  under_review: {
    label: "Sedang Direview",
    color: "bg-blue-100 text-blue-800",
    icon: Eye,
  },
  verified: {
    label: "Terverifikasi",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  needs_revision: {
    label: "Perlu Revisi",
    color: "bg-red-100 text-red-800",
    icon: AlertTriangle,
  },
};

export const useStatusConfig = () => {
  const getStatusConfig = (status: string): StatusConfig | null => {
    return STATUS_CONFIG[status] || null;
  };

  return { getStatusConfig, STATUS_CONFIG };
};
