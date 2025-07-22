import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  MoreVertical,
  Edit2,
} from "lucide-react";
import { formatDate } from "@/utils/formatters";
import type { TimelineMilestone, MilestoneStatus } from "@/types";

interface TimelineCardProps {
  milestone: TimelineMilestone;
  isLast: boolean;
  onEdit?: (milestone: TimelineMilestone) => void;
  onStatusChange?: (
    milestone: TimelineMilestone,
    status: MilestoneStatus,
  ) => void;
}

export function TimelineCard({
  milestone,
  isLast,
  onEdit,
  onStatusChange,
}: TimelineCardProps) {
  const getDuration = () => {
    const start = new Date(milestone.startDate);
    const end = new Date(milestone.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="mb-6">
      <Card className="hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {milestone.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                {milestone.description}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(milestone)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <div>
                <span className="text-gray-600">Start:</span>
                <span className="ml-1 font-medium">
                  {formatDate(milestone.startDate, "dd MMM yyyy")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <div>
                <span className="text-gray-600">End:</span>
                <span className="ml-1 font-medium">
                  {formatDate(milestone.endDate, "dd MMM yyyy")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <div>
                <span className="text-gray-600">Assignee:</span>
                <span className="ml-1 font-medium">
                  {milestone.assignee}
                </span>
              </div>
            </div>
          </div>

          {/* Duration info */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Duration:{" "}
                <span className="font-medium">{getDuration()} days</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
