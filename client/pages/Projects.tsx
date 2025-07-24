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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            List Project
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola dan monitor semua proyek yang sedang berjalan
          </p>
        </div>
        <Link to="/projects/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Project
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Project
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.length}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {activeProjects}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-2xl font-bold text-blue-600">
                  {completedProjects}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Budget
                </p>
                <p className="text-lg font-bold text-purple-600">
                  {formatCurrency(totalBudget)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari project atau client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
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
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full sm:w-48">
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
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Project ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Readiness</TableHead>
                  <TableHead>Risk Capture</TableHead>
                  <TableHead>Verifikasi</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {project.name}
                        </p>
                        <p className="text-sm text-gray-500">{project.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-900">{project.client}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {project.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">
                          {formatCurrency(project.budget)}
                        </p>
                        <p className="text-gray-500">
                          Spent: {formatCurrency(project.spent)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>
                          {new Date(project.startDate).toLocaleDateString(
                            "id-ID",
                          )}
                        </p>
                        <p className="text-gray-500">
                          →{" "}
                          {new Date(project.endDate).toLocaleDateString(
                            "id-ID",
                          )}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getReadinessBadge(
                        project.readinessStatus,
                        project.readinessScore,
                      )}
                    </TableCell>
                    <TableCell>
                      {getRiskCaptureBadge(
                        project.riskCaptureStatus,
                        project.riskCaptureScore,
                      )}
                    </TableCell>
                    <TableCell>{getVerificationStatus(project.id)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link to={`/projects/${project.id}/timeline`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Timeline"
                          >
                            <GitBranch className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/projects/${project.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
