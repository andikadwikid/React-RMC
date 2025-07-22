import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  MoreVertical,
  Clock,
  Edit2,
} from "lucide-react";
import { formatDate, formatRelativeTime } from "@/utils/formatters";
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

const getStatusIcon = (status: MilestoneStatus) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case "in-progress":
      return <Play className="w-5 h-5 text-blue-600" />;
    case "blocked":
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    case "pending":
      return <Pause className="w-5 h-5 text-gray-400" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
};

const getStatusBadge = (status: MilestoneStatus) => {
  const variants = {
    completed: "bg-green-100 text-green-800 border-green-200",
    "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
    blocked: "bg-red-100 text-red-800 border-red-200",
    pending: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const labels = {
    completed: "Completed",
    "in-progress": "In Progress",
    blocked: "Blocked",
    pending: "Pending",
  };

  return (
    <Badge className={`${variants[status]} border`}>{labels[status]}</Badge>
  );
};

const getStatusColor = (status: MilestoneStatus) => {
  switch (status) {
    case "completed":
      return "border-green-500 bg-white shadow-green-100";
    case "in-progress":
      return "border-blue-500 bg-white shadow-blue-100";
    case "blocked":
      return "border-red-500 bg-white shadow-red-100";
    case "pending":
      return "border-gray-400 bg-white shadow-gray-100";
    default:
      return "border-gray-400 bg-white shadow-gray-100";
  }
};

const getConnectorColor = (status: MilestoneStatus) => {
  switch (status) {
    case "completed":
      return "bg-gradient-to-b from-green-500 to-green-400";
    case "in-progress":
      return "bg-gradient-to-b from-blue-500 to-blue-400";
    case "blocked":
      return "bg-gradient-to-b from-red-500 to-red-400";
    case "pending":
      return "bg-gradient-to-b from-gray-300 to-gray-200";
    default:
      return "bg-gradient-to-b from-gray-300 to-gray-200";
  }
};

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

  const isOverdue = () => {
    const today = new Date();
    const endDate = new Date(milestone.endDate);
    return (
      milestone.status !== "completed" &&
      endDate < today &&
      milestone.status !== "blocked"
    );
  };

  return (
    <div className="relative">
      {/* Timeline connector line */}
      {!isLast && (
        <div className="absolute left-6 top-16 w-1 h-20">
          <div
            className={`w-full h-full ${getConnectorColor(milestone.status)} rounded-full shadow-sm relative`}
          >
            {/* Connector glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent"></div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-6">
        {/* Timeline dot */}
        <div className="relative flex-shrink-0">
          {/* Pulse animation for in-progress */}
          {milestone.status === "in-progress" && (
            <div className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping"></div>
          )}

          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full border-4 ${getStatusColor(milestone.status)} shadow-lg transition-all duration-200 hover:scale-110 relative z-10`}
          >
            {getStatusIcon(milestone.status)}
          </div>

          {/* Inner ring for better visual depth */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>

          {/* Outer glow for completed items */}
          {milestone.status === "completed" && (
            <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 blur-sm"></div>
          )}
        </div>

        {/* Milestone content */}
        <div className="flex-1 min-w-0">
          <Card className="hover:shadow-xl transition-all duration-300 group relative border-l-4 border-l-transparent hover:border-l-blue-200">
            {/* Connecting line to dot */}
            <div
              className={`absolute -left-6 top-8 w-6 h-0.5 transition-colors duration-200 ${
                milestone.status === "completed"
                  ? "bg-green-300"
                  : milestone.status === "in-progress"
                    ? "bg-blue-300"
                    : milestone.status === "blocked"
                      ? "bg-red-300"
                      : "bg-gray-300"
              }`}
            ></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {milestone.title}
                    </h3>
                    {isOverdue() && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        Overdue
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {getStatusBadge(milestone.status)}
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

              {/* Progress indicator for in-progress milestones */}
              {milestone.status === "in-progress" && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: "65%" }}
                    >
                      <div className="h-full bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Duration and status info */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Duration:{" "}
                    <span className="font-medium">{getDuration()} days</span>
                  </span>
                  <div className="flex items-center gap-4">
                    {milestone.status === "completed" && (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Completed {formatRelativeTime(milestone.endDate)}
                      </span>
                    )}
                    {milestone.status === "in-progress" && (
                      <span className="text-blue-600 font-medium flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        In progress
                      </span>
                    )}
                    {milestone.status === "blocked" && (
                      <span className="text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Blocked - needs attention
                      </span>
                    )}
                    {isOverdue() && (
                      <span className="text-red-600 font-medium">
                        {Math.ceil(
                          (new Date().getTime() -
                            new Date(milestone.endDate).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days overdue
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
