import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
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
  MoreHorizontal,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Project } from "@/types";
import { getProjectById, getProjectReadiness } from "@/utils/dataLoader";
import { ProjectReadinessForm } from "@/components/project/ProjectReadinessForm";
import { ProjectReadinessResults } from "@/components/project/ProjectReadinessResults";
import { RiskCaptureForm } from "@/components/project/RiskCaptureForm";
import { TimelineCard } from "@/components/timeline/TimelineCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Helper function to check if user can edit readiness
const canEditReadiness = (readinessStatus: string | null) => {
  // User can edit if:
  // - No readiness data exists yet (null)
  // - Status is "submitted" (not yet assigned to verifier)
  // - Status is "under_review" or "needs_revision" (can be updated during review)
  // User CANNOT edit if status is "verified" (finalized)
  return !readinessStatus || readinessStatus !== "verified";
};

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [readinessStatus, setReadinessStatus] = useState<string | null>(null);

  // Quick Actions states
  const [readinessForm, setReadinessForm] = useState({
    isOpen: false,
    projectId: "",
    projectName: "",
  });

  const [readinessResults, setReadinessResults] = useState({
    isOpen: false,
    projectId: "",
    projectName: "",
  });

  const [riskCaptureForm, setRiskCaptureForm] = useState({
    isOpen: false,
    projectId: "",
    projectName: "",
  });

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    // Load project data from JSON
    if (projectId) {
      const foundProject = getProjectById(projectId);
      if (foundProject) {
        setProject(foundProject);
      } else {
        navigate("/projects");
      }
    }
  }, [projectId, navigate]);

  // Quick Actions handlers
  const openReadinessResults = () => {
    if (project) {
      setReadinessResults({
        isOpen: true,
        projectId: project.id,
        projectName: project.name,
      });
    }
  };

  const openReadinessForm = () => {
    if (project) {
      setReadinessForm({
        isOpen: true,
        projectId: project.id,
        projectName: project.name,
      });
    }
  };

  const closeReadinessResults = () => {
    setReadinessResults({
      isOpen: false,
      projectId: "",
      projectName: "",
    });
  };

  const closeReadinessForm = () => {
    setReadinessForm({
      isOpen: false,
      projectId: "",
      projectName: "",
    });
  };

  const handleReadinessSave = (data: any) => {
    console.log("Readiness data saved for project:", project?.id, data);
    // Here you would typically send the data to your API
    closeReadinessForm();
    // Show success message
    toast.success("Project Readiness assessment berhasil disimpan!");
  };

  const openRiskCaptureForm = () => {
    if (project) {
      setRiskCaptureForm({
        isOpen: true,
        projectId: project.id,
        projectName: project.name,
      });
    }
  };

  const closeRiskCaptureForm = () => {
    setRiskCaptureForm({
      isOpen: false,
      projectId: "",
      projectName: "",
    });
  };

  const handleRiskCaptureSave = (data: any) => {
    console.log("Risk capture data saved for project:", project?.id, data);
    // Here you would typically send the data to your API
    closeRiskCaptureForm();
    // Show success message
    toast.success("Risk Assessment berhasil disimpan!");
  };

  const generateReport = async () => {
    if (!project) return;

    setIsGeneratingReport(true);

    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a simple report content
      const reportContent = `
PROJECT REPORT
==============

Project: ${project.name}
Client: ${project.client}
Project Manager: ${project.projectManager}
Category: ${project.category}

PROGRESS OVERVIEW
================
Overall Progress: ${project.progress}%
Budget Used: ${((project.spent / project.budget) * 100).toFixed(1)}%
Time Elapsed: ${(((new Date().getTime() - new Date(project.startDate).getTime()) / (new Date(project.endDate).getTime() - new Date(project.startDate).getTime())) * 100).toFixed(1)}%

FINANCIAL SUMMARY
================
Total Budget: ${formatCurrency(project.budget)}
Amount Spent: ${formatCurrency(project.spent)}
Remaining Budget: ${formatCurrency(project.budget - project.spent)}

TIMELINE
========
Start Date: ${new Date(project.startDate).toLocaleDateString("id-ID")}
End Date: ${new Date(project.endDate).toLocaleDateString("id-ID")}
${project.timeline ? `\nMilestones: ${project.timeline.length} defined` : ""}

Report generated on: ${new Date().toLocaleDateString("id-ID")} ${new Date().toLocaleTimeString("id-ID")}
      `;

      // Create and download the report
      const blob = new Blob([reportContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Project_Report_${project.id}_${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Report berhasil di-generate dan di-download!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Gagal generate report. Silakan coba lagi.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (!project) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  const budgetUsedPercentage = (project.spent / project.budget) * 100;
  const remainingBudget = project.budget - project.spent;
  const startDate = project.start_date || project.startDate;
  const endDate = project.end_date || project.endDate;

  const daysElapsed = Math.floor(
    (new Date().getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const totalDays = Math.floor(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const timeElapsedPercentage = (daysElapsed / totalDays) * 100;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex flex-col gap-4">
          <Link to="/projects">
            <Button variant="outline" size="sm" className="w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Kembali ke Projects</span>
              <span className="sm:hidden">Kembali</span>
            </Button>
          </Link>
          <div className="flex items-start gap-3">
            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight break-words">
                {project.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                <span className="text-xs sm:text-sm text-gray-600">
                  {project.client}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Enhanced with Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to={`/projects/${project.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Link to={`/projects/${project.id}/timeline`}>
              <Button variant="outline" size="sm">
                <GitBranch className="w-4 h-4 mr-2" />
                Timeline
              </Button>
            </Link>

            {/* Primary Quick Actions */}
            <div className="h-6 w-px bg-gray-300 mx-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={openReadinessResults}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <ClipboardCheck className="w-4 h-4 mr-2" />
              View Readiness
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openReadinessForm}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Assessment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openRiskCaptureForm}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <Shield className="w-4 h-4 mr-2" />
              Risk Assessment
            </Button>
          </div>

          {/* Tablet Actions */}
          <div className="hidden sm:flex lg:hidden items-center gap-2">
            <Link to={`/projects/${project.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to={`/projects/${project.id}/timeline`}>
                    <GitBranch className="w-4 h-4 mr-2" />
                    Timeline
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={openReadinessResults}>
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  View Readiness Results
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openReadinessForm}>
                  <FileText className="w-4 h-4 mr-2" />
                  Create Assessment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openRiskCaptureForm}>
                  <Shield className="w-4 h-4 mr-2" />
                  Risk Assessment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={generateReport}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Actions */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Actions</span>
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-xs font-medium text-gray-500 border-b">
                  Project Actions
                </div>
                <DropdownMenuItem asChild>
                  <Link to={`/projects/${project.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/projects/${project.id}/timeline`}>
                    <GitBranch className="w-4 h-4 mr-2" />
                    Timeline
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs font-medium text-gray-500 border-b">
                  Quick Assessments
                </div>
                <DropdownMenuItem onClick={openReadinessResults}>
                  <ClipboardCheck className="w-4 h-4 mr-2 text-blue-600" />
                  <div>
                    <div className="font-medium">View Readiness Results</div>
                    <div className="text-xs text-gray-500">
                      View verification results
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openReadinessForm}>
                  <FileText className="w-4 h-4 mr-2 text-green-600" />
                  <div>
                    <div className="font-medium">Create Assessment</div>
                    <div className="text-xs text-gray-500">
                      Fill readiness assessment
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openRiskCaptureForm}>
                  <Shield className="w-4 h-4 mr-2 text-orange-600" />
                  <div>
                    <div className="font-medium">Risk Assessment</div>
                    <div className="text-xs text-gray-500">
                      Capture project risks
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={generateReport}>
                  <FileText className="w-4 h-4 mr-2 text-green-600" />
                  Generate Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Quick Stats - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {project.progress}%
                </p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
            <Progress value={project.progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget Used</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {budgetUsedPercentage.toFixed(1)}%
                </p>
              </div>
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
            <Progress value={budgetUsedPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Time Elapsed</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">
                  {timeElapsedPercentage.toFixed(1)}%
                </p>
              </div>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
            </div>
            <Progress value={timeElapsedPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Responsive Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-4 min-w-[320px]">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs sm:text-sm">
              Details
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs sm:text-sm">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="financial" className="text-xs sm:text-sm">
              Financial
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Project Info - Takes 2/3 width on large screens */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {project.description}
                  </p>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">
                        {new Date(startDate).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">
                        {new Date(endDate).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{project.province}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">PM:</span>
                      <span className="font-medium truncate">
                        {project.project_manager || project.projectManager}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="h-5 w-5 text-gray-600" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {project.client}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={`mailto:${project.client_email || project.clientEmail}`}
                      className="text-blue-600 hover:underline truncate"
                    >
                      {project.client_email || project.clientEmail}
                    </a>
                  </div>
                  {(project.client_phone || project.clientPhone) && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a
                        href={`tel:${project.client_phone || project.clientPhone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {project.client_phone || project.clientPhone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Category</span>
                    <Badge variant="outline" className="text-xs">
                      {project.category}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">
                      Project Manager
                    </span>
                    <span className="text-sm font-medium text-right max-w-[60%]">
                      {project.project_manager || project.projectManager}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Province</span>
                    <span className="text-sm">{project.province}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm">{totalDays} days</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Update</span>
                    <span className="text-sm">
                      {new Date(
                        project.last_update || project.lastUpdate,
                      ).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-600" />
                    Additional Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start hover:bg-green-50 text-sm"
                    onClick={generateReport}
                    disabled={isGeneratingReport}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {isGeneratingReport ? "Generating..." : "Generate Report"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start hover:bg-purple-50 text-sm"
                    onClick={() => {
                      // Future: Export data functionality
                      toast.success("Export feature coming soon!");
                    }}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start hover:bg-gray-50 text-sm"
                    onClick={() => {
                      // Future: Archive project functionality
                      toast.success("Archive feature coming soon!");
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Archive Project
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Project Name
                    </label>
                    <p className="text-gray-900">{project.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <p className="text-gray-900">{project.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Client
                    </label>
                    <p className="text-gray-900">{project.client}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Project Manager
                    </label>
                    <p className="text-gray-900">
                      {project.project_manager || project.projectManager}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Province
                    </label>
                    <p className="text-gray-900">{project.province}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(startDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(endDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <p className="text-gray-900 mt-1 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4 sm:space-y-6">
          {project.timeline ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Project Duration Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          Project Duration
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">
                          {new Date(startDate).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium">
                          {new Date(endDate).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Duration:</span>
                          <span className="text-xl sm:text-2xl font-bold text-blue-600">
                            {totalDays} days
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          Timeline Duration
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Timeline Start:</span>
                        <span className="font-medium">
                          {new Date(
                            project.timeline[0].startDate,
                          ).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Timeline End:</span>
                        <span className="font-medium">
                          {new Date(
                            project.timeline[
                              project.timeline.length - 1
                            ].endDate,
                          ).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Duration:</span>
                          <span className="text-xl sm:text-2xl font-bold text-purple-600">
                            {Math.ceil(
                              (new Date(
                                project.timeline[
                                  project.timeline.length - 1
                                ].endDate,
                              ).getTime() -
                                new Date(
                                  project.timeline[0].startDate,
                                ).getTime()) /
                                (1000 * 60 * 60 * 24),
                            )}{" "}
                            days
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline List using TimelineCard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-blue-600" />
                    Project Timeline
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Daftar milestone project dari awal hingga akhir
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.timeline.map((milestone) => (
                      <TimelineCard key={milestone.id} milestone={milestone} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No timeline data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                    <span className="font-medium text-sm sm:text-base">
                      {formatCurrency(project.budget)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount Spent</span>
                    <span className="font-medium text-red-600 text-sm sm:text-base">
                      {formatCurrency(project.spent)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Remaining Budget
                    </span>
                    <span className="font-medium text-green-600 text-sm sm:text-base">
                      {formatCurrency(remainingBudget)}
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Budget Utilization
                    </span>
                    <span className="text-sm text-gray-600">
                      {budgetUsedPercentage.toFixed(1)}%
                    </span>
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
                    <span className="text-sm text-gray-600">
                      Total Duration
                    </span>
                    <span className="font-medium">{totalDays} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Days Elapsed</span>
                    <span className="font-medium">{daysElapsed} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Days Remaining
                    </span>
                    <span className="font-medium">
                      {totalDays - daysElapsed} days
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Time Progress</span>
                    <span className="text-sm text-gray-600">
                      {timeElapsedPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={timeElapsedPercentage} className="h-2" />
                </div>
                {project.estimatedHours && (
                  <>
                    <Separator />
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Estimated Hours</p>
                      <p className="text-lg font-semibold">
                        {project.estimatedHours}h
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Financial Analysis - Responsive Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Burn Rate</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-700">
                    {formatCurrency(project.spent / daysElapsed)}/day
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">
                    Cost per Progress
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-green-700">
                    {formatCurrency(project.spent / project.progress)}/%
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg sm:col-span-2 lg:col-span-1">
                  <p className="text-sm text-purple-600 font-medium">
                    Projected Total Cost
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-700">
                    {formatCurrency((project.spent / project.progress) * 100)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Project Readiness Results */}
      <ProjectReadinessResults
        isOpen={readinessResults.isOpen}
        onClose={closeReadinessResults}
        projectId={readinessResults.projectId}
        projectName={readinessResults.projectName}
      />

      {/* Project Readiness Form */}
      <ProjectReadinessForm
        isOpen={readinessForm.isOpen}
        onClose={closeReadinessForm}
        projectId={readinessForm.projectId}
        projectName={readinessForm.projectName}
        onSave={handleReadinessSave}
      />

      {/* Risk Capture Form */}
      <RiskCaptureForm
        isOpen={riskCaptureForm.isOpen}
        onClose={closeRiskCaptureForm}
        projectId={riskCaptureForm.projectId}
        projectName={riskCaptureForm.projectName}
        onSave={handleRiskCaptureSave}
      />

      {/* Floating Action Button for Mobile Quick Actions */}
      <div className="fixed bottom-6 right-6 sm:hidden z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className={cn(
                "h-14 w-14 rounded-full shadow-lg",
                "bg-blue-600 hover:bg-blue-700 text-white",
                "border-2 border-white",
                "transition-all duration-200",
                "hover:scale-105 active:scale-95",
              )}
            >
              <Shield className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-56 mb-2 shadow-xl"
          >
            <div className="p-2">
              <p className="text-xs font-medium text-gray-500 mb-2 px-2">
                Quick Actions
              </p>
            </div>
            <DropdownMenuItem onClick={openReadinessResults} className="py-3">
              <ClipboardCheck className="w-5 h-5 mr-3 text-blue-600" />
              <div>
                <div className="font-medium">View Readiness Results</div>
                <div className="text-xs text-gray-500">
                  View verification results
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openReadinessForm} className="py-3">
              <FileText className="w-5 h-5 mr-3 text-green-600" />
              <div>
                <div className="font-medium">Create Assessment</div>
                <div className="text-xs text-gray-500">
                  Fill readiness assessment
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openRiskCaptureForm} className="py-3">
              <Shield className="w-5 h-5 mr-3 text-orange-600" />
              <div>
                <div className="font-medium">Risk Assessment</div>
                <div className="text-xs text-gray-500">
                  Capture project risks
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={generateReport}
              disabled={isGeneratingReport}
              className="py-3"
            >
              <FileText className="w-5 h-5 mr-3 text-green-600" />
              <div>
                <div className="font-medium">
                  {isGeneratingReport ? "Generating..." : "Generate Report"}
                </div>
                <div className="text-xs text-gray-500">
                  Download project report
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
