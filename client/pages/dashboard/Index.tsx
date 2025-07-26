import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  PieChart,
  Shield,
  Activity,
  FileText,
  Users,
  DollarSign,
  MapPin,
  Clock,
} from "lucide-react";

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

// Simple types for this dashboard
interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalRevenue: number;
  riskItems: number;
  provinces: number;
}

interface RecentActivity {
  id: string;
  title: string;
  time: string;
  type: "project" | "risk" | "finance";
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalBudget: 0,
    totalRevenue: 0,
    riskItems: 0,
    provinces: 0,
  });

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: "1",
      title: "Project Alpha - New risk assessment submitted",
      time: "2 jam yang lalu",
      type: "risk",
    },
    {
      id: "2",
      title: "Project Beta - Payment received",
      time: "4 jam yang lalu",
      type: "finance",
    },
    {
      id: "3",
      title: "Project Gamma - Phase 1 completed",
      time: "1 hari yang lalu",
      type: "project",
    },
    {
      id: "4",
      title: "Project Delta - Risk mitigation approved",
      time: "2 hari yang lalu",
      type: "risk",
    },
    {
      id: "5",
      title: "Project Echo - New project initiated",
      time: "3 hari yang lalu",
      type: "project",
    },
  ]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalProjects: 24,
        activeProjects: 18,
        completedProjects: 6,
        totalBudget: 15000000000, // 15 Billion IDR
        totalRevenue: 12500000000, // 12.5 Billion IDR
        riskItems: 45,
        provinces: 12,
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Format currency to IDR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format currency short
  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}M`;
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}JT`;
    }
    return formatCurrency(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project":
        return <BarChart3 className="w-4 h-4 text-blue-500" />;
      case "risk":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "finance":
        return <DollarSign className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "project":
        return "border-l-blue-500";
      case "risk":
        return "border-l-red-500";
      case "finance":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dashboard Management Risiko
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Monitor dan kelola risiko proyek secara real-time
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="sm:hidden">
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </Badge>
              <Button size="sm" className="hidden sm:flex">
                <FileText className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Projects */}
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-blue-100 text-sm font-medium">Total Proyek</p>
                  {isLoading ? (
                    <div className="h-8 bg-blue-400 rounded animate-pulse mt-2"></div>
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold mt-1">
                      {stats.totalProjects}
                    </p>
                  )}
                  <p className="text-blue-200 text-xs mt-1">
                    Seluruh proyek aktif
                  </p>
                </div>
                <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-200 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* Active Projects */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-green-100 text-sm font-medium">Proyek Berjalan</p>
                  {isLoading ? (
                    <div className="h-8 bg-green-400 rounded animate-pulse mt-2"></div>
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold mt-1">
                      {stats.activeProjects}
                    </p>
                  )}
                  <p className="text-green-200 text-xs mt-1">
                    {!isLoading && Math.round((stats.activeProjects / stats.totalProjects) * 100)}% dari total
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-green-200 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* Completed Projects */}
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-purple-100 text-sm font-medium">Proyek Selesai</p>
                  {isLoading ? (
                    <div className="h-8 bg-purple-400 rounded animate-pulse mt-2"></div>
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold mt-1">
                      {stats.completedProjects}
                    </p>
                  )}
                  <p className="text-purple-200 text-xs mt-1">
                    {!isLoading && Math.round((stats.completedProjects / stats.totalProjects) * 100)}% completion rate
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-purple-200 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-amber-100 text-sm font-medium">Total Revenue</p>
                  {isLoading ? (
                    <div className="h-8 bg-amber-400 rounded animate-pulse mt-2"></div>
                  ) : (
                    <p className="text-xl sm:text-2xl font-bold mt-1">
                      {formatCurrencyShort(stats.totalRevenue)}
                    </p>
                  )}
                  <p className="text-amber-200 text-xs mt-1">
                    Revenue terealisasi
                  </p>
                </div>
                <DollarSign className="h-10 w-10 sm:h-12 sm:w-12 text-amber-200 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Risk Items */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-red-500" />
                    <p className="text-sm font-medium text-gray-600">Risk Items</p>
                  </div>
                  {isLoading ? (
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-xl font-bold text-gray-900">
                      {stats.riskItems}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Butuh perhatian
                  </p>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Budget Utilization */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <PieChart className="w-4 h-4 text-blue-500" />
                    <p className="text-sm font-medium text-gray-600">Budget Used</p>
                  </div>
                  {isLoading ? (
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-xl font-bold text-gray-900">
                      {Math.round((stats.totalRevenue / stats.totalBudget) * 100)}%
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {!isLoading && formatCurrencyShort(stats.totalBudget)} total
                  </p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  On Track
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Geographic Coverage */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <p className="text-sm font-medium text-gray-600">Provinsi</p>
                  </div>
                  {isLoading ? (
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-xl font-bold text-gray-900">
                      {stats.provinces}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Coverage area
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  National
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
              </div>
              <Button variant="outline" size="sm">
                <Clock className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`border-l-4 pl-4 py-3 hover:bg-gray-50 transition-colors duration-200 rounded-r ${getBorderColor(activity.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium">View Projects</p>
                  <p className="text-xs text-gray-500">Manage all projects</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-red-500" />
                <div className="text-left">
                  <p className="font-medium">Risk Assessment</p>
                  <p className="text-xs text-gray-500">Review risk items</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-500" />
                <div className="text-left">
                  <p className="font-medium">Generate Report</p>
                  <p className="text-xs text-gray-500">Export dashboard data</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-500" />
                <div className="text-left">
                  <p className="font-medium">Team Management</p>
                  <p className="text-xs text-gray-500">Manage team access</p>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
