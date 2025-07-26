import { Badge } from "@/components/ui/badge";
import { useStatusConfig } from "@/hooks/useStatusConfig";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { getStatusConfig } = useStatusConfig();
  
  const config = getStatusConfig(status);
  if (!config) return null;

  const IconComponent = config.icon;
  
  return (
    <Badge className={`${config.color} ${className || ""}`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
