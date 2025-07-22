import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
  Calendar,
  User,
  FileText,
  TrendingUp,
  XCircle,
  MapPin,
  DollarSign,
  BarChart3,
  Activity,
  Flag,
  Users,
  Shield,
  Target,
  Zap,
} from "lucide-react";

interface RiskItem {
  id: string;
  title: string;
  description: string;
  status: "overdue" | "inProcess" | "closed";
  priority: "critical" | "high" | "medium" | "low";
  assignee: string;
  dueDate: string;
  createdAt: string;
  project: string;
  lastUpdate?: string;
  impactLevel: "very-high" | "high" | "medium" | "low";
  likelihood: "very-likely" | "likely" | "possible" | "unlikely";
  mitigationPlan?: string;
  estimatedCost?: number;
  affectedAreas: string[];
  riskScore: number;
}

interface RiskCategoryDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    total: number;
    overdue: number;
    inProcess: number;
    closed: number;
  } | null;
}

// Enhanced detailed risk data
const generateMockRiskItems = (categoryId: string) => {
  const riskTemplates = {
    strategic: [
      {
        title: "Ketergantungan Vendor Tunggal Oracle Database",
        description: "Ketergantungan kritis pada Oracle untuk core banking system dengan risiko vendor lock-in dan eskalasi biaya lisensi tahunan",
        project: "Transformasi Digital Bank Central Indonesia",
        impactLevel: "very-high",
        likelihood: "likely",
        mitigationPlan: "Evaluasi multi-vendor strategy, implementasi database abstraction layer, negosiasi ulang kontrak jangka panjang",
        estimatedCost: 2500000000,
        affectedAreas: ["Core Banking", "Risk Management", "Customer Service"],
        riskScore: 85,
      },
      {
        title: "Perubahan Regulasi OJK tentang Digital Banking",
        description: "Regulasi baru OJK tentang layanan digital banking yang akan efektif Q2 2024 dapat mempengaruhi arsitektur sistem dan compliance requirement",
        project: "Platform E-Government Terpadu Kemendagri",
        impactLevel: "high",
        likelihood: "very-likely",
        mitigationPlan: "Konsultasi intensif dengan legal team, roadmap compliance 6 bulan, buffer development untuk regulatory changes",
        estimatedCost: 1800000000,
        affectedAreas: ["Legal Compliance", "Product Development", "Operations"],
        riskScore: 78,
      },
      {
        title: "Kompetitor Fintech dengan AI-Powered Features",
        description: "Pesaing meluncurkan fitur AI untuk credit scoring dan fraud detection yang dapat menggerus market share signifikan",
        project: "NextGen Mobile Banking Platform",
        impactLevel: "high",
        likelihood: "possible",
        mitigationPlan: "Accelerate AI development roadmap, partnership dengan AI vendors, customer retention program",
        estimatedCost: 3200000000,
        affectedAreas: ["Product Strategy", "Marketing", "Technology"],
        riskScore: 72,
      },
    ],
    operational: [
      {
        title: "Shortage Senior DevOps Engineers",
        description: "Kekurangan 5 senior DevOps engineers untuk mengelola infrastructure cloud hybrid dengan kompleksitas tinggi",
        project: "Cloud Migration Manufacturing ERP",
        impactLevel: "high",
        likelihood: "very-likely",
        mitigationPlan: "Accelerated hiring program, upskilling junior staff, outsourcing kritial tasks, retention bonus",
        estimatedCost: 1200000000,
        affectedAreas: ["Infrastructure", "Security", "Performance"],
        riskScore: 82,
      },
      {
        title: "Legacy System Integration dengan AS/400",
        description: "Integrasi sistem rumah sakit baru dengan AS/400 legacy system berusia 15 tahun tanpa dokumentasi lengkap",
        project: "Hospital Information System RS Fatmawati",
        impactLevel: "very-high",
        likelihood: "likely",
        mitigationPlan: "Reverse engineering documentation, gradual migration approach, parallel system implementation",
        estimatedCost: 2800000000,
        affectedAreas: ["Patient Care", "Billing", "Pharmacy"],
        riskScore: 88,
      },
      {
        title: "Infrastructure Capacity untuk Peak Traffic",
        description: "Load testing menunjukkan sistem akan crash pada 50,000 concurrent users, sementara target launch membutuhkan kapasitas 100,000 users",
        project: "Supply Chain Management Pertamina",
        impactLevel: "very-high",
        likelihood: "very-likely",
        mitigationPlan: "Auto-scaling implementation, CDN optimization, database sharding, load balancer upgrade",
        estimatedCost: 1500000000,
        affectedAreas: ["Performance", "User Experience", "Revenue"],
        riskScore: 92,
      },
    ],
    financial: [
      {
        title: "Currency Exchange Risk USD/IDR",
        description: "Fluktuasi nilai tukar USD/IDR dapat meningkatkan biaya cloud services AWS hingga 25% dari budget yang direncanakan",
        project: "Fintech Payment Gateway Integration",
        impactLevel: "high",
        likelihood: "likely",
        mitigationPlan: "Currency hedging strategy, multi-cloud approach, pricing review quarterly",
        estimatedCost: 2100000000,
        affectedAreas: ["Cost Management", "Profitability", "Cash Flow"],
        riskScore: 76,
      },
      {
        title: "Budget Overrun akibat Scope Creep",
        description: "Client menambah 15 fitur baru diluar kontrak initial, berpotensi meningkatkan budget 40% dari Rp 8.5M menjadi Rp 12M",
        project: "Smart City Dashboard Surabaya",
        impactLevel: "high",
        likelihood: "very-likely",
        mitigationPlan: "Change request formal process, re-negotiation kontrak, phased delivery approach",
        estimatedCost: 3500000000,
        affectedAreas: ["Project Profitability", "Resource Allocation", "Timeline"],
        riskScore: 84,
      },
    ],
    compliance: [
      {
        title: "GDPR & UU PDP Data Privacy Compliance",
        description: "Sistem e-commerce menyimpan data personal 2.5 juta user tanpa consent mechanism yang memadai sesuai UU PDP No.27/2022",
        project: "E-Commerce Platform Tokopedia",
        impactLevel: "very-high",
        likelihood: "very-likely",
        mitigationPlan: "Data audit comprehensive, consent management system, privacy by design implementation",
        estimatedCost: 1800000000,
        affectedAreas: ["Legal Risk", "User Trust", "Business Operations"],
        riskScore: 94,
      },
      {
        title: "ISO 27001 Security Audit Gap Analysis",
        description: "Pre-audit menunjukkan 23 non-conformities dari 114 control requirements untuk sertifikasi ISO 27001 yang diperlukan client",
        project: "Educational Platform Kemdikbud",
        impactLevel: "high",
        likelihood: "likely",
        mitigationPlan: "Remediation roadmap 90 hari, external consultant engagement, security training intensif",
        estimatedCost: 950000000,
        affectedAreas: ["Information Security", "Certification", "Market Access"],
        riskScore: 79,
      },
    ],
    project: [
      {
        title: "Critical Path Delay - Database Migration",
        description: "Migrasi database 500GB dari Oracle ke PostgreSQL mengalami delay 3 minggu dari jadwal, mengancam go-live target",
        project: "Tourism Portal Wonderful Indonesia",
        impactLevel: "very-high",
        likelihood: "very-likely",
        mitigationPlan: "24/7 migration team, parallel migration approach, rollback strategy preparation",
        estimatedCost: 1400000000,
        affectedAreas: ["Timeline", "Go-Live", "Stakeholder Confidence"],
        riskScore: 90,
      },
      {
        title: "Stakeholder Alignment - Multiple Decision Makers",
        description: "Konflik kepentingan antara 5 direktorat Kementerian Pertanian dalam penentuan final requirements sistem",
        project: "Agricultural Management System",
        impactLevel: "high",
        likelihood: "likely",
        mitigationPlan: "Stakeholder workshop series, decision matrix framework, executive sponsor involvement",
        estimatedCost: 800000000,
        affectedAreas: ["Requirements", "Timeline", "Budget"],
        riskScore: 74,
      },
      {
        title: "Critical Bug - Payment Processing Module",
        description: "Ditemukan race condition pada payment processing yang dapat menyebabkan double charging pada 0.3% transaksi",
        project: "Port Management System Pelindo",
        impactLevel: "very-high",
        likelihood: "very-likely",
        mitigationPlan: "Hotfix deployment, transaction reconciliation, automated testing enhancement",
        estimatedCost: 600000000,
        affectedAreas: ["Financial Accuracy", "User Trust", "Reputation"],
        riskScore: 96,
      },
    ],
    environment: [
      {
        title: "Carbon Footprint Data Center Operations",
        description: "Konsumsi energi data center melebihi target carbon neutral 2024 dengan 15% excess carbon emission",
        project: "Green Logistics Platform",
        impactLevel: "medium",
        likelihood: "likely",
        mitigationPlan: "Renewable energy transition, server optimization, carbon offset program",
        estimatedCost: 1200000000,
        affectedAreas: ["Sustainability", "Corporate Image", "Compliance"],
        riskScore: 65,
      },
      {
        title: "Green IT Certification Requirement",
        description: "Client government menambah requirement Green IT certification untuk semua sistem baru sesuai regulasi lingkungan terbaru",
        project: "Industrial IoT Monitoring",
        impactLevel: "medium",
        likelihood: "possible",
        mitigationPlan: "Green IT assessment, energy-efficient architecture, certification roadmap",
        estimatedCost: 750000000,
        affectedAreas: ["Certification", "Architecture", "Operations"],
        riskScore: 58,
      },
    ],
    it: [
      {
        title: "Advanced Persistent Threat (APT) Detection",
        description: "Sistem keamanan mendeteksi 3 anomali yang menunjukkan indikasi APT attack pada network manufacturing client",
        project: "Smart Factory Security System",
        impactLevel: "very-high",
        likelihood: "possible",
        mitigationPlan: "Immediate security hardening, forensic analysis, incident response team activation",
        estimatedCost: 2200000000,
        affectedAreas: ["Data Security", "Production", "Intellectual Property"],
        riskScore: 87,
      },
      {
        title: "Database Performance Bottleneck",
        description: "Query response time sistem tracking kelapa sawit meningkat 400% saat concurrent users > 1000, mengancam SLA 2 detik",
        project: "Palm Oil Supply Chain Tracking",
        impactLevel: "high",
        likelihood: "very-likely",
        mitigationPlan: "Database indexing optimization, query rewriting, horizontal scaling implementation",
        estimatedCost: 1100000000,
        affectedAreas: ["Performance", "User Experience", "SLA Compliance"],
        riskScore: 83,
      },
      {
        title: "Disaster Recovery Site Readiness",
        description: "DR site di Jakarta belum siap 100%, dengan RTO target 4 jam tetapi current capability 12 jam untuk full recovery",
        project: "Mining Operations Management System",
        impactLevel: "very-high",
        likelihood: "unlikely",
        mitigationPlan: "DR infrastructure acceleration, automated failover testing, backup strategy enhancement",
        estimatedCost: 3500000000,
        affectedAreas: ["Business Continuity", "Data Protection", "Operations"],
        riskScore: 71,
      },
    ],
    hr: [
      {
        title: "Key Personnel Retention Risk",
        description: "Tech Lead dan 2 Senior Architects mendapat offer dari kompetitor dengan salary 60% lebih tinggi",
        project: "Tourism Digital Platform",
        impactLevel: "very-high",
        likelihood: "likely",
        mitigationPlan: "Counter offer preparation, knowledge transfer acceleration, retention bonus program",
        estimatedCost: 1800000000,
        affectedAreas: ["Project Continuity", "Knowledge Management", "Team Morale"],
        riskScore: 89,
      },
      {
        title: "React Native Expertise Shortage",
        description: "Hanya 2 dari 8 mobile developers yang kompeten React Native untuk project cultural heritage yang membutuhkan 5 experts",
        project: "Cultural Heritage Digital Archive",
        impactLevel: "high",
        likelihood: "very-likely",
        mitigationPlan: "Intensive training program, external contractor hiring, technology stack review",
        estimatedCost: 900000000,
        affectedAreas: ["Technical Delivery", "Timeline", "Quality"],
        riskScore: 81,
      },
    ],
  };

  const templates = riskTemplates[categoryId as keyof typeof riskTemplates] || [];
  const statuses: ("overdue" | "inProcess" | "closed")[] = ["overdue", "inProcess", "closed"];
  const priorities: ("critical" | "high" | "medium" | "low")[] = ["critical", "high", "medium", "low"];
  const assignees = [
    "Ahmad Rahman (Risk Manager)",
    "Siti Nurhaliza (Security Lead)",
    "Budi Santoso (Project Manager)",
    "Maya Sari (Compliance Officer)",
    "Randi Pratama (Tech Lead)",
    "Dr. Indira Sari (Risk Analyst)",
    "Agus Wijaya (Operations Manager)"
  ];

  return templates.map((template, index) => ({
    id: `${categoryId}-${index + 1}`,
    title: template.title,
    description: template.description,
    status: statuses[index % statuses.length],
    priority: index === 0 ? "critical" : priorities[(index + 1) % priorities.length],
    assignee: assignees[index % assignees.length],
    dueDate: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - (30 - index * 3) * 24 * 60 * 60 * 1000).toISOString(),
    project: template.project,
    lastUpdate: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
    impactLevel: template.impactLevel,
    likelihood: template.likelihood,
    mitigationPlan: template.mitigationPlan,
    estimatedCost: template.estimatedCost,
    affectedAreas: template.affectedAreas,
    riskScore: template.riskScore,
  }));
};

