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
import { ProjectReadinessForm } from "@/components/project/ProjectReadinessForm";
import { RiskCaptureForm } from "@/components/project/RiskCaptureForm";
import { formatCurrency } from "@/utils/formatters";

interface Project {
  id: string;
  name: string;
  client: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  progress: number;
  lastUpdate: string;
  readinessStatus?: "not-started" | "in-progress" | "completed";
  readinessScore?: number;
  riskCaptureStatus?: "not-started" | "in-progress" | "completed";
  riskCaptureScore?: number;
}

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [readinessForm, setReadinessForm] = useState<{
    isOpen: boolean;
    projectId: string;
    projectName: string;
  }>({ isOpen: false, projectId: "", projectName: "" });

  const [riskCaptureForm, setRiskCaptureForm] = useState<{
    isOpen: boolean;
    projectId: string;
    projectName: string;
  }>({ isOpen: false, projectId: "", projectName: "" });

  const [projects] = useState<Project[]>([
    {
      id: "PRJ-001",
      name: "Sistem ERP Perusahaan",
      client: "PT. Teknologi Maju",
      budget: 2500000000,
      spent: 1800000000,
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      progress: 72,
      lastUpdate: "2024-01-20",
      readinessStatus: "in-progress",
      readinessScore: 65,
      riskCaptureStatus: "not-started",
      riskCaptureScore: 0,
    },
    {
      id: "PRJ-002",
      name: "Mobile Banking App",
      client: "Bank Digital Nusantara",
      budget: 1800000000,
      spent: 900000000,
      startDate: "2024-02-01",
      endDate: "2024-07-15",
      progress: 45,
      lastUpdate: "2024-01-19",
      readinessStatus: "completed",
      readinessScore: 95,
      riskCaptureStatus: "completed",
      riskCaptureScore: 85,
    },
    {
      id: "PRJ-003",
      name: "Dashboard Analytics",
      client: "PT. Data Insights",
      budget: 850000000,
      spent: 820000000,
      startDate: "2023-11-01",
      endDate: "2024-01-15",
      progress: 100,
      lastUpdate: "2024-01-15",
      readinessStatus: "completed",
      readinessScore: 100,
      riskCaptureStatus: "completed",
      riskCaptureScore: 92,
    },
    {
      id: "PRJ-004",
      name: "E-commerce Platform",
      client: "Toko Online Sejahtera",
      budget: 3200000000,
      spent: 2100000000,
      startDate: "2023-12-01",
      endDate: "2024-05-30",
      progress: 68,
      lastUpdate: "2024-01-18",
      readinessStatus: "in-progress",
      readinessScore: 40,
      riskCaptureStatus: "in-progress",
      riskCaptureScore: 60,
    },
    {
      id: "PRJ-005",
      name: "HR Management System",
      client: "PT. Sumber Daya Prima",
      budget: 1500000000,
      spent: 0,
      startDate: "2024-02-15",
      endDate: "2024-08-30",
      progress: 0,
      lastUpdate: "2024-01-21",
      readinessStatus: "not-started",
      readinessScore: 10,
      riskCaptureStatus: "not-started",
      riskCaptureScore: 0,
    },
    {
      id: "PRJ-006",
      name: "Inventory Management",
      client: "PT. Logistik Global",
      budget: 2200000000,
      spent: 1100000000,
      startDate: "2023-10-15",
      endDate: "2024-04-30",
      progress: 50,
      lastUpdate: "2024-01-10",
      readinessStatus: "in-progress",
      readinessScore: 75,
      riskCaptureStatus: "not-started",
      riskCaptureScore: 0,
    },
  ]);

  const openReadinessForm = (projectId: string, projectName: string) => {
    setReadinessForm({ isOpen: true, projectId, projectName });
  };

  const closeReadinessForm = () => {
    setReadinessForm({ isOpen: false, projectId: "", projectName: "" });
  };

  const handleReadinessSave = (data: any) => {
    console.log("Readiness data saved:", data);
    // Handle save logic here
  };

  const openRiskCaptureForm = (projectId: string, projectName: string) => {
    setRiskCaptureForm({ isOpen: true, projectId, projectName });
  };

  const closeRiskCaptureForm = () => {
    setRiskCaptureForm({ isOpen: false, projectId: "", projectName: "" });
  };

  const handleRiskCaptureSave = (data: any) => {
    console.log("Risk capture data saved:", data);
    // Handle save logic here
  };

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

  const getStatusBadge = (status: Project["status"]) => {
    const variants = {
      running: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      "on-hold": "bg-yellow-100 text-yellow-800",
      planning: "bg-gray-100 text-gray-800",
    };

    const labels = {
      running: "Berjalan",
      completed: "Selesai",
      "on-hold": "Tertunda",
      planning: "Perencanaan",
    };

    return <Badge className={variants[status]}>{labels[status]}</Badge>;
  };

  const getRiskBadge = (risk: Project["riskLevel"]) => {
    const variants = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };

    const labels = {
      low: "Rendah",
      medium: "Sedang",
      high: "Tinggi",
    };

    return <Badge className={variants[risk]}>{labels[risk]}</Badge>;
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

  const getRiskIcon = (risk: Project["riskLevel"]) => {
    switch (risk) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    const matchesRisk =
      riskFilter === "all" || project.riskLevel === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const totalBudget = projects.reduce(
    (sum, project) => sum + project.budget,
    0,
  );
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
  const activeProjects = projects.filter((p) => p.status === "running").length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed",
  ).length;

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
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Lengkapi Data Readiness"
                          onClick={() =>
                            openReadinessForm(project.id, project.name)
                          }
                        >
                          <ClipboardCheck className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Risk Capture Assessment"
                          onClick={() =>
                            openRiskCaptureForm(project.id, project.name)
                          }
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
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
                          <Button variant="ghost" size="sm" title="View Details">
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
    </div>
  );
}
