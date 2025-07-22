import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  GitBranch,
  ClipboardCheck,
  MapPin,
  Target,
  Activity,
  FileText,
  Briefcase,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { ProjectReadinessForm } from "@/components/project/ProjectReadinessForm";

interface Project {
  id: string;
  name: string;
  client: string;
  status: "running" | "completed" | "on-hold" | "planning";
  riskLevel: "low" | "medium" | "high";
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  teamSize: number;
  progress: number;
  lastUpdate: string;
  readinessStatus?: "not-started" | "in-progress" | "completed";
  readinessScore?: number;
  description?: string;
  objectives?: string[];
  deliverables?: string[];
  technologies?: string[];
  location?: string;
  projectManager?: string;
  clientContact?: string;
  risks?: { description: string; impact: string; mitigation: string }[];
}

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [readinessForm, setReadinessForm] = useState<{
    isOpen: boolean;
    projectId: string;
    projectName: string;
  }>({ isOpen: false, projectId: "", projectName: "" });

  // Mock project data - in real app, this would come from API
  const projects: Project[] = [
    {
      id: "PRJ-001",
      name: "Sistem ERP Perusahaan",
      client: "PT. Teknologi Maju",
      status: "running",
      riskLevel: "medium",
      budget: 2500000000,
      spent: 1800000000,
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      teamSize: 8,
      progress: 72,
      lastUpdate: "2024-01-20",
      readinessStatus: "in-progress",
      readinessScore: 65,
      description:
        "Pengembangan sistem ERP terintegrasi untuk mengelola seluruh proses bisnis perusahaan mulai dari inventory, finance, HR, hingga customer relationship management.",
      objectives: [
        "Meningkatkan efisiensi operasional perusahaan sebesar 40%",
        "Mengintegrasikan semua departemen dalam satu sistem",
        "Menyediakan real-time reporting dan analytics",
        "Mengurangi manual processing sebesar 80%",
      ],
      deliverables: [
        "Modul Inventory Management",
        "Modul Financial Management",
        "Modul Human Resources",
        "Modul Customer Relationship Management",
        "Dashboard Analytics",
        "Mobile Application",
        "Training dan Dokumentasi",
      ],
      technologies: [
        "React",
        "Node.js",
        "PostgreSQL",
        "Redis",
        "Docker",
        "AWS",
      ],
      location: "Jakarta, Indonesia",
      projectManager: "Andi Susanto",
      clientContact: "Budi Hartono (CTO)",
      risks: [
        {
          description: "Integrasi dengan sistem legacy yang kompleks",
          impact: "High",
          mitigation:
            "Melakukan thorough analysis dan POC sebelum implementasi",
        },
        {
          description: "Perubahan requirement dari client",
          impact: "Medium",
          mitigation: "Weekly review meeting dan dokumentasi yang detail",
        },
      ],
    },
    {
      id: "PRJ-002",
      name: "Mobile Banking App",
      client: "Bank Digital Nusantara",
      status: "running",
      riskLevel: "low",
      budget: 1800000000,
      spent: 900000000,
      startDate: "2024-02-01",
      endDate: "2024-07-15",
      teamSize: 6,
      progress: 45,
      lastUpdate: "2024-01-19",
      readinessStatus: "completed",
      readinessScore: 95,
      description:
        "Pengembangan aplikasi mobile banking dengan fitur lengkap untuk nasabah Bank Digital Nusantara, termasuk transfer, pembayaran, investasi, dan layanan perbankan digital lainnya.",
      objectives: [
        "Menyediakan layanan perbankan 24/7 melalui mobile",
        "Meningkatkan customer engagement sebesar 60%",
        "Mengurangi beban operasional cabang sebesar 30%",
        "Implementasi security standard tingkat enterprise",
      ],
      deliverables: [
        "iOS Mobile Application",
        "Android Mobile Application",
        "Backend API Services",
        "Admin Dashboard",
        "Security Implementation",
        "Testing & QA Documentation",
      ],
      technologies: [
        "React Native",
        "Node.js",
        "MongoDB",
        "Firebase",
        "JWT",
        "Kubernetes",
      ],
      location: "Surabaya, Indonesia",
      projectManager: "Sari Wijaya",
      clientContact: "Denny Kurniawan (Head of Digital)",
      risks: [
        {
          description: "Compliance dengan regulasi Bank Indonesia",
          impact: "High",
          mitigation: "Konsultasi rutin dengan legal team dan BI",
        },
      ],
    },
    {
      id: "PRJ-003",
      name: "Dashboard Analytics",
      client: "PT. Data Insights",
      status: "completed",
      riskLevel: "low",
      budget: 850000000,
      spent: 820000000,
      startDate: "2023-11-01",
      endDate: "2024-01-15",
      teamSize: 4,
      progress: 100,
      lastUpdate: "2024-01-15",
      readinessStatus: "completed",
      readinessScore: 100,
      description:
        "Pengembangan dashboard analytics untuk monitoring dan analisis data bisnis real-time dengan visualisasi interaktif dan reporting otomatis.",
      objectives: [
        "Menyediakan insights bisnis real-time",
        "Mengotomatisasi proses reporting bulanan",
        "Meningkatkan data-driven decision making",
        "Integrasi dengan multiple data sources",
      ],
      deliverables: [
        "Web Dashboard Application",
        "Data Pipeline & ETL",
        "Reporting Engine",
        "User Management System",
        "API Documentation",
        "Training Materials",
      ],
      technologies: [
        "Vue.js",
        "Python",
        "Apache Spark",
        "PostgreSQL",
        "Redis",
        "Grafana",
      ],
      location: "Bandung, Indonesia",
      projectManager: "Rini Kusuma",
      clientContact: "Alex Rahman (Data Manager)",
      risks: [],
    },
    {
      id: "PRJ-004",
      name: "E-commerce Platform",
      client: "Toko Online Sejahtera",
      status: "running",
      riskLevel: "high",
      budget: 3200000000,
      spent: 2100000000,
      startDate: "2023-12-01",
      endDate: "2024-05-30",
      teamSize: 12,
      progress: 68,
      lastUpdate: "2024-01-18",
      readinessStatus: "in-progress",
      readinessScore: 40,
      description:
        "Pengembangan platform e-commerce lengkap dengan fitur marketplace, payment gateway, inventory management, dan seller dashboard untuk mendukung ekosistem digital commerce.",
      objectives: [
        "Membangun marketplace dengan 1000+ sellers",
        "Mengintegrasikan multiple payment methods",
        "Menyediakan logistics tracking terintegrasi",
        "Mencapai 99.9% uptime availability",
      ],
      deliverables: [
        "Customer Web Platform",
        "Seller Dashboard",
        "Admin Management System",
        "Mobile Applications (iOS & Android)",
        "Payment Gateway Integration",
        "Logistics API Integration",
        "Analytics & Reporting System",
      ],
      technologies: [
        "Next.js",
        "Microservices",
        "PostgreSQL",
        "Redis",
        "RabbitMQ",
        "Docker",
        "AWS",
      ],
      location: "Jakarta, Indonesia",
      projectManager: "Bambang Setiawan",
      clientContact: "Linda Sari (CEO)",
      risks: [
        {
          description: "High traffic load during promotional events",
          impact: "High",
          mitigation: "Implement auto-scaling dan load testing",
        },
        {
          description: "Complex payment gateway integrations",
          impact: "Medium",
          mitigation: "Phased integration approach dengan extensive testing",
        },
        {
          description: "Timeline pressure untuk go-live",
          impact: "High",
          mitigation: "Agile development dengan weekly sprint reviews",
        },
      ],
    },
    {
      id: "PRJ-005",
      name: "HR Management System",
      client: "PT. Sumber Daya Prima",
      status: "planning",
      riskLevel: "medium",
      budget: 1500000000,
      spent: 0,
      startDate: "2024-02-15",
      endDate: "2024-08-30",
      teamSize: 5,
      progress: 0,
      lastUpdate: "2024-01-21",
      readinessStatus: "not-started",
      readinessScore: 10,
      description:
        "Pengembangan sistem manajemen HR komprehensif untuk mengelola employee lifecycle, payroll, performance management, dan talent development.",
      objectives: [
        "Digitalisasi proses HR end-to-end",
        "Mengotomatisasi payroll calculation",
        "Implementasi performance review system",
        "Menyediakan employee self-service portal",
      ],
      deliverables: [
        "Employee Management System",
        "Payroll Processing Engine",
        "Performance Management Module",
        "Leave Management System",
        "Employee Self-Service Portal",
        "HR Analytics Dashboard",
      ],
      technologies: [
        "Angular",
        "Spring Boot",
        "MySQL",
        "Apache Kafka",
        "Jenkins",
      ],
      location: "Medan, Indonesia",
      projectManager: "Dewi Ayu",
      clientContact: "Hendra Wijaya (HR Director)",
      risks: [
        {
          description: "Complex payroll calculation rules",
          impact: "Medium",
          mitigation: "Detailed requirement gathering dan pilot testing",
        },
      ],
    },
    {
      id: "PRJ-006",
      name: "Inventory Management",
      client: "PT. Logistik Global",
      status: "on-hold",
      riskLevel: "high",
      budget: 2200000000,
      spent: 1100000000,
      startDate: "2023-10-15",
      endDate: "2024-04-30",
      teamSize: 7,
      progress: 50,
      lastUpdate: "2024-01-10",
      readinessStatus: "in-progress",
      readinessScore: 75,
      description:
        "Sistem manajemen inventory terintegrasi dengan WMS (Warehouse Management System) untuk optimasi supply chain dan tracking real-time.",
      objectives: [
        "Optimasi inventory turnover sebesar 25%",
        "Real-time tracking untuk semua warehouse",
        "Integrasi dengan supplier dan customer systems",
        "Implementasi predictive analytics untuk demand forecasting",
      ],
      deliverables: [
        "Warehouse Management System",
        "Inventory Tracking Module",
        "Supplier Integration API",
        "Demand Forecasting Engine",
        "Mobile Warehouse App",
        "Reporting Dashboard",
      ],
      technologies: [
        "React",
        "Java Spring",
        "Oracle DB",
        "Apache Kafka",
        "TensorFlow",
      ],
      location: "Surabaya, Indonesia",
      projectManager: "Agus Pramono",
      clientContact: "Rina Sari (Operations Manager)",
      risks: [
        {
          description: "Integration dengan legacy ERP system",
          impact: "High",
          mitigation: "Phased migration approach dengan parallel running",
        },
        {
          description: "Data migration dari multiple sources",
          impact: "High",
          mitigation: "Comprehensive data mapping dan validation process",
        },
      ],
    },
  ];

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Project Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Project dengan ID "{projectId}" tidak ditemukan.
          </p>
          <Link to="/projects">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke List Project
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const openReadinessForm = (projectId: string, projectName: string) => {
    setReadinessForm({ isOpen: true, projectId, projectName });
  };

  const closeReadinessForm = () => {
    setReadinessForm({ isOpen: false, projectId: "", projectName: "" });
  };

  const handleReadinessSave = (data: any) => {
    console.log("Readiness data saved:", data);
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

  const getRiskIcon = (risk: Project["riskLevel"]) => {
    switch (risk) {
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "medium":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "low":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const budgetUtilization = (project.spent / project.budget) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              {project.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Client: {project.client} • ID: {project.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => openReadinessForm(project.id, project.name)}
            className="flex items-center gap-2"
          >
            <ClipboardCheck className="w-4 h-4" />
            Project Readiness
          </Button>
          <Link to={`/projects/${project.id}/timeline`}>
            <Button variant="outline" className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Timeline
            </Button>
          </Link>
          <Button className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Project
          </Button>
        </div>
      </div>

      {/* Status and Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <div className="mt-2">{getStatusBadge(project.status)}</div>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Level</p>
                <div className="mt-2 flex items-center gap-2">
                  {getRiskIcon(project.riskLevel)}
                  {getRiskBadge(project.riskLevel)}
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {project.progress}%
                    </span>
                  </div>
                  <Progress value={project.progress} className="w-full" />
                </div>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Size</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {project.teamSize}
                </p>
                <p className="text-xs text-gray-500">members</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Informasi Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Deskripsi</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {project.description}
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Project Manager
                </h4>
                <p className="text-gray-700 text-sm">
                  {project.projectManager}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Client Contact
                </h4>
                <p className="text-gray-700 text-sm">{project.clientContact}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Lokasi</h4>
                <p className="text-gray-700 text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {project.location}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Last Update</h4>
                <p className="text-gray-700 text-sm">
                  {new Date(project.lastUpdate).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline and Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Timeline & Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </h4>
                <p className="text-gray-700 text-sm">
                  {new Date(project.startDate).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  End Date
                </h4>
                <p className="text-gray-700 text-sm">
                  {new Date(project.endDate).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Budget Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Budget:</span>
                    <span className="font-medium">
                      {formatCurrency(project.budget)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-medium">
                      {formatCurrency(project.spent)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(project.budget - project.spent)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Budget Utilization</span>
                      <span>{budgetUtilization.toFixed(1)}%</span>
                    </div>
                    <Progress value={budgetUtilization} className="w-full" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Objectives and Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {project.objectives?.map((objective, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deliverables</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {project.deliverables?.map((deliverable, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{deliverable}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Technologies and Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-50 text-blue-700"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {project.risks && project.risks.length > 0 ? (
              <div className="space-y-3">
                {project.risks.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {risk.description}
                      </h4>
                      <Badge
                        className={`text-xs ${
                          risk.impact === "High"
                            ? "bg-red-100 text-red-800"
                            : risk.impact === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {risk.impact}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      <strong>Mitigation:</strong> {risk.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Tidak ada risk yang teridentifikasi
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Project Readiness Form */}
      <ProjectReadinessForm
        isOpen={readinessForm.isOpen}
        onClose={closeReadinessForm}
        projectId={readinessForm.projectId}
        projectName={readinessForm.projectName}
        onSave={handleReadinessSave}
      />
    </div>
  );
}
