import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import type { TimelineMilestone, TimelinePreviewProps } from "@/types";

// Extended props for specific implementation
interface ExtendedTimelinePreviewProps extends TimelinePreviewProps {
  className?: string;
}

export function TimelinePreview({
  timeline,
  className = "",
}: TimelinePreviewProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        No timeline data
      </div>
    );
  }

  const completedMilestones = timeline.filter(
    (m) => m.status === "completed",
  ).length;
  const blockedMilestones = timeline.filter(
    (m) => m.status === "blocked",
  ).length;
  const totalMilestones = timeline.length;
  const progressPercentage = Math.round(
    (completedMilestones / totalMilestones) * 100,
  );

  const getHealthIcon = () => {
    if (blockedMilestones > 0) {
      return <AlertCircle className="w-3 h-3 text-red-500" />;
    }
    if (progressPercentage === 100) {
      return <CheckCircle className="w-3 h-3 text-green-500" />;
    }
    return <Clock className="w-3 h-3 text-blue-500" />;
  };

  const getHealthColor = () => {
    if (blockedMilestones > 0) return "text-red-600";
    if (progressPercentage === 100) return "text-green-600";
    return "text-blue-600";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <Progress value={progressPercentage} className="h-1.5 flex-1" />
        <span className={`text-xs font-medium ${getHealthColor()}`}>
          {progressPercentage}%
        </span>
      </div>

      {/* Status summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {getHealthIcon()}
          <span className="text-xs text-gray-600">
            {completedMilestones}/{totalMilestones} milestones
          </span>
        </div>

        {blockedMilestones > 0 && (
          <Badge className="bg-red-100 text-red-800 text-xs px-1 py-0">
            {blockedMilestones} blocked
          </Badge>
        )}
      </div>
    </div>
  );
}
