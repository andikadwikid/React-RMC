import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, CheckCircle, DollarSign } from "lucide-react";

export default function SimpleDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Monitor dan kelola risiko proyek secara real-time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Projects</p>
                <p className="text-3xl font-bold">24</p>
                <p className="text-blue-200 text-xs mt-1">+2 dari bulan lalu</p>
              </div>
              <BarChart3 className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Projects</p>
                <p className="text-3xl font-bold">18</p>
                <p className="text-green-200 text-xs mt-1">Sedang berjalan</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold">6</p>
                <p className="text-purple-200 text-xs mt-1">Selesai bulan ini</p>
              </div>
              <CheckCircle className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Total Budget</p>
                <p className="text-3xl font-bold">Rp 15M</p>
                <p className="text-amber-200 text-xs mt-1">Budget keseluruhan</p>
              </div>
              <DollarSign className="h-12 w-12 text-amber-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium">Project Alpha started</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-medium">Project Beta completed</p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="font-medium">Risk assessment pending</p>
              <p className="text-sm text-gray-500">2 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Planning</span>
                <Badge variant="outline">3 projects</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">In Progress</span>
                <Badge className="bg-blue-100 text-blue-800">15 projects</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completed</span>
                <Badge className="bg-green-100 text-green-800">6 projects</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">High Risk</span>
                <Badge className="bg-red-100 text-red-800">5 items</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Medium Risk</span>
                <Badge className="bg-yellow-100 text-yellow-800">12 items</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Low Risk</span>
                <Badge className="bg-green-100 text-green-800">28 items</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
