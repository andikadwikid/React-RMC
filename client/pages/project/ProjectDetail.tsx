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

        // Load readiness status
        const readinessData = getProjectReadiness(projectId);
        setReadinessStatus(readinessData?.status || null);
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

    // Refresh readiness status after save
    if (projectId) {
      const readinessData = getProjectReadiness(projectId);
      setReadinessStatus(readinessData?.status || "submitted");
    }

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
    <div className="p-4 sm:p-10 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
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
          <div className="hidden lg:flex items-center gap-3">
            {/* Secondary Actions Group */}
            <div className="flex items-center gap-2">
              <Link to={`/projects/${project.id}/edit`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Link to={`/projects/${project.id}/timeline`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Timeline
                </Button>
              </Link>
            </div>

            {/* Primary Actions Group */}
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
            <div className="flex items-center gap-2">
              {readinessStatus ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openReadinessResults}
                  className="relative font-medium text-blue-700 border-blue-300 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-400 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  View Readiness
                  <div className="flex items-center ml-2">
                    {readinessStatus === "verified" && (
                      <div className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="ml-1 text-xs font-medium text-green-700">
                          Verified
                        </span>
                      </div>
                    )}
                    {readinessStatus === "under_review" && (
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 text-yellow-600" />
                        <span className="ml-1 text-xs font-medium text-yellow-700">
                          Review
                        </span>
                      </div>
                    )}
                    {readinessStatus === "submitted" && (
                      <div className="flex items-center">
                        <AlertTriangle className="w-3 h-3 text-orange-600" />
                        <span className="ml-1 text-xs font-medium text-orange-700">
                          Pending
                        </span>
                      </div>
                    )}
                  </div>
                </Button>
              ) : null}

              {canEditReadiness(readinessStatus) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openReadinessForm}
                  className="font-medium text-green-700 border-green-300 bg-green-50/50 hover:bg-green-100 hover:border-green-400 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {readinessStatus ? "Update Assessment" : "Create Assessment"}
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={openRiskCaptureForm}
                className="font-medium text-orange-700 border-orange-300 bg-orange-50/50 hover:bg-orange-100 hover:border-orange-400 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <Shield className="w-4 h-4 mr-2" />
                Risk Capture
              </Button>
            </div>
          </div>

          {/* Tablet Actions */}
          <div className="hidden sm:flex lg:hidden items-center gap-3">
            {/* Most Important Actions Visible */}
            <Link to={`/projects/${project.id}/edit`}>
              <Button
                variant="outline"
                size="sm"
                className="font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>

            {/* Primary Readiness Action */}
            {readinessStatus ? (
              <Button
                variant="outline"
                size="sm"
                onClick={openReadinessResults}
                className="font-medium text-blue-700 border-blue-300 bg-blue-50/50 hover:bg-blue-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Readiness
                {readinessStatus === "verified" && (
                  <CheckCircle className="w-3 h-3 ml-2 text-green-600" />
                )}
                {readinessStatus === "under_review" && (
                  <Clock className="w-3 h-3 ml-2 text-yellow-600" />
                )}
                {readinessStatus === "submitted" && (
                  <AlertTriangle className="w-3 h-3 ml-2 text-orange-600" />
                )}
              </Button>
            ) : canEditReadiness(readinessStatus) ? (
              <Button
                variant="outline"
                size="sm"
                onClick={openReadinessForm}
                className="font-medium text-green-700 border-green-300 bg-green-50/50 hover:bg-green-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create
              </Button>
            ) : null}

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium shadow-sm hover:shadow-md transition-all duration-200 border-gray-300 hover:border-gray-400"
                >
                  <MoreHorizontal className="w-4 h-4 mr-2" />
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 shadow-lg border-0 bg-white/95 backdrop-blur-sm"
              >
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b bg-gray-50/50">
                  Project Actions
                </div>
                <DropdownMenuItem
                  asChild
                  className="py-3 hover:bg-blue-50 transition-colors"
                >
                  <Link to={`/projects/${project.id}/timeline`}>
                    <GitBranch className="w-4 h-4 mr-3 text-gray-600" />
                    <div>
                      <div className="font-medium">Timeline</div>
                      <div className="text-xs text-gray-500">
                        View project milestones
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b bg-gray-50/50">
                  Assessment Actions
                </div>

                {readinessStatus && (
                  <DropdownMenuItem
                    onClick={openReadinessResults}
                    className="py-3 hover:bg-blue-50 transition-colors"
                  >
                    <ClipboardCheck className="w-4 h-4 mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">View Readiness Results</div>
                      <div className="text-xs text-gray-500">
                        Check verification status
                      </div>
                    </div>
                  </DropdownMenuItem>
                )}
                {canEditReadiness(readinessStatus) && (
                  <DropdownMenuItem
                    onClick={openReadinessForm}
                    className="py-3 hover:bg-green-50 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-3 text-green-600" />
                    <div>
                      <div className="font-medium">
                        {readinessStatus
                          ? "Update Assessment"
                          : "Create Assessment"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Manage readiness items
                      </div>
                    </div>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={openRiskCaptureForm}
                  className="py-3 hover:bg-orange-50 transition-colors"
                >
                  <Shield className="w-4 h-4 mr-3 text-orange-600" />
                  <div>
                    <div className="font-medium">Risk Capture</div>
                    <div className="text-xs text-gray-500">
                      Capture and analyze project risks
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={generateReport}
                  className="py-3 hover:bg-purple-50 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-3 text-purple-600" />
                  <div>
                    <div className="font-medium">Generate Report</div>
                    <div className="text-xs text-gray-500">
                      Download project summary
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Actions */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative font-medium shadow-md hover:shadow-lg transition-all duration-200 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Shield className="w-4 h-4 text-blue-600" />
                      {readinessStatus && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      Actions
                    </span>
                    <MoreHorizontal className="w-3 h-3 text-gray-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 shadow-xl border-0 bg-white/95 backdrop-blur-md rounded-xl"
              >
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b text-center">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Project Actions
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{project.name}</p>
                </div>

                {/* Project Management */}
                <div className="p-2">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Project Management
                  </div>
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg my-1 py-3 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Link to={`/projects/${project.id}/edit`}>
                      <Edit className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <div className="font-semibold text-gray-700">
                          Edit Project
                        </div>
                        <div className="text-xs text-gray-500">
                          Modify project details
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg my-1 py-3 hover:bg-purple-50 transition-all duration-200"
                  >
                    <Link to={`/projects/${project.id}/timeline`}>
                      <GitBranch className="w-5 h-5 mr-3 text-purple-600" />
                      <div>
                        <div className="font-semibold text-gray-700">
                          Timeline
                        </div>
                        <div className="text-xs text-gray-500">
                          View milestones & progress
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>

                {/* Quick Assessments */}
                <div className="p-2 border-t bg-gray-50/30">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Assessment Tools
                  </div>
                  {readinessStatus && (
                    <DropdownMenuItem
                      onClick={openReadinessResults}
                      className="rounded-lg my-1 py-3 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="relative mr-3">
                        <ClipboardCheck className="w-5 h-5 text-blue-600" />
                        {readinessStatus === "verified" && (
                          <CheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-green-500" />
                        )}
                        {readinessStatus === "under_review" && (
                          <Clock className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-700">
                          View Readiness Results
                        </div>
                        <div className="text-xs text-gray-500">
                          Check verification status & feedback
                        </div>
                      </div>
                    </DropdownMenuItem>
                  )}
                  {canEditReadiness(readinessStatus) && (
                    <DropdownMenuItem
                      onClick={openReadinessForm}
                      className="rounded-lg my-1 py-3 hover:bg-green-50 transition-all duration-200"
                    >
                      <FileText className="w-5 h-5 mr-3 text-green-600" />
                      <div>
                        <div className="font-semibold text-gray-700">
                          {readinessStatus
                            ? "Update Assessment"
                            : "Create Assessment"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {readinessStatus
                            ? "Modify readiness data"
                            : "Fill readiness assessment"}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={openRiskCaptureForm}
                    className="rounded-lg my-1 py-3 hover:bg-orange-50 transition-all duration-200"
                  >
                    <Shield className="w-5 h-5 mr-3 text-orange-600" />
                    <div>
                      <div className="font-semibold text-gray-700">
                        Risk Capture Assessment
                      </div>
                      <div className="text-xs text-gray-500">
                        Capture & analyze project risks
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>

                {/* Additional Actions */}
                <div className="p-2 border-t">
                  <DropdownMenuItem
                    onClick={generateReport}
                    className="rounded-lg py-3 hover:bg-indigo-50 transition-all duration-200"
                  >
                    <FileText className="w-5 h-5 mr-3 text-indigo-600" />
                    <div>
                      <div className="font-semibold text-gray-700">
                        Generate Report
                      </div>
                      <div className="text-xs text-gray-500">
                        Download comprehensive project report
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
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
        onEdit={openReadinessForm}
      />

      {/* Project Readiness Form */}
      <ProjectReadinessForm
        isOpen={readinessForm.isOpen}
        onClose={closeReadinessForm}
        projectId={readinessForm.projectId}
        projectName={readinessForm.projectName}
        onSave={handleReadinessSave}
      />

      {/* Floating Action Button for Mobile Quick Actions */}
      <div className="fixed bottom-6 right-6 sm:hidden z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className={cn(
                "relative h-16 w-16 rounded-full shadow-xl",
                "bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600",
                "hover:from-blue-600 hover:via-blue-700 hover:to-purple-700",
                "text-white border-4 border-white/20",
                "transition-all duration-300 ease-out",
                "hover:scale-110 active:scale-95",
                "hover:shadow-2xl hover:shadow-blue-500/25",
                "before:absolute before:inset-0 before:rounded-full",
                "before:bg-gradient-to-br before:from-blue-400 before:to-purple-400",
                "before:opacity-0 hover:before:opacity-20 before:transition-opacity",
                "group",
              )}
            >
              <div className="relative flex items-center justify-center">
                <Shield className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
                {readinessStatus && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={12}
            className="w-68 mb-4 shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden"
          >
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Quick Actions
                  </h3>
                  <p className="text-xs text-gray-500">
                    Project assessments & tools
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 space-y-1">
              {readinessStatus && (
                <DropdownMenuItem
                  onClick={openReadinessResults}
                  className="rounded-xl py-4 px-3 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center w-full">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mr-3 transition-colors">
                      <ClipboardCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 text-sm">
                        View Readiness Results
                      </div>
                      <div className="text-xs text-gray-500">
                        Check verification status & feedback
                      </div>
                    </div>
                    {readinessStatus === "verified" && (
                      <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                    )}
                    {readinessStatus === "under_review" && (
                      <Clock className="w-4 h-4 text-yellow-500 ml-2" />
                    )}
                  </div>
                </DropdownMenuItem>
              )}

              {canEditReadiness(readinessStatus) && (
                <DropdownMenuItem
                  onClick={openReadinessForm}
                  className="rounded-xl py-4 px-3 hover:bg-green-50 transition-all duration-200 group"
                >
                  <div className="flex items-center w-full">
                    <div className="w-10 h-10 rounded-xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center mr-3 transition-colors">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 text-sm">
                        {readinessStatus
                          ? "Update Assessment"
                          : "Create Assessment"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {readinessStatus
                          ? "Modify readiness data"
                          : "Fill readiness assessment"}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              )}

              {/* <DropdownMenuItem
                onClick={openRiskCaptureForm}
                className="rounded-xl py-4 px-3 hover:bg-orange-50 transition-all duration-200 group"
              >
                <div className="flex items-center w-full">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center mr-3 transition-colors">
                    <Shield className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-sm">
                      Risk Assessment
                    </div>
                    <div className="text-xs text-gray-500">
                      Capture & analyze project risks
                    </div>
                  </div>
                </div>
              </DropdownMenuItem> */}

              <div className="border-t border-gray-100 my-2"></div>

              <DropdownMenuItem
                onClick={generateReport}
                disabled={isGeneratingReport}
                className="rounded-xl py-4 px-3 hover:bg-purple-50 transition-all duration-200 group disabled:opacity-50"
              >
                <div className="flex items-center w-full">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center mr-3 transition-colors">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-sm">
                      {isGeneratingReport ? "Generating..." : "Generate Report"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Download comprehensive project report
                    </div>
                  </div>
                  {isGeneratingReport && (
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin ml-2"></div>
                  )}
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
