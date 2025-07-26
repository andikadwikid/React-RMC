import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Clock } from "lucide-react";
import type { ProjectDetailStats } from "@/hooks/project";

interface ProjectQuickStatsProps {
  progress: number;
  stats: ProjectDetailStats;
}

export function ProjectQuickStats({ progress, stats }: ProjectQuickStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                {progress}%
              </p>
            </div>
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          </div>
          <Progress value={progress} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Budget Used</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {stats.budgetUsedPercentage.toFixed(1)}%
              </p>
            </div>
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
          </div>
          <Progress value={stats.budgetUsedPercentage} className="mt-2" />
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 lg:col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Time Elapsed</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">
                {stats.timeElapsedPercentage.toFixed(1)}%
              </p>
            </div>
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
          </div>
          <Progress value={stats.timeElapsedPercentage} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
