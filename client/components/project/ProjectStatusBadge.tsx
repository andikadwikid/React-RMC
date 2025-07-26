import { Badge } from "@/components/ui/badge";
import { useProjectBadges } from "@/hooks/project";
import type { Project } from "@/types";

interface ProjectStatusBadgeProps {
  progress: number;
  className?: string;
}

export function ProjectStatusBadge({ progress, className }: ProjectStatusBadgeProps) {
  const { getStatusConfig } = useProjectBadges();
  const config = getStatusConfig(progress);
  const IconComponent = config.icon;

  return (
    <Badge className={`${config.color} ${className || ""}`}>
      {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
}

interface RiskBadgeProps {
  riskScore?: number;
  className?: string;
}

export function RiskBadge({ riskScore, className }: RiskBadgeProps) {
  const { getRiskConfig } = useProjectBadges();
  const config = getRiskConfig(riskScore);

  return (
    <Badge className={`${config.color} ${className || ""}`}>
      {config.label}
    </Badge>
  );
}

interface VerificationBadgeProps {
  projectId: string;
  className?: string;
}

export function VerificationBadge({ projectId, className }: VerificationBadgeProps) {
  const { getVerificationConfig } = useProjectBadges();
  const config = getVerificationConfig(projectId);

  return (
    <Badge className={`${config.color} ${className || ""}`}>
      {config.label}
    </Badge>
  );
}

interface ReadinessBadgeProps {
  status?: Project["readinessStatus"];
  score?: number;
  className?: string;
}

export function ReadinessBadge({ status, score, className }: ReadinessBadgeProps) {
  const { getReadinessConfig } = useProjectBadges();
  const config = getReadinessConfig(status);
  const IconComponent = config.icon;

  return (
    <div className={`space-y-1 ${className || ""}`}>
      <Badge className={config.color}>
        {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
        {config.label}
      </Badge>
      {score !== undefined && (
        <div className="text-xs text-gray-600">{score}% ready</div>
      )}
    </div>
  );
}

interface RiskCaptureBadgeProps {
  status?: Project["riskCaptureStatus"];
  score?: number;
  className?: string;
}

export function RiskCaptureBadge({ status, score, className }: RiskCaptureBadgeProps) {
  const { getRiskCaptureConfig } = useProjectBadges();
  const config = getRiskCaptureConfig(status);
  const IconComponent = config.icon;

  return (
    <div className={`space-y-1 ${className || ""}`}>
      <Badge className={config.color}>
        {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
        {config.label}
      </Badge>
      {score !== undefined && (
        <div className="text-xs text-gray-600">{score}% captured</div>
      )}
    </div>
  );
}
