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
  sasaran: string;
  kode: string;
  taksonomi: string;
  peristiwaRisiko: string;
  sumberRisiko: string;
  dampakKualitatif: string;
  dampakKuantitatif: string;
  kontrolEksisting: string;
  status: "overdue" | "inProcess" | "closed";
  assignee: string;
  dueDate: string;
  createdAt: string;
  project: string;
  lastUpdate?: string;
  risikoAwal: {
    kejadian: number;
    dampak: number;
    level: number;
  };
  resikoAkhir: {
    kejadian: number;
    dampak: number;
    level: number;
  };
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

// Risk data sesuai dengan struktur Risk Capture Form
const generateMockRiskItems = (categoryId: string) => {
  const riskTemplates = {
    strategic: [
      {
        sasaran: "Kestabilan Platform Digital Banking",
        kode: "STR001",
        taksonomi: "Risiko Strategis - Vendor Management",
        peristiwaRisiko: "Ketergantungan pada vendor Oracle Database yang dapat menyebabkan vendor lock-in dan eskalasi biaya lisensi tahunan",
        sumberRisiko: "Kebijakan vendor, kontrak jangka panjang, ketergantungan teknologi",
        dampakKualitatif: "Gangguan operasional sistem banking, keterbatasan fleksibilitas teknologi, risiko discontinuation",
        dampakKuantitatif: "Potensi kenaikan biaya lisensi 25-40% per tahun, biaya migrasi sistem Rp 2.5M jika vendor bermasalah",
        kontrolEksisting: "Kontrak Service Level Agreement, backup vendor relationship, dokumentasi arsitektur sistem",
        project: "Transformasi Digital Bank Central Indonesia",
        risikoAwal: { kejadian: 15, dampak: 20, level: 18 },
        resikoAkhir: { kejadian: 8, dampak: 15, level: 12 }
      },
      {
        sasaran: "Compliance Regulasi Digital Banking",
        kode: "STR002",
        taksonomi: "Risiko Strategis - Regulatory Compliance",
        peristiwaRisiko: "Perubahan regulasi OJK tentang layanan digital banking yang akan efektif Q2 2024 dapat mempengaruhi arsitektur sistem",
        sumberRisiko: "Perubahan kebijakan regulator, evolusi standar industri, compliance requirement baru",
        dampakKualitatif: "Non-compliance penalty, reputasi perusahaan, gangguan layanan kepada nasabah",
        dampakKuantitatif: "Denda regulasi hingga Rp 1.8M, biaya re-development sistem Rp 3.2M, kerugian reputasi",
        kontrolEksisting: "Tim legal compliance, monitoring regulasi berkala, relationship dengan regulator",
        project: "Platform E-Government Terpadu Kemendagri",
        risikoAwal: { kejadian: 18, dampak: 22, level: 20 },
        resikoAkhir: { kejadian: 10, dampak: 18, level: 14 }
      },
      {
        sasaran: "Kompetitivitas Produk Fintech",
        kode: "STR003",
        taksonomi: "Risiko Strategis - Market Competition",
        peristiwaRisiko: "Pesaing meluncurkan fitur AI untuk credit scoring dan fraud detection yang dapat menggerus market share",
        sumberRisiko: "Inovasi competitor, perkembangan teknologi AI, customer preference shift",
        dampakKualitatif: "Kehilangan competitive advantage, penurunan customer acquisition, brand positioning",
        dampakKuantitatif: "Penurunan market share 15-25%, loss revenue Rp 5.2M, R&D investment Rp 3.8M",
        kontrolEksisting: "Market intelligence, R&D investment, partnership teknologi, customer retention program",
        project: "NextGen Mobile Banking Platform",
        risikoAwal: { kejadian: 16, dampak: 19, level: 17 },
        resikoAkhir: { kejadian: 12, dampak: 14, level: 13 }
      }
    ],
    operational: [
      {
        sasaran: "Kapasitas Tim DevOps",
        kode: "OPR001",
        taksonomi: "Risiko Operasional - Human Resources",
        peristiwaRisiko: "Kekurangan 5 senior DevOps engineers untuk mengelola infrastructure cloud hybrid dengan kompleksitas tinggi",
        sumberRisiko: "Talent shortage, kompetisi salary market, complexity teknologi, skill gap",
        dampakKualitatif: "Delayed deployment, reduced system reliability, team burnout, knowledge bottleneck",
        dampakKuantitatif: "Project delay 2-3 bulan, overtime cost Rp 1.2M, recruitment cost Rp 800K",
        kontrolEksisting: "Training program, external consultant, documentation, knowledge sharing session",
        project: "Cloud Migration Manufacturing ERP",
        risikoAwal: { kejadian: 20, dampak: 18, level: 19 },
        resikoAkhir: { kejadian: 12, dampak: 15, level: 13 }
      },
      {
        sasaran: "Integrasi Sistem Legacy",
        kode: "OPR002",
        taksonomi: "Risiko Operasional - System Integration",
        peristiwaRisiko: "Kompleksitas integrasi dengan AS/400 legacy system berusia 15 tahun tanpa dokumentasi lengkap",
        sumberRisiko: "Legacy system limitation, missing documentation, obsolete technology, vendor support",
        dampakKualitatif: "Data inconsistency, system downtime, user experience degradation, operational disruption",
        dampakKuantitatif: "Integration cost Rp 2.8M, downtime loss Rp 1.5M/hari, maintenance cost increase 40%",
        kontrolEksisting: "Reverse engineering, parallel system, phased migration, expert consultation",
        project: "Hospital Information System RS Fatmawati",
        risikoAwal: { kejadian: 22, dampak: 25, level: 23 },
        resikoAkhir: { kejadian: 15, dampak: 20, level: 17 }
      },
      {
        sasaran: "Kapasitas Infrastruktur",
        kode: "OPR003",
        taksonomi: "Risiko Operasional - Infrastructure Capacity",
        peristiwaRisiko: "Load testing menunjukkan sistem crash pada 50K concurrent users, target launch butuh 100K capacity",
        sumberRisiko: "Infrastructure limitation, scaling challenges, performance bottleneck, resource constraint",
        dampakKualitatif: "System crash, poor user experience, service unavailability, customer dissatisfaction",
        dampakKuantitatif: "Infrastructure upgrade Rp 1.5M, revenue loss Rp 2.2M/hari, SLA penalty Rp 500K",
        kontrolEksisting: "Auto-scaling, CDN implementation, load balancer, performance monitoring",
        project: "Supply Chain Management Pertamina",
        risikoAwal: { kejadian: 25, dampak: 23, level: 24 },
        resikoAkhir: { kejadian: 10, dampak: 18, level: 14 }
      }
    ],
    financial: [
      {
        sasaran: "Stabilitas Biaya Operasional",
        kode: "FIN001",
        taksonomi: "Risiko Keuangan - Currency Exchange",
        peristiwaRisiko: "Fluktuasi nilai tukar USD/IDR dapat meningkatkan biaya cloud services AWS hingga 25% dari budget",
        sumberRisiko: "Currency volatility, global economic condition, monetary policy, exchange rate fluctuation",
        dampakKualitatif: "Budget overrun, cash flow pressure, profitability impact, planning uncertainty",
        dampakKuantitatif: "Additional cost Rp 2.1M annually, hedging cost Rp 150K, budget variance 15-25%",
        kontrolEksisting: "Currency hedging, multi-cloud strategy, quarterly pricing review, budget buffer",
        project: "Fintech Payment Gateway Integration",
        risikoAwal: { kejadian: 18, dampak: 16, level: 17 },
        resikoAkhir: { kejadian: 12, dampak: 12, level: 12 }
      },
      {
        sasaran: "Budget Control dan Profitabilitas",
        kode: "FIN002",
        taksonomi: "Risiko Keuangan - Scope Management",
        peristiwaRisiko: "Client menambah 15 fitur baru diluar kontrak, berpotensi budget overrun 40% dari Rp 8.5M ke Rp 12M",
        sumberRisiko: "Scope creep, change request, client expectation, contract ambiguity",
        dampakKualitatif: "Reduced profitability, resource strain, timeline pressure, team morale impact",
        dampakKuantitatif: "Additional cost Rp 3.5M, margin reduction 25%, resource overtime Rp 800K",
        kontrolEksisting: "Change request process, contract clarity, scope documentation, stakeholder alignment",
        project: "Smart City Dashboard Surabaya",
        risikoAwal: { kejadian: 20, dampak: 19, level: 19 },
        resikoAkhir: { kejadian: 8, dampak: 12, level: 10 }
      }
    ],
    compliance: [
      {
        sasaran: "Data Privacy Compliance",
        kode: "COM001",
        taksonomi: "Risiko Kepatuhan - Data Protection",
        peristiwaRisiko: "Sistem menyimpan data personal 2.5 juta user tanpa consent mechanism sesuai UU PDP No.27/2022",
        sumberRisiko: "Regulatory requirement, data protection law, privacy regulation, consent management",
        dampakKualitatif: "Legal penalty, user trust loss, reputation damage, business operation disruption",
        dampakKuantitatif: "Compliance cost Rp 1.8M, potential fine Rp 5M, remediation cost Rp 2.2M",
        kontrolEksisting: "Privacy by design, consent management system, data audit, legal consultation",
        project: "E-Commerce Platform Tokopedia",
        risikoAwal: { kejadian: 23, dampak: 25, level: 24 },
        resikoAkhir: { kejadian: 8, dampak: 15, level: 11 }
      },
      {
        sasaran: "Security Certification",
        kode: "COM002",
        taksonomi: "Risiko Kepatuhan - Information Security",
        peristiwaRisiko: "Pre-audit menunjukkan 23 non-conformities dari 114 ISO 27001 control requirements",
        sumberRisiko: "Security standard requirement, audit finding, control implementation gap, certification timeline",
        dampakKualitatif: "Certification delay, market access limitation, client confidence impact, competitive disadvantage",
        dampakKuantitatif: "Remediation cost Rp 950K, consultant fee Rp 400K, potential business loss Rp 1.2M",
        kontrolEksisting: "Security framework, external consultant, remediation plan, training program",
        project: "Educational Platform Kemdikbud",
        risikoAwal: { kejadian: 19, dampak: 17, level: 18 },
        resikoAkhir: { kejadian: 10, dampak: 12, level: 11 }
      }
    ],
    project: [
      {
        sasaran: "Timeline Project Delivery",
        kode: "PRJ001",
        taksonomi: "Risiko Proyek - Critical Path",
        peristiwaRisiko: "Migrasi database 500GB dari Oracle ke PostgreSQL delay 3 minggu, mengancam go-live target",
        sumberRisiko: "Technical complexity, data migration challenge, resource constraint, timeline pressure",
        dampakKualitatif: "Go-live delay, stakeholder confidence loss, contract penalty, team stress",
        dampakKuantitatif: "Penalty cost Rp 1.4M, resource overtime Rp 600K, opportunity cost Rp 2M",
        kontrolEksisting: "Migration plan, parallel approach, rollback strategy, 24/7 team support",
        project: "Tourism Portal Wonderful Indonesia",
        risikoAwal: { kejadian: 22, dampak: 20, level: 21 },
        resikoAkhir: { kejadian: 12, dampak: 15, level: 13 }
      },
      {
        sasaran: "Stakeholder Alignment",
        kode: "PRJ002",
        taksonomi: "Risiko Proyek - Stakeholder Management",
        peristiwaRisiko: "Konflik kepentingan 5 direktorat Kementerian Pertanian dalam penentuan final requirements",
        sumberRisiko: "Multiple stakeholder, conflicting interest, decision making process, organizational politics",
        dampakKualitatif: "Requirement instability, development rework, team confusion, project scope uncertainty",
        dampakKuantitatif: "Rework cost Rp 800K, timeline extension 4-6 weeks, coordination cost Rp 300K",
        kontrolEksisting: "Stakeholder workshop, decision matrix, executive sponsorship, governance structure",
        project: "Agricultural Management System",
        risikoAwal: { kejadian: 17, dampak: 16, level: 16 },
        resikoAkhir: { kejadian: 8, dampak: 10, level: 9 }
      },
      {
        sasaran: "Quality Assurance",
        kode: "PRJ003",
        taksonomi: "Risiko Proyek - Quality Control",
        peristiwaRisiko: "Race condition pada payment processing menyebabkan double charging pada 0.3% transaksi",
        sumberRisiko: "Concurrent processing, race condition, testing gap, code complexity",
        dampakKualitatif: "Financial accuracy issue, user trust loss, reputation damage, regulatory scrutiny",
        dampakKuantitatif: "Financial reconciliation Rp 600K, customer compensation Rp 400K, system fix Rp 200K",
        kontrolEksisting: "Automated testing, transaction monitoring, hotfix deployment, code review process",
        project: "Port Management System Pelindo",
        risikoAwal: { kejadian: 25, dampak: 24, level: 24 },
        resikoAkhir: { kejadian: 5, dampak: 10, level: 7 }
      }
    ],
    environment: [
      {
        sasaran: "Carbon Neutral Initiative",
        kode: "ENV001",
        taksonomi: "Risiko Lingkungan - Carbon Footprint",
        peristiwaRisiko: "Konsumsi energi data center melebihi target carbon neutral 2024 dengan 15% excess emission",
        sumberRisiko: "Energy consumption, infrastructure efficiency, renewable energy adoption, environmental regulation",
        dampakKualitatif: "Environmental compliance issue, corporate image impact, sustainability goal miss",
        dampakKuantitatif: "Carbon offset cost Rp 1.2M, green infrastructure investment Rp 2.5M, penalty risk Rp 800K",
        kontrolEksisting: "Renewable energy transition, server optimization, carbon monitoring, offset program",
        project: "Green Logistics Platform",
        risikoAwal: { kejadian: 14, dampak: 12, level: 13 },
        resikoAkhir: { kejadian: 8, dampak: 8, level: 8 }
      },
      {
        sasaran: "Green IT Certification",
        kode: "ENV002",
        taksonomi: "Risiko Lingkungan - Green Certification",
        peristiwaRisiko: "Client government menambah requirement Green IT certification untuk semua sistem baru",
        sumberRisiko: "Environmental regulation, certification requirement, green technology standard, policy change",
        dampakKualitatif: "Certification requirement, additional compliance burden, market access limitation",
        dampakKuantitatif: "Certification cost Rp 750K, architecture redesign Rp 1.2M, timeline impact 8-12 weeks",
        kontrolEksisting: "Green IT assessment, energy-efficient design, certification roadmap, policy monitoring",
        project: "Industrial IoT Monitoring",
        risikoAwal: { kejadian: 12, dampak: 11, level: 11 },
        resikoAkhir: { kejadian: 6, dampak: 8, level: 7 }
      }
    ],
    it: [
      {
        sasaran: "Keamanan Sistem Manufacturing",
        kode: "IT001",
        taksonomi: "Risiko IT - Cybersecurity",
        peristiwaRisiko: "Sistem keamanan mendeteksi 3 anomali yang menunjukkan indikasi APT attack pada network",
        sumberRisiko: "Cyber threat, security vulnerability, advanced persistent threat, network intrusion",
        dampakKualitatif: "Data breach, intellectual property theft, production disruption, security incident",
        dampakKuantitatif: "Security hardening Rp 2.2M, forensic analysis Rp 800K, business interruption Rp 3.5M",
        kontrolEksisting: "Security monitoring, incident response, forensic capability, security hardening",
        project: "Smart Factory Security System",
        risikoAwal: { kejadian: 16, dampak: 23, level: 19 },
        resikoAkhir: { kejadian: 8, dampak: 15, level: 11 }
      },
      {
        sasaran: "Performance Sistem Tracking",
        kode: "IT002",
        taksonomi: "Risiko IT - System Performance",
        peristiwaRisiko: "Query response time meningkat 400% saat concurrent users > 1000, mengancam SLA 2 detik",
        sumberRisiko: "Database bottleneck, query optimization, system capacity, performance degradation",
        dampakKualitatif: "SLA violation, user experience degradation, service unavailability, customer complaint",
        dampakKuantitatif: "Performance optimization Rp 1.1M, SLA penalty Rp 500K, infrastructure upgrade Rp 800K",
        kontrolEksisting: "Database optimization, horizontal scaling, performance monitoring, query tuning",
        project: "Palm Oil Supply Chain Tracking",
        risikoAwal: { kejadian: 20, dampak: 18, level: 19 },
        resikoAkhir: { kejadian: 10, dampak: 12, level: 11 }
      },
      {
        sasaran: "Business Continuity",
        kode: "IT003",
        taksonomi: "Risiko IT - Disaster Recovery",
        peristiwaRisiko: "DR site Jakarta belum siap 100%, RTO target 4 jam tapi current capability 12 jam",
        sumberRisiko: "Infrastructure readiness, disaster recovery capability, backup strategy, recovery time",
        dampakKualitatif: "Business continuity risk, extended downtime, data loss potential, recovery delay",
        dampakKuantitatif: "DR infrastructure Rp 3.5M, business loss Rp 2M/hari, compliance penalty Rp 1M",
        kontrolEksisting: "DR infrastructure acceleration, automated failover, backup enhancement, testing schedule",
        project: "Mining Operations Management System",
        risikoAwal: { kejadian: 13, dampak: 22, level: 17 },
        resikoAkhir: { kejadian: 6, dampak: 15, level: 10 }
      }
    ],
    hr: [
      {
        sasaran: "Retensi Key Personnel",
        kode: "HR001",
        taksonomi: "Risiko SDM - Key Personnel Retention",
        peristiwaRisiko: "Tech Lead dan 2 Senior Architects mendapat offer competitor dengan salary 60% lebih tinggi",
        sumberRisiko: "Market competition, salary gap, career opportunity, talent retention challenge",
        dampakKualitatif: "Knowledge loss, project continuity risk, team morale impact, skill gap",
        dampakKuantitatif: "Retention bonus Rp 1.8M, recruitment cost Rp 600K, knowledge transfer cost Rp 400K",
        kontrolEksisting: "Retention program, knowledge documentation, succession planning, competitive compensation",
        project: "Tourism Digital Platform",
        risikoAwal: { kejadian: 21, dampak: 19, level: 20 },
        resikoAkhir: { kejadian: 10, dampak: 14, level: 12 }
      },
      {
        sasaran: "Kompetensi Teknis Tim",
        kode: "HR002",
        taksonomi: "Risiko SDM - Technical Competency",
        peristiwaRisiko: "Hanya 2 dari 8 mobile developers kompeten React Native, butuh 5 experts untuk project",
        sumberRisiko: "Skill gap, technology expertise, training need, competency development",
        dampakKualitatif: "Technical delivery risk, quality concern, timeline impact, learning curve",
        dampakKuantitatif: "Training cost Rp 900K, external contractor Rp 1.2M, timeline extension 6-8 weeks",
        kontrolEksisting: "Training program, external contractor, mentoring, technology assessment",
        project: "Cultural Heritage Digital Archive",
        risikoAwal: { kejadian: 19, dampak: 16, level: 17 },
        resikoAkhir: { kejadian: 8, dampak: 10, level: 9 }
      }
    ]
  };

  const templates = riskTemplates[categoryId as keyof typeof riskTemplates] || [];
  const statuses: ("overdue" | "inProcess" | "closed")[] = ["overdue", "inProcess", "closed"];
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
    sasaran: template.sasaran,
    kode: template.kode,
    taksonomi: template.taksonomi,
    peristiwaRisiko: template.peristiwaRisiko,
    sumberRisiko: template.sumberRisiko,
    dampakKualitatif: template.dampakKualitatif,
    dampakKuantitatif: template.dampakKuantitatif,
    kontrolEksisting: template.kontrolEksisting,
    status: statuses[index % statuses.length],
    assignee: assignees[index % assignees.length],
    dueDate: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - (30 - index * 3) * 24 * 60 * 60 * 1000).toISOString(),
    project: template.project,
    lastUpdate: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
    risikoAwal: template.risikoAwal,
    resikoAkhir: template.resikoAkhir,
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

