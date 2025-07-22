import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Phone,
  Mail,
  FileText,
  GitBranch,
  ClipboardCheck,
  Shield,
  Edit,
  Eye,
  Activity,
  TrendingUp,
  Target,
  User,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Project } from "@/types";

// Mock data untuk demo - nanti bisa diganti dengan API call
const mockProjects: Project[] = [
  {
    id: "PRJ-001",
    name: "Sistem ERP Perusahaan",
    description: "Implementasi sistem ERP untuk mengelola seluruh operasional perusahaan termasuk inventory, HR, finance, dan CRM. Sistem ini akan mengintegrasikan semua departemen dalam satu platform yang unified.",
    client: "PT. Teknologi Maju",
    clientEmail: "contact@teknologimaju.com",
    clientPhone: "+62 21 1234 5678",
    budget: 2500000000,
    spent: 1800000000,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    province: "DKI Jakarta",
    projectManager: "Budi Santoso",
    category: "ERP System",
    progress: 72,
    lastUpdate: "2024-01-20",
    createdAt: "2024-01-10",
    timeline: [
      {
        id: "1",
        title: "Requirements Analysis",
        description: "Analisis kebutuhan sistem dan business process mapping",
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        createdAt: "2024-01-10",
      },
      {
        id: "2",
        title: "System Design",
        description: "Perancangan arsitektur sistem dan database design",
        startDate: "2024-02-16",
        endDate: "2024-03-15",
        createdAt: "2024-01-10",
      },
      {
        id: "3",
        title: "Development Phase 1",
        description: "Development module HR dan Finance",
        startDate: "2024-03-16",
        endDate: "2024-04-30",
        createdAt: "2024-01-10",
      },
      {
        id: "4",
        title: "Testing & QA",
        description: "Testing komprehensif dan quality assurance",
        startDate: "2024-05-01",
        endDate: "2024-05-30",
        createdAt: "2024-01-10",
      },
      {
        id: "5",
        title: "Deployment",
        description: "Deployment ke production dan user training",
        startDate: "2024-06-01",
        endDate: "2024-06-30",
        createdAt: "2024-01-10",
      },
    ],
  },
  {
    id: "PRJ-002",
    name: "Mobile Banking App",
    description: "Pengembangan aplikasi mobile banking dengan fitur lengkap untuk transaksi, transfer, pembayaran bills, dan investasi. Aplikasi akan tersedia untuk iOS dan Android.",
    client: "Bank Digital Nusantara",
    clientEmail: "tech@bankdigitalnusantara.co.id",
    clientPhone: "+62 21 9876 5432",
    budget: 1800000000,
    spent: 900000000,
    startDate: "2024-02-01",
    endDate: "2024-07-15",
    province: "DKI Jakarta",
    projectManager: "Sari Wijaya",
    category: "Mobile Development",
    progress: 45,
    lastUpdate: "2024-01-19",
    createdAt: "2024-01-25",
  },
];

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Simulate API call
    const foundProject = mockProjects.find((p) => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
    } else {
      navigate("/projects");
    }
  }, [projectId, navigate]);

  if (!project) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }





  const budgetUsedPercentage = (project.spent / project.budget) * 100;
  const remainingBudget = project.budget - project.spent;
  const daysElapsed = Math.floor(
    (new Date().getTime() - new Date(project.startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const totalDays = Math.floor(
    (new Date(project.endDate).getTime() -
      new Date(project.startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const timeElapsedPercentage = (daysElapsed / totalDays) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link to="/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Projects
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {project.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">{project.id}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-600">
                    {project.client}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/projects/${project.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </Button>
          </Link>
          <Link to={`/projects/${project.id}/timeline`}>
            <Button variant="outline" size="sm">
              <GitBranch className="w-4 h-4 mr-2" />
              Timeline
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {project.progress}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={project.progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget Used</p>
                <p className="text-2xl font-bold text-green-600">
                  {budgetUsedPercentage.toFixed(1)}%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={budgetUsedPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Time Elapsed</p>
                <p className="text-2xl font-bold text-purple-600">
                  {timeElapsedPercentage.toFixed(1)}%
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={timeElapsedPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                  <p className="text-gray-700 leading-relaxed">
                    {project.description}
                  </p>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">
                        {new Date(project.startDate).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">
                        {new Date(project.endDate).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{project.province}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Project Manager:</span>
                      <span className="font-medium">{project.projectManager}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Progress Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-gray-600">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>

                  {project.timeline && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Milestone List</h4>
                      {project.timeline.map((milestone) => (
                        <div key={milestone.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{milestone.title}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(milestone.startDate).toLocaleDateString("id-ID")} -
                            {new Date(milestone.endDate).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-600" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">{project.client}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${project.clientEmail}`} className="text-blue-600 hover:underline">
                      {project.clientEmail}
                    </a>
                  </div>
                  {project.clientPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${project.clientPhone}`} className="text-blue-600 hover:underline">
                        {project.clientPhone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Category</span>
                    <Badge variant="outline">{project.category}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Update</span>
                    <span className="text-sm">
                      {new Date(project.lastUpdate).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    Project Readiness
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Risk Assessment
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Project ID</label>
                    <p className="text-gray-900">{project.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Project Name</label>
                    <p className="text-gray-900">{project.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <p className="text-gray-900">{project.category}</p>
                  </div>

                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Client</label>
                    <p className="text-gray-900">{project.client}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Project Manager</label>
                    <p className="text-gray-900">{project.projectManager}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Province</label>
                    <p className="text-gray-900">{project.province}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Team Size</label>
                    <p className="text-gray-900">{project.teamSize} people</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    <p className="text-gray-900">
                      {new Date(project.startDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">End Date</label>
                    <p className="text-gray-900">
                      {new Date(project.endDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900 mt-1 leading-relaxed">{project.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          {project.timeline ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-blue-600" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.timeline.map((milestone, index) => (
                    <div key={milestone.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        {index < project.timeline!.length - 1 && (
                          <div className="w-px h-12 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            <span>
                              {new Date(milestone.startDate).toLocaleDateString("id-ID")} -
                              {new Date(milestone.endDate).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No timeline data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Budget Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Budget</span>
                    <span className="font-medium">{formatCurrency(project.budget)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount Spent</span>
                    <span className="font-medium text-red-600">{formatCurrency(project.spent)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Remaining Budget</span>
                    <span className="font-medium text-green-600">{formatCurrency(remainingBudget)}</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Budget Utilization</span>
                    <span className="text-sm text-gray-600">{budgetUsedPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={budgetUsedPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Time Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Duration</span>
                    <span className="font-medium">{totalDays} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Days Elapsed</span>
                    <span className="font-medium">{daysElapsed} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Days Remaining</span>
                    <span className="font-medium">{totalDays - daysElapsed} days</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Time Progress</span>
                    <span className="text-sm text-gray-600">{timeElapsedPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={timeElapsedPercentage} className="h-2" />
                </div>
                {project.estimatedHours && (
                  <>
                    <Separator />
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Estimated Hours</p>
                      <p className="text-lg font-semibold">{project.estimatedHours}h</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Financial Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Burn Rate</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {formatCurrency(project.spent / daysElapsed)}/day
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Cost per Progress</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(project.spent / project.progress)}/%
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Projected Total Cost</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {formatCurrency((project.spent / project.progress) * 100)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
