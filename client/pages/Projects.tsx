import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  GitBranch,
  ClipboardCheck,
  Shield,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { getProjectsWithStatus } from "@/utils/dataLoader";
import type { Project } from "@/types";

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const [projects] = useState<Project[]>(getProjectsWithStatus());

  // Mock verification statuses for demonstration
  const getVerificationStatus = (projectId: string) => {
    const mockStatuses: Record<string, string> = {
      "proj-001": "verified",
      "proj-002": "needs_revision",
      "proj-003": "under_review",
      "proj-004": "submitted",
      "proj-005": "verified",
    };

    const status = mockStatuses[projectId] || "not_submitted";

    const statusConfig = {
      not_submitted: {
        label: "Belum Submit",
        color: "bg-gray-100 text-gray-800",
      },
      submitted: {
        label: "Menunggu Review",
        color: "bg-yellow-100 text-yellow-800",
      },
      under_review: {
        label: "Sedang Direview",
        color: "bg-blue-100 text-blue-800",
      },
      verified: {
        label: "Terverifikasi",
        color: "bg-green-100 text-green-800",
      },
      needs_revision: {
        label: "Perlu Revisi",
        color: "bg-red-100 text-red-800",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusBadge = (progress: number) => {
    if (progress === 100) {
      return <Badge className="bg-blue-100 text-blue-800">Selesai</Badge>;
    } else if (progress > 0) {
      return <Badge className="bg-green-100 text-green-800">Berjalan</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Perencanaan</Badge>;
    }
  };

  const getRiskBadge = (riskCaptureScore?: number) => {
    if (!riskCaptureScore || riskCaptureScore === 0) {
      return <Badge className="bg-gray-100 text-gray-800">Belum Dinilai</Badge>;
    } else if (riskCaptureScore >= 80) {
      return <Badge className="bg-green-100 text-green-800">Rendah</Badge>;
    } else if (riskCaptureScore >= 60) {
      return <Badge className="bg-yellow-100 text-yellow-800">Sedang</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Tinggi</Badge>;
    }
  };

  const getReadinessBadge = (
    status?: Project["readinessStatus"],
    score?: number,
  ) => {
    if (!status) {
      return (
        <Badge className="bg-gray-100 text-gray-800">
          <ClipboardCheck className="w-3 h-3 mr-1" />
          Belum Diisi
        </Badge>
      );
    }

    const variants = {
      "not-started": "bg-red-100 text-red-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
    };

    const labels = {
      "not-started": "Belum Mulai",
      "in-progress": "In Progress",
      completed: "Selesai",
    };

    return (
      <div className="space-y-1">
        <Badge className={variants[status]}>{labels[status]}</Badge>
        {score !== undefined && (
          <div className="text-xs text-gray-600">{score}% ready</div>
        )}
      </div>
    );
  };

  const getRiskCaptureBadge = (
    status?: Project["riskCaptureStatus"],
    score?: number,
  ) => {
    if (!status) {
      return (
        <Badge className="bg-gray-100 text-gray-800">
          <Shield className="w-3 h-3 mr-1" />
          Belum Diisi
        </Badge>
      );
    }

    const variants = {
      "not-started": "bg-red-100 text-red-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
    };

    const labels = {
      "not-started": "Belum Mulai",
      "in-progress": "In Progress",
      completed: "Selesai",
    };

    return (
      <div className="space-y-1">
        <Badge className={variants[status]}>{labels[status]}</Badge>
        {score !== undefined && (
          <div className="text-xs text-gray-600">{score}% captured</div>
        )}
      </div>
    );
  };

  const getRiskIcon = (riskCaptureScore?: number) => {
    if (!riskCaptureScore || riskCaptureScore === 0) {
      return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    } else if (riskCaptureScore >= 80) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (riskCaptureScore >= 60) {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    } else {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const projectStatus =
      project.progress === 100
        ? "completed"
        : project.progress > 0
          ? "running"
          : "planning";
    const matchesStatus =
      statusFilter === "all" || projectStatus === statusFilter;
    const projectRisk =
      !project.riskCaptureScore || project.riskCaptureScore === 0
        ? "not_assessed"
        : project.riskCaptureScore >= 80
          ? "low"
          : project.riskCaptureScore >= 60
            ? "medium"
            : "high";
    const matchesRisk = riskFilter === "all" || projectRisk === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const totalBudget = projects.reduce(
    (sum, project) => sum + project.budget,
    0,
  );
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
  const activeProjects = projects.filter(
    (p) => p.progress > 0 && p.progress < 100,
  ).length;
  const completedProjects = projects.filter((p) => p.progress === 100).length;

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
            <span className="break-words">List Project</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
            Kelola dan monitor semua proyek yang sedang berjalan
          </p>
        </div>
        <Link to="/projects/create" className="w-full sm:w-auto">
          <Button className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            <span className="sm:inline">Tambah Project</span>
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600">
                  Total Project
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {projects.length}
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
                  {activeProjects}
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
                  {completedProjects}
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
                  {formatCurrency(totalBudget)}
                </p>
              </div>
              <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-purple-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col gap-3 lg:gap-4">
            {/* Search Input */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari project atau client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm lg:text-base"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full min-w-0">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="running">Berjalan</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="on-hold">Tertunda</SelectItem>
                    <SelectItem value="planning">Perencanaan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-full sm:w-48 min-w-0">
                  <SelectValue placeholder="Filter Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Risk</SelectItem>
                  <SelectItem value="not_assessed">Belum Dinilai</SelectItem>
                  <SelectItem value="low">Rendah</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="high">Tinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader className="pb-3 lg:pb-6">
          <CardTitle className="text-base lg:text-lg">
            Daftar Project ({filteredProjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="min-w-[200px] lg:min-w-[250px]">
                    Project
                  </TableHead>
                  <TableHead className="min-w-[120px] lg:min-w-[150px]">
                    Client
                  </TableHead>
                  <TableHead className="min-w-[100px] lg:min-w-[120px]">
                    Progress
                  </TableHead>
                  <TableHead className="min-w-[120px] lg:min-w-[140px]">
                    Budget
                  </TableHead>
                  <TableHead className="min-w-[120px] lg:min-w-[140px] hidden sm:table-cell">
                    Timeline
                  </TableHead>
                  <TableHead className="min-w-[100px] lg:min-w-[120px] hidden md:table-cell">
                    Readiness
                  </TableHead>
                  <TableHead className="min-w-[100px] lg:min-w-[120px] hidden md:table-cell">
                    Risk Capture
                  </TableHead>
                  <TableHead className="min-w-[120px] lg:min-w-[140px] hidden lg:table-cell">
                    Verifikasi
                  </TableHead>
                  <TableHead className="min-w-[100px] lg:min-w-[120px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-gray-400" />
                        <p className="text-gray-500 text-sm lg:text-base">
                          {searchTerm ||
                          statusFilter !== "all" ||
                          riskFilter !== "all"
                            ? "Tidak ada project yang ditemukan dengan filter yang dipilih"
                            : "Belum ada project yang terdaftar"}
                        </p>
                        {(searchTerm ||
                          statusFilter !== "all" ||
                          riskFilter !== "all") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearchTerm("");
                              setStatusFilter("all");
                              setRiskFilter("all");
                            }}
                          >
                            Reset Filter
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm lg:text-base text-gray-900 break-words">
                            {project.name}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-500">
                            {project.id}
                          </p>
                          {/* Show client on mobile when client column is hidden */}
                          <p className="text-xs text-gray-600 mt-1 sm:hidden">
                            Client: {project.client}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <p className="text-xs lg:text-sm text-gray-900 break-words">
                          {project.client}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-12 lg:w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs lg:text-sm text-gray-600 whitespace-nowrap">
                            {project.progress}%
                          </span>
                        </div>
                        {getStatusBadge(project.progress)}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs lg:text-sm">
                          <p className="font-medium break-words">
                            {formatCurrency(project.budget)}
                          </p>
                          <p className="text-gray-500 break-words">
                            Spent: {formatCurrency(project.spent)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-xs lg:text-sm">
                          <p className="whitespace-nowrap">
                            {new Date(project.startDate).toLocaleDateString(
                              "id-ID",
                            )}
                          </p>
                          <p className="text-gray-500 whitespace-nowrap">
                            →{" "}
                            {new Date(project.endDate).toLocaleDateString(
                              "id-ID",
                            )}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getReadinessBadge(
                          project.readinessStatus,
                          project.readinessScore,
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getRiskCaptureBadge(
                          project.riskCaptureStatus,
                          project.riskCaptureScore,
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {getVerificationStatus(project.id)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 lg:gap-2">
                          <Link to={`/projects/${project.id}/timeline`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View Timeline"
                              className="h-8 w-8 p-0 lg:h-9 lg:w-9"
                            >
                              <GitBranch className="w-3 h-3 lg:w-4 lg:h-4" />
                            </Button>
                          </Link>
                          <Link to={`/projects/${project.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View Details"
                              className="h-8 w-8 p-0 lg:h-9 lg:w-9"
                            >
                              <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 lg:h-9 lg:w-9"
                          >
                            <MoreHorizontal className="w-3 h-3 lg:w-4 lg:h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