// Helper functions sesuai dengan Risk Capture Form
const getRiskColor = (value: number) => {
  if (value >= 1 && value <= 5) return "bg-green-100 text-green-800 border-green-200";
  if (value >= 6 && value <= 10) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (value >= 11 && value <= 15) return "bg-orange-100 text-orange-800 border-orange-200";
  if (value >= 16 && value <= 20) return "bg-red-100 text-red-800 border-red-200";
  if (value >= 21 && value <= 25) return "bg-red-200 text-red-900 border-red-300";
  return "bg-gray-100 text-gray-800 border-gray-200";
};

const getRiskLabel = (value: number) => {
  if (value >= 1 && value <= 5) return "Sangat Rendah";
  if (value >= 6 && value <= 10) return "Rendah";
  if (value >= 11 && value <= 15) return "Sedang";
  if (value >= 16 && value <= 20) return "Tinggi";
  if (value >= 21 && value <= 25) return "Sangat Tinggi";
  return "Invalid";
};

const getRiskBadge = (value: number, label: string) => {
  return (
    <Badge className={`${getRiskColor(value)} border text-xs`}>
      {label} {value} - {getRiskLabel(value)}
    </Badge>
  );
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
                  {Math.round(riskItems.reduce((sum, item) => sum + item.risikoAwal.level, 0) / riskItems.length)}
                </div>
                <p className="text-sm text-gray-600">Rata-rata Risk Level</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {riskItems.filter(item => item.risikoAwal.level >= 21).length}
                </div>
                <p className="text-sm text-gray-600">Risiko Sangat Tinggi</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {riskItems.length} Items
                </div>
                <p className="text-sm text-gray-600">Total Risk Items</p>
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
