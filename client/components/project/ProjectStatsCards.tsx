import { Card, CardContent } from "@/components/ui/card";
import { Building2, Clock, CheckCircle, DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { ProjectStats } from "@/hooks/project";

interface ProjectStatsCardsProps {
  stats: ProjectStats;
}

export function ProjectStatsCards({ stats }: ProjectStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs lg:text-sm font-medium text-gray-600">
                Total Project
              </p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">
                {stats.total}
              </p>
            </div>
            <Building2 className="h-6 w-6 lg:h-8 lg:w-8 text-blue-500 flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs lg:text-sm font-medium text-gray-600">
                Aktif
              </p>
              <p className="text-xl lg:text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-green-500 flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs lg:text-sm font-medium text-gray-600">
                Selesai
              </p>
              <p className="text-xl lg:text-2xl font-bold text-blue-600">
                {stats.completed}
              </p>
            </div>
            <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-blue-500 flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs lg:text-sm font-medium text-gray-600">
                Total Budget
              </p>
              <p className="text-base lg:text-lg font-bold text-purple-600 break-words">
                {formatCurrency(stats.totalBudget)}
              </p>
            </div>
            <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-purple-500 flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
