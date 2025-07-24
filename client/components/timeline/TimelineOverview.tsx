import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
} from "lucide-react";
import { formatDate } from "@/utils/formatters";
import type { TimelineMilestone, TimelineOverviewProps } from "@/types";

// Extended props for this specific component
interface ExtendedTimelineOverviewProps extends TimelineOverviewProps {
  projectStartDate: string;
  projectEndDate: string;
  className?: string;
}

export function TimelineOverview({
  timeline,
  projectStartDate,
  projectEndDate,
  className = "",
}: TimelineOverviewProps) {
  const completedMilestones = timeline.filter(
    (m) => m.status === "completed",
  ).length;
  const inProgressMilestones = timeline.filter(
    (m) => m.status === "in-progress",
  ).length;
  const blockedMilestones = timeline.filter(
    (m) => m.status === "blocked",
  ).length;
  const pendingMilestones = timeline.filter(
    (m) => m.status === "pending",
  ).length;

  const totalMilestones = timeline.length;
  const progressPercentage = totalMilestones
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;

  const projectDuration = Math.ceil(
    (new Date(projectEndDate).getTime() -
      new Date(projectStartDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (new Date(projectEndDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  const overdueCount = timeline.filter((milestone) => {
    const today = new Date();
    const endDate = new Date(milestone.endDate);
    return (
      milestone.status !== "completed" &&
      endDate < today &&
      milestone.status !== "blocked"
    );
  }).length;

  const getHealthStatus = () => {
    if (blockedMilestones > 0 || overdueCount > 0) return "critical";
    if (progressPercentage < 50 && daysRemaining < projectDuration * 0.3)
      return "warning";
    return "healthy";
  };

  const healthStatus = getHealthStatus();

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Progress Overview */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Project Progress Overview
              </CardTitle>
              <Badge
                className={`${
                  healthStatus === "healthy"
                    ? "bg-green-100 text-green-800"
                    : healthStatus === "warning"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {healthStatus === "healthy"
                  ? "On Track"
                  : healthStatus === "warning"
                    ? "At Risk"
                    : "Critical"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Overall Progress
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {progressPercentage}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3 mb-1" />
                <div className="text-xs text-gray-500">
                  {completedMilestones} of {totalMilestones} milestones
                  completed
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">Start Date:</span>
                  </div>
                  <span className="font-medium block pl-6">
                    {formatDate(projectStartDate, "dd MMM yyyy")}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600">End Date:</span>
                  </div>
                  <span className="font-medium block pl-6">
                    {formatDate(projectEndDate, "dd MMM yyyy")}
                  </span>
                </div>
              </div>

              {/* Timeline health indicators */}
              {(overdueCount > 0 || blockedMilestones > 0) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800 text-sm font-medium mb-1">
                    <AlertCircle className="w-4 h-4" />
                    Timeline Issues
                  </div>
                  <div className="text-xs text-red-700 space-y-1">
                    {overdueCount > 0 && (
                      <div>• {overdueCount} overdue milestones</div>
                    )}
                    {blockedMilestones > 0 && (
                      <div>• {blockedMilestones} blocked milestones</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestone Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Milestone Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Milestones</span>
                <span className="font-bold text-lg">{totalMilestones}</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="font-bold text-green-600">
                    {completedMilestones}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">In Progress</span>
                  </div>
                  <span className="font-bold text-blue-600">
                    {inProgressMilestones}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Blocked</span>
                  </div>
                  <span className="font-bold text-red-600">
                    {blockedMilestones}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="font-bold text-gray-600">
                    {pendingMilestones}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project Duration:</span>
                    <span className="font-medium">{projectDuration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Remaining:</span>
                    <span
                      className={`font-medium ${
                        daysRemaining < 30
                          ? "text-red-600"
                          : daysRemaining < 60
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {daysRemaining}
                    </span>
                  </div>
                  {overdueCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-red-600">Overdue Items:</span>
                      <span className="font-medium text-red-600">
                        {overdueCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
