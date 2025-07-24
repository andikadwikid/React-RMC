import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import type {
  TimelineMilestone,
  MilestoneStatus,
  TimelineCardProps,
} from "@/types";

export function TimelineCard({ milestone }: TimelineCardProps) {
  const getDuration = () => {
    const start = new Date(milestone.startDate);
    const end = new Date(milestone.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="mb-6">
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {milestone.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
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