const getStatusBadge = (status: "overdue" | "inProcess" | "closed") => {
  const config = {
    overdue: {
      label: "Overdue",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle,
    },
    inProcess: {
      label: "Dalam Mitigasi",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Activity,
    },
    closed: {
      label: "Closed",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
  };

  const statusConfig = config[status];
  const IconComponent = statusConfig.icon;

  return (
    <Badge className={`${statusConfig.color} border`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {statusConfig.label}
    </Badge>
  );
};

const getPriorityBadge = (priority: "critical" | "high" | "medium" | "low") => {
  const config = {
    critical: { label: "Critical", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Zap },
    high: { label: "High", color: "bg-red-100 text-red-800 border-red-200", icon: Flag },
    medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: AlertTriangle },
    low: { label: "Low", color: "bg-green-100 text-green-800 border-green-200", icon: Target },
  };

  const priorityConfig = config[priority];
  const IconComponent = priorityConfig.icon;
  return (
    <Badge className={`${priorityConfig.color} border`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {priorityConfig.label}
    </Badge>
  );
};

const getImpactBadge = (impact: "very-high" | "high" | "medium" | "low") => {
  const config = {
    "very-high": { label: "Very High", color: "bg-red-600 text-white" },
    high: { label: "High", color: "bg-orange-500 text-white" },
    medium: { label: "Medium", color: "bg-yellow-500 text-white" },
    low: { label: "Low", color: "bg-green-500 text-white" },
  };

  const impactConfig = config[impact];
  return <Badge className={impactConfig.color}>{impactConfig.label}</Badge>;
};

const getLikelihoodBadge = (likelihood: "very-likely" | "likely" | "possible" | "unlikely") => {
  const config = {
    "very-likely": { label: "Very Likely", color: "bg-red-100 text-red-800" },
    likely: { label: "Likely", color: "bg-orange-100 text-orange-800" },
    possible: { label: "Possible", color: "bg-yellow-100 text-yellow-800" },
    unlikely: { label: "Unlikely", color: "bg-green-100 text-green-800" },
  };

  const likelihoodConfig = config[likelihood];
  return <Badge variant="outline" className={likelihoodConfig.color}>{likelihoodConfig.label}</Badge>;
};

const getRiskScoreColor = (score: number) => {
  if (score >= 90) return "text-red-600 font-bold";
  if (score >= 80) return "text-orange-600 font-semibold";
  if (score >= 70) return "text-yellow-600 font-medium";
  return "text-green-600";
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function RiskCategoryDetailDialog({
  isOpen,
  onClose,
  category,
}: RiskCategoryDetailDialogProps) {
  if (!category) return null;

  const riskItems = generateMockRiskItems(category.id);
  const overdueItems = riskItems.filter((item) => item.status === "overdue");
  const inProcessItems = riskItems.filter((item) => item.status === "inProcess");
  const closedItems = riskItems.filter((item) => item.status === "closed");

  const IconComponent = category.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <IconComponent className="h-6 w-6 text-blue-600" />
            Detail Risiko: {category.name}
          </DialogTitle>
          <DialogDescription>
            Detail breakdown risiko berdasarkan status untuk kategori {category.name}
          </DialogDescription>
        </DialogHeader>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Total Risiko
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {category.total}
              </div>
              <p className="text-xs text-gray-500 mt-1">Seluruh kategori risiko</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {category.overdue}
              </div>
              <p className="text-xs text-red-500 mt-1">Memerlukan aksi segera</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Dalam Mitigasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {category.inProcess}
              </div>
              <p className="text-xs text-blue-500 mt-1">Sedang ditangani</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Selesai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {category.closed}
              </div>
              <p className="text-xs text-green-500 mt-1">Berhasil dimitigasi</p>
            </CardContent>
          </Card>
        </div>

        {/* Risk Analysis Summary */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Shield className="w-5 h-5" />
              Analisis Risiko {category.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {Math.round(riskItems.reduce((sum, item) => sum + item.riskScore, 0) / riskItems.length)}
                </div>
                <p className="text-sm text-gray-600">Rata-rata Risk Score</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {riskItems.filter(item => item.priority === 'critical').length}
                </div>
                <p className="text-sm text-gray-600">Risiko Critical</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {formatCurrency(riskItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0))}
                </div>
                <p className="text-sm text-gray-600">Total Estimasi Biaya</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Risk Items */}
        <div className="space-y-6">
          {/* Overdue Items */}
          {overdueItems.length > 0 && (
            <Card>
              <CardHeader className="bg-red-100 border-b">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  Risiko Overdue - Membutuhkan Aksi Segera ({overdueItems.length})
                </CardTitle>
                <p className="text-sm text-red-600 mt-1">Risiko yang melewati deadline dan berpotensi menimbulkan dampak signifikan</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {overdueItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-red-200 rounded-lg p-6 bg-red-50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="font-bold text-lg text-gray-900 flex-1">
                              {item.title}
                            </h4>
                            <div className={`text-lg font-bold ${getRiskScoreColor(item.riskScore)}`}>
                              {item.riskScore}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {getStatusBadge(item.status)}
                            {getPriorityBadge(item.priority)}
                            {getImpactBadge(item.impactLevel)}
                            {getLikelihoodBadge(item.likelihood)}
                          </div>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            {item.description}
                          </p>

                          {/* Project and Assignment Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                            <div className="flex items-center gap-2 p-2 bg-white rounded border">
                              <FileText className="w-4 h-4 text-blue-500" />
                              <div>
                                <span className="font-medium text-gray-700">Project:</span>
                                <p className="text-gray-600">{item.project}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded border">
                              <User className="w-4 h-4 text-green-500" />
                              <div>
                                <span className="font-medium text-gray-700">PIC:</span>
                                <p className="text-gray-600">{item.assignee}</p>
                              </div>
                            </div>
                          </div>

                          {/* Timeline and Cost */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-orange-500" />
                              <div>
                                <span className="font-medium text-gray-700">Target:</span>
                                <p className="text-gray-600">{formatDate(item.dueDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-purple-500" />
                              <div>
                                <span className="font-medium text-gray-700">Est. Cost:</span>
                                <p className="text-gray-600">{formatCurrency(item.estimatedCost || 0)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <div>
                                <span className="font-medium text-gray-700">Created:</span>
                                <p className="text-gray-600">{formatDate(item.createdAt)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Affected Areas */}
                          <div className="mb-4">
                            <span className="font-medium text-gray-700 mb-2 block">Affected Areas:</span>
                            <div className="flex flex-wrap gap-1">
                              {item.affectedAreas.map((area, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Mitigation Plan */}
                          {item.mitigationPlan && (
                            <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                              <span className="font-medium text-gray-700 mb-1 block flex items-center gap-2">
                                <Shield className="w-4 h-4 text-blue-500" />
                                Rencana Mitigasi:
                              </span>
                              <p className="text-sm text-gray-600 leading-relaxed">{item.mitigationPlan}</p>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <Button variant="outline" size="sm" className="mb-2">
                            <Eye className="w-4 h-4 mr-2" />
                            Detail
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* In Process Items */}
          {inProcessItems.length > 0 && (
            <Card>
              <CardHeader className="bg-blue-100 border-b">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Activity className="w-5 h-5" />
                  Risiko Dalam Proses Mitigasi ({inProcessItems.length})
                </CardTitle>
                <p className="text-sm text-blue-600 mt-1">Risiko yang sedang ditangani dengan rencana mitigasi aktif</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inProcessItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-blue-200 rounded-lg p-6 bg-blue-50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="font-bold text-lg text-gray-900 flex-1">
                              {item.title}
                            </h4>
                            <div className={`text-lg font-bold ${getRiskScoreColor(item.riskScore)}`}>
                              {item.riskScore}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {getStatusBadge(item.status)}
                            {getPriorityBadge(item.priority)}
                            {getImpactBadge(item.impactLevel)}
                            {getLikelihoodBadge(item.likelihood)}
                          </div>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            {item.description}
                          </p>

                          {/* Project and Assignment Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                            <div className="flex items-center gap-2 p-2 bg-white rounded border">
                              <FileText className="w-4 h-4 text-blue-500" />
                              <div>
                                <span className="font-medium text-gray-700">Project:</span>
                                <p className="text-gray-600">{item.project}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded border">
                              <User className="w-4 h-4 text-green-500" />
                              <div>
                                <span className="font-medium text-gray-700">PIC:</span>
                                <p className="text-gray-600">{item.assignee}</p>
                              </div>
                            </div>
                          </div>

                          {/* Timeline and Cost */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-orange-500" />
                              <div>
                                <span className="font-medium text-gray-700">Target:</span>
                                <p className="text-gray-600">{formatDate(item.dueDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-purple-500" />
                              <div>
                                <span className="font-medium text-gray-700">Est. Cost:</span>
                                <p className="text-gray-600">{formatCurrency(item.estimatedCost || 0)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-blue-500" />
                              <div>
                                <span className="font-medium text-gray-700">Update:</span>
                                <p className="text-gray-600">{formatDateTime(item.lastUpdate!)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Affected Areas */}
                          <div className="mb-4">
                            <span className="font-medium text-gray-700 mb-2 block">Affected Areas:</span>
                            <div className="flex flex-wrap gap-1">
                              {item.affectedAreas.map((area, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Mitigation Plan */}
                          {item.mitigationPlan && (
                            <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                              <span className="font-medium text-gray-700 mb-1 block flex items-center gap-2">
                                <Shield className="w-4 h-4 text-blue-500" />
                                Rencana Mitigasi:
                              </span>
                              <p className="text-sm text-gray-600 leading-relaxed">{item.mitigationPlan}</p>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <Button variant="outline" size="sm" className="mb-2">
                            <Eye className="w-4 h-4 mr-2" />
                            Detail
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Closed Items */}
          {closedItems.length > 0 && (
            <Card>
              <CardHeader className="bg-green-100 border-b">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  Risiko Berhasil Dimitigasi ({closedItems.length})
                </CardTitle>
                <p className="text-sm text-green-600 mt-1">Risiko yang telah berhasil diselesaikan dan tidak lagi menimbulkan ancaman</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {closedItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-green-200 rounded-lg p-6 bg-green-50 hover:shadow-md transition-shadow opacity-90"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="font-bold text-lg text-gray-900 flex-1">
                              {item.title}
                            </h4>
                            <div className={`text-lg font-bold ${getRiskScoreColor(item.riskScore)}`}>
                              {item.riskScore}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {getStatusBadge(item.status)}
                            {getPriorityBadge(item.priority)}
                            {getImpactBadge(item.impactLevel)}
                            {getLikelihoodBadge(item.likelihood)}
                          </div>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            {item.description}
                          </p>

                          {/* Project and Assignment Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                            <div className="flex items-center gap-2 p-2 bg-white rounded border">
                              <FileText className="w-4 h-4 text-blue-500" />
                              <div>
                                <span className="font-medium text-gray-700">Project:</span>
                                <p className="text-gray-600">{item.project}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded border">
                              <User className="w-4 h-4 text-green-500" />
                              <div>
                                <span className="font-medium text-gray-700">PIC:</span>
                                <p className="text-gray-600">{item.assignee}</p>
                              </div>
                            </div>
                          </div>

                          {/* Resolution Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <div>
                                <span className="font-medium text-gray-700">Resolved:</span>
                                <p className="text-gray-600">{formatDate(item.dueDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-purple-500" />
                              <div>
                                <span className="font-medium text-gray-700">Final Cost:</span>
                                <p className="text-gray-600">{formatCurrency(item.estimatedCost || 0)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <div>
                                <span className="font-medium text-gray-700">Duration:</span>
                                <p className="text-gray-600">
                                  {Math.ceil((new Date(item.dueDate).getTime() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24))} hari
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Affected Areas */}
                          <div className="mb-4">
                            <span className="font-medium text-gray-700 mb-2 block">Areas Resolved:</span>
                            <div className="flex flex-wrap gap-1">
                              {item.affectedAreas.map((area, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-green-100">
                                  ✓ {area}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Success Story */}
                          {item.mitigationPlan && (
                            <div className="bg-white p-3 rounded border-l-4 border-green-400">
                              <span className="font-medium text-gray-700 mb-1 block flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Solusi yang Diterapkan:
                              </span>
                              <p className="text-sm text-gray-600 leading-relaxed">{item.mitigationPlan}</p>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <Button variant="outline" size="sm" className="mb-2">
                            <Eye className="w-4 h-4 mr-2" />
                            Detail
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="bg-gray-50 pt-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Tutup
            </Button>
            <Button variant="outline" className="flex-1">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analisis Trend
            </Button>
            <Button className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
