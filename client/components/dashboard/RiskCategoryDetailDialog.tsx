import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  BarChart3,
  Activity,
  Shield,
  Filter,
  Download,
  Search,
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

import type { RiskCategoryDetailDialogProps } from "@/types";

// Risk data sesuai dengan struktur Risk Capture Form
const generateMockRiskItems = (categoryId: string) => {
  const riskTemplates = {
    strategic: [
      {
        sasaran: "Kestabilan Platform Digital Banking",
        kode: "STR001",
        taksonomi: "Risiko Strategis - Vendor Management",
        peristiwaRisiko:
          "Ketergantungan pada vendor Oracle Database yang dapat menyebabkan vendor lock-in dan eskalasi biaya lisensi tahunan",
        sumberRisiko:
          "Kebijakan vendor, kontrak jangka panjang, ketergantungan teknologi",
        dampakKualitatif:
          "Gangguan operasional sistem banking, keterbatasan fleksibilitas teknologi, risiko discontinuation",
        dampakKuantitatif:
          "Potensi kenaikan biaya lisensi 25-40% per tahun, biaya migrasi sistem Rp 2.5M jika vendor bermasalah",
        kontrolEksisting:
          "Kontrak Service Level Agreement, backup vendor relationship, dokumentasi arsitektur sistem",
        project: "Transformasi Digital Bank Central Indonesia",
        risikoAwal: { kejadian: 15, dampak: 20, level: 18 },
        resikoAkhir: { kejadian: 8, dampak: 15, level: 12 },
      },
      {
        sasaran: "Compliance Regulasi Digital Banking",
        kode: "STR002",
        taksonomi: "Risiko Strategis - Regulatory Compliance",
        peristiwaRisiko:
          "Perubahan regulasi OJK tentang layanan digital banking yang akan efektif Q2 2024 dapat mempengaruhi arsitektur sistem",
        sumberRisiko:
          "Perubahan kebijakan regulator, evolusi standar industri, compliance requirement baru",
        dampakKualitatif:
          "Non-compliance penalty, reputasi perusahaan, gangguan layanan kepada nasabah",
        dampakKuantitatif:
          "Denda regulasi hingga Rp 1.8M, biaya re-development sistem Rp 3.2M, kerugian reputasi",
        kontrolEksisting:
          "Tim legal compliance, monitoring regulasi berkala, relationship dengan regulator",
        project: "Platform E-Government Terpadu Kemendagri",
        risikoAwal: { kejadian: 18, dampak: 22, level: 20 },
        resikoAkhir: { kejadian: 10, dampak: 18, level: 14 },
      },
      {
        sasaran: "Kompetitivitas Produk Fintech",
        kode: "STR003",
        taksonomi: "Risiko Strategis - Market Competition",
        peristiwaRisiko:
          "Pesaing meluncurkan fitur AI untuk credit scoring dan fraud detection yang dapat menggerus market share",
        sumberRisiko:
          "Inovasi competitor, perkembangan teknologi AI, customer preference shift",
        dampakKualitatif:
          "Kehilangan competitive advantage, penurunan customer acquisition, brand positioning",
        dampakKuantitatif:
          "Penurunan market share 15-25%, loss revenue Rp 5.2M, R&D investment Rp 3.8M",
        kontrolEksisting:
          "Market intelligence, R&D investment, partnership teknologi, customer retention program",
        project: "NextGen Mobile Banking Platform",
        risikoAwal: { kejadian: 16, dampak: 19, level: 17 },
        resikoAkhir: { kejadian: 12, dampak: 14, level: 13 },
      },
    ],
    operational: [
      {
        sasaran: "Kapasitas Tim DevOps",
        kode: "OPR001",
        taksonomi: "Risiko Operasional - Human Resources",
        peristiwaRisiko:
          "Kekurangan 5 senior DevOps engineers untuk mengelola infrastructure cloud hybrid dengan kompleksitas tinggi",
        sumberRisiko:
          "Talent shortage, kompetisi salary market, complexity teknologi, skill gap",
        dampakKualitatif:
          "Delayed deployment, reduced system reliability, team burnout, knowledge bottleneck",
        dampakKuantitatif:
          "Project delay 2-3 bulan, overtime cost Rp 1.2M, recruitment cost Rp 800K",
        kontrolEksisting:
          "Training program, external consultant, documentation, knowledge sharing session",
        project: "Cloud Migration Manufacturing ERP",
        risikoAwal: { kejadian: 20, dampak: 18, level: 19 },
        resikoAkhir: { kejadian: 12, dampak: 15, level: 13 },
      },
      {
        sasaran: "Integrasi Sistem Legacy",
        kode: "OPR002",
        taksonomi: "Risiko Operasional - System Integration",
        peristiwaRisiko:
          "Kompleksitas integrasi dengan AS/400 legacy system berusia 15 tahun tanpa dokumentasi lengkap",
        sumberRisiko:
          "Legacy system limitation, missing documentation, obsolete technology, vendor support",
        dampakKualitatif:
          "Data inconsistency, system downtime, user experience degradation, operational disruption",
        dampakKuantitatif:
          "Integration cost Rp 2.8M, downtime loss Rp 1.5M/hari, maintenance cost increase 40%",
        kontrolEksisting:
          "Reverse engineering, parallel system, phased migration, expert consultation",
        project: "Hospital Information System RS Fatmawati",
        risikoAwal: { kejadian: 22, dampak: 25, level: 23 },
        resikoAkhir: { kejadian: 15, dampak: 20, level: 17 },
      },
      {
        sasaran: "Kapasitas Infrastruktur",
        kode: "OPR003",
        taksonomi: "Risiko Operasional - Infrastructure Capacity",
        peristiwaRisiko:
          "Load testing menunjukkan sistem crash pada 50K concurrent users, target launch butuh 100K capacity",
        sumberRisiko:
          "Infrastructure limitation, scaling challenges, performance bottleneck, resource constraint",
        dampakKualitatif:
          "System crash, poor user experience, service unavailability, customer dissatisfaction",
        dampakKuantitatif:
          "Infrastructure upgrade Rp 1.5M, revenue loss Rp 2.2M/hari, SLA penalty Rp 500K",
        kontrolEksisting:
          "Auto-scaling, CDN implementation, load balancer, performance monitoring",
        project: "Supply Chain Management Pertamina",
        risikoAwal: { kejadian: 25, dampak: 23, level: 24 },
        resikoAkhir: { kejadian: 10, dampak: 18, level: 14 },
      },
    ],
    financial: [
      {
        sasaran: "Stabilitas Biaya Operasional",
        kode: "FIN001",
        taksonomi: "Risiko Keuangan - Currency Exchange",
        peristiwaRisiko:
          "Fluktuasi nilai tukar USD/IDR dapat meningkatkan biaya cloud services AWS hingga 25% dari budget",
        sumberRisiko:
          "Currency volatility, global economic condition, monetary policy, exchange rate fluctuation",
        dampakKualitatif:
          "Budget overrun, cash flow pressure, profitability impact, planning uncertainty",
        dampakKuantitatif:
          "Additional cost Rp 2.1M annually, hedging cost Rp 150K, budget variance 15-25%",
        kontrolEksisting:
          "Currency hedging, multi-cloud strategy, quarterly pricing review, budget buffer",
        project: "Fintech Payment Gateway Integration",
        risikoAwal: { kejadian: 18, dampak: 16, level: 17 },
        resikoAkhir: { kejadian: 12, dampak: 12, level: 12 },
      },
      {
        sasaran: "Budget Control dan Profitabilitas",
        kode: "FIN002",
        taksonomi: "Risiko Keuangan - Scope Management",
        peristiwaRisiko:
          "Client menambah 15 fitur baru diluar kontrak, berpotensi budget overrun 40% dari Rp 8.5M ke Rp 12M",
        sumberRisiko:
          "Scope creep, change request, client expectation, contract ambiguity",
        dampakKualitatif:
          "Reduced profitability, resource strain, timeline pressure, team morale impact",
        dampakKuantitatif:
          "Additional cost Rp 3.5M, margin reduction 25%, resource overtime Rp 800K",
        kontrolEksisting:
          "Change request process, contract clarity, scope documentation, stakeholder alignment",
        project: "Smart City Dashboard Surabaya",
        risikoAwal: { kejadian: 20, dampak: 19, level: 19 },
        resikoAkhir: { kejadian: 8, dampak: 12, level: 10 },
      },
    ],
    compliance: [
      {
        sasaran: "Data Privacy Compliance",
        kode: "COM001",
        taksonomi: "Risiko Kepatuhan - Data Protection",
        peristiwaRisiko:
          "Sistem menyimpan data personal 2.5 juta user tanpa consent mechanism sesuai UU PDP No.27/2022",
        sumberRisiko:
          "Regulatory requirement, data protection law, privacy regulation, consent management",
        dampakKualitatif:
          "Legal penalty, user trust loss, reputation damage, business operation disruption",
        dampakKuantitatif:
          "Compliance cost Rp 1.8M, potential fine Rp 5M, remediation cost Rp 2.2M",
        kontrolEksisting:
          "Privacy by design, consent management system, data audit, legal consultation",
        project: "E-Commerce Platform Tokopedia",
        risikoAwal: { kejadian: 23, dampak: 25, level: 24 },
        resikoAkhir: { kejadian: 8, dampak: 15, level: 11 },
      },
      {
        sasaran: "Security Certification",
        kode: "COM002",
        taksonomi: "Risiko Kepatuhan - Information Security",
        peristiwaRisiko:
          "Pre-audit menunjukkan 23 non-conformities dari 114 ISO 27001 control requirements",
        sumberRisiko:
          "Security standard requirement, audit finding, control implementation gap, certification timeline",
        dampakKualitatif:
          "Certification delay, market access limitation, client confidence impact, competitive disadvantage",
        dampakKuantitatif:
          "Remediation cost Rp 950K, consultant fee Rp 400K, potential business loss Rp 1.2M",
        kontrolEksisting:
          "Security framework, external consultant, remediation plan, training program",
        project: "Educational Platform Kemdikbud",
        risikoAwal: { kejadian: 19, dampak: 17, level: 18 },
        resikoAkhir: { kejadian: 10, dampak: 12, level: 11 },
      },
    ],
    project: [
      {
        sasaran: "Timeline Project Delivery",
        kode: "PRJ001",
        taksonomi: "Risiko Proyek - Critical Path",
        peristiwaRisiko:
          "Migrasi database 500GB dari Oracle ke PostgreSQL delay 3 minggu, mengancam go-live target",
        sumberRisiko:
          "Technical complexity, data migration challenge, resource constraint, timeline pressure",
        dampakKualitatif:
          "Go-live delay, stakeholder confidence loss, contract penalty, team stress",
        dampakKuantitatif:
          "Penalty cost Rp 1.4M, resource overtime Rp 600K, opportunity cost Rp 2M",
        kontrolEksisting:
          "Migration plan, parallel approach, rollback strategy, 24/7 team support",
        project: "Tourism Portal Wonderful Indonesia",
        risikoAwal: { kejadian: 22, dampak: 20, level: 21 },
        resikoAkhir: { kejadian: 12, dampak: 15, level: 13 },
      },
      {
        sasaran: "Stakeholder Alignment",
        kode: "PRJ002",
        taksonomi: "Risiko Proyek - Stakeholder Management",
        peristiwaRisiko:
          "Konflik kepentingan 5 direktorat Kementerian Pertanian dalam penentuan final requirements",
        sumberRisiko:
          "Multiple stakeholder, conflicting interest, decision making process, organizational politics",
        dampakKualitatif:
          "Requirement instability, development rework, team confusion, project scope uncertainty",
        dampakKuantitatif:
          "Rework cost Rp 800K, timeline extension 4-6 weeks, coordination cost Rp 300K",
        kontrolEksisting:
          "Stakeholder workshop, decision matrix, executive sponsorship, governance structure",
        project: "Agricultural Management System",
        risikoAwal: { kejadian: 17, dampak: 16, level: 16 },
        resikoAkhir: { kejadian: 8, dampak: 10, level: 9 },
      },
      {
        sasaran: "Quality Assurance",
        kode: "PRJ003",
        taksonomi: "Risiko Proyek - Quality Control",
        peristiwaRisiko:
          "Race condition pada payment processing menyebabkan double charging pada 0.3% transaksi",
        sumberRisiko:
          "Concurrent processing, race condition, testing gap, code complexity",
        dampakKualitatif:
          "Financial accuracy issue, user trust loss, reputation damage, regulatory scrutiny",
        dampakKuantitatif:
          "Financial reconciliation Rp 600K, customer compensation Rp 400K, system fix Rp 200K",
        kontrolEksisting:
          "Automated testing, transaction monitoring, hotfix deployment, code review process",
        project: "Port Management System Pelindo",
        risikoAwal: { kejadian: 25, dampak: 24, level: 24 },
        resikoAkhir: { kejadian: 5, dampak: 10, level: 7 },
      },
    ],
    environment: [
      {
        sasaran: "Carbon Neutral Initiative",
        kode: "ENV001",
        taksonomi: "Risiko Lingkungan - Carbon Footprint",
        peristiwaRisiko:
          "Konsumsi energi data center melebihi target carbon neutral 2024 dengan 15% excess emission",
        sumberRisiko:
          "Energy consumption, infrastructure efficiency, renewable energy adoption, environmental regulation",
        dampakKualitatif:
          "Environmental compliance issue, corporate image impact, sustainability goal miss",
        dampakKuantitatif:
          "Carbon offset cost Rp 1.2M, green infrastructure investment Rp 2.5M, penalty risk Rp 800K",
        kontrolEksisting:
          "Renewable energy transition, server optimization, carbon monitoring, offset program",
        project: "Green Logistics Platform",
        risikoAwal: { kejadian: 14, dampak: 12, level: 13 },
        resikoAkhir: { kejadian: 8, dampak: 8, level: 8 },
      },
      {
        sasaran: "Green IT Certification",
        kode: "ENV002",
        taksonomi: "Risiko Lingkungan - Green Certification",
        peristiwaRisiko:
          "Client government menambah requirement Green IT certification untuk semua sistem baru",
        sumberRisiko:
          "Environmental regulation, certification requirement, green technology standard, policy change",
        dampakKualitatif:
          "Certification requirement, additional compliance burden, market access limitation",
        dampakKuantitatif:
          "Certification cost Rp 750K, architecture redesign Rp 1.2M, timeline impact 8-12 weeks",
        kontrolEksisting:
          "Green IT assessment, energy-efficient design, certification roadmap, policy monitoring",
        project: "Industrial IoT Monitoring",
        risikoAwal: { kejadian: 12, dampak: 11, level: 11 },
        resikoAkhir: { kejadian: 6, dampak: 8, level: 7 },
      },
    ],
    it: [
      {
        sasaran: "Keamanan Sistem Manufacturing",
        kode: "IT001",
        taksonomi: "Risiko IT - Cybersecurity",
        peristiwaRisiko:
          "Sistem keamanan mendeteksi 3 anomali yang menunjukkan indikasi APT attack pada network",
        sumberRisiko:
          "Cyber threat, security vulnerability, advanced persistent threat, network intrusion",
        dampakKualitatif:
          "Data breach, intellectual property theft, production disruption, security incident",
        dampakKuantitatif:
          "Security hardening Rp 2.2M, forensic analysis Rp 800K, business interruption Rp 3.5M",
        kontrolEksisting:
          "Security monitoring, incident response, forensic capability, security hardening",
        project: "Smart Factory Security System",
        risikoAwal: { kejadian: 16, dampak: 23, level: 19 },
        resikoAkhir: { kejadian: 8, dampak: 15, level: 11 },
      },
      {
        sasaran: "Performance Sistem Tracking",
        kode: "IT002",
        taksonomi: "Risiko IT - System Performance",
        peristiwaRisiko:
          "Query response time meningkat 400% saat concurrent users > 1000, mengancam SLA 2 detik",
        sumberRisiko:
          "Database bottleneck, query optimization, system capacity, performance degradation",
        dampakKualitatif:
          "SLA violation, user experience degradation, service unavailability, customer complaint",
        dampakKuantitatif:
          "Performance optimization Rp 1.1M, SLA penalty Rp 500K, infrastructure upgrade Rp 800K",
        kontrolEksisting:
          "Database optimization, horizontal scaling, performance monitoring, query tuning",
        project: "Palm Oil Supply Chain Tracking",
        risikoAwal: { kejadian: 20, dampak: 18, level: 19 },
        resikoAkhir: { kejadian: 10, dampak: 12, level: 11 },
      },
      {
        sasaran: "Business Continuity",
        kode: "IT003",
        taksonomi: "Risiko IT - Disaster Recovery",
        peristiwaRisiko:
          "DR site Jakarta belum siap 100%, RTO target 4 jam tapi current capability 12 jam",
        sumberRisiko:
          "Infrastructure readiness, disaster recovery capability, backup strategy, recovery time",
        dampakKualitatif:
          "Business continuity risk, extended downtime, data loss potential, recovery delay",
        dampakKuantitatif:
          "DR infrastructure Rp 3.5M, business loss Rp 2M/hari, compliance penalty Rp 1M",
        kontrolEksisting:
          "DR infrastructure acceleration, automated failover, backup enhancement, testing schedule",
        project: "Mining Operations Management System",
        risikoAwal: { kejadian: 13, dampak: 22, level: 17 },
        resikoAkhir: { kejadian: 6, dampak: 15, level: 10 },
      },
    ],
    hr: [
      {
        sasaran: "Retensi Key Personnel",
        kode: "HR001",
        taksonomi: "Risiko SDM - Key Personnel Retention",
        peristiwaRisiko:
          "Tech Lead dan 2 Senior Architects mendapat offer competitor dengan salary 60% lebih tinggi",
        sumberRisiko:
          "Market competition, salary gap, career opportunity, talent retention challenge",
        dampakKualitatif:
          "Knowledge loss, project continuity risk, team morale impact, skill gap",
        dampakKuantitatif:
          "Retention bonus Rp 1.8M, recruitment cost Rp 600K, knowledge transfer cost Rp 400K",
        kontrolEksisting:
          "Retention program, knowledge documentation, succession planning, competitive compensation",
        project: "Tourism Digital Platform",
        risikoAwal: { kejadian: 21, dampak: 19, level: 20 },
        resikoAkhir: { kejadian: 10, dampak: 14, level: 12 },
      },
      {
        sasaran: "Kompetensi Teknis Tim",
        kode: "HR002",
        taksonomi: "Risiko SDM - Technical Competency",
        peristiwaRisiko:
          "Hanya 2 dari 8 mobile developers kompeten React Native, butuh 5 experts untuk project",
        sumberRisiko:
          "Skill gap, technology expertise, training need, competency development",
        dampakKualitatif:
          "Technical delivery risk, quality concern, timeline impact, learning curve",
        dampakKuantitatif:
          "Training cost Rp 900K, external contractor Rp 1.2M, timeline extension 6-8 weeks",
        kontrolEksisting:
          "Training program, external contractor, mentoring, technology assessment",
        project: "Cultural Heritage Digital Archive",
        risikoAwal: { kejadian: 19, dampak: 16, level: 17 },
        resikoAkhir: { kejadian: 8, dampak: 10, level: 9 },
      },
    ],
  };

  const templates =
    riskTemplates[categoryId as keyof typeof riskTemplates] || [];
  const statuses: ("overdue" | "inProcess" | "closed")[] = [
    "overdue",
    "inProcess",
    "closed",
  ];
  const assignees = [
    "Ahmad Rahman",
    "Siti Nurhaliza",
    "Budi Santoso",
    "Maya Sari",
    "Randi Pratama",
    "Dr. Indira Sari",
    "Agus Wijaya",
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
    dueDate: new Date(
      Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    createdAt: new Date(
      Date.now() - (30 - index * 3) * 24 * 60 * 60 * 1000,
    ).toISOString(),
    project: template.project,
    lastUpdate: new Date(
      Date.now() - (index + 1) * 24 * 60 * 60 * 1000,
    ).toISOString(),
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
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
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
    <Badge className={`${statusConfig.color} border text-xs`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {statusConfig.label}
    </Badge>
  );
};

// Helper functions sesuai dengan Risk Capture Form
const getRiskColor = (value: number) => {
  if (value >= 1 && value <= 5) return "bg-green-100 text-green-800";
  if (value >= 6 && value <= 10) return "bg-yellow-100 text-yellow-800";
  if (value >= 11 && value <= 15) return "bg-orange-100 text-orange-800";
  if (value >= 16 && value <= 20) return "bg-red-100 text-red-800";
  if (value >= 21 && value <= 25) return "bg-red-200 text-red-900";
  return "bg-gray-100 text-gray-800";
};

const getRiskLabel = (value: number) => {
  if (value >= 1 && value <= 5) return "Sangat Rendah";
  if (value >= 6 && value <= 10) return "Rendah";
  if (value >= 11 && value <= 15) return "Sedang";
  if (value >= 16 && value <= 20) return "Tinggi";
  if (value >= 21 && value <= 25) return "Sangat Tinggi";
  return "Invalid";
};

const getRiskBadge = (value: number) => {
  return (
    <Badge className={`${getRiskColor(value)} text-xs`}>
      {value} - {getRiskLabel(value)}
    </Badge>
  );
};

// Risk Detail Modal Component
const RiskDetailModal = ({
  isOpen,
  onClose,
  riskItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  riskItem: RiskItem | null;
}) => {
  if (!riskItem) return null;

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-600" />
            Detail Risiko: [{riskItem.kode}] {riskItem.sasaran}
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap mengenai risiko dan kontrol mitigasi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status dan Level */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Status & Risk Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Status Saat Ini:
                  </p>
                  {getStatusBadge(riskItem.status)}

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Taksonomi:
                    </p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {riskItem.taksonomi}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Risk Assessment:
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Risiko Awal:
                      </span>
                      <div className="flex gap-1">
                        {getRiskBadge(riskItem.risikoAwal.kejadian)}
                        {getRiskBadge(riskItem.risikoAwal.dampak)}
                        {getRiskBadge(riskItem.risikoAwal.level)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Risiko Akhir:
                      </span>
                      <div className="flex gap-1">
                        {getRiskBadge(riskItem.resikoAkhir.kejadian)}
                        {getRiskBadge(riskItem.resikoAkhir.dampak)}
                        {getRiskBadge(riskItem.resikoAkhir.level)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-medium text-green-600">
                        Improvement:
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        -
                        {riskItem.risikoAwal.level - riskItem.resikoAkhir.level}{" "}
                        point
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Project:
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {riskItem.project}
                  </p>

                  <p className="text-sm font-medium text-gray-700 mb-1">PIC:</p>
                  <p className="text-sm text-gray-600">{riskItem.assignee}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Target Date:
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {formatDate(riskItem.dueDate)}
                  </p>

                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Last Update:
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(riskItem.lastUpdate!)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Peristiwa Risiko:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-red-50 p-3 rounded">
                    {riskItem.peristiwaRisiko}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Sumber Risiko:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded">
                    {riskItem.sumberRisiko}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Dampak Kualitatif:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 p-3 rounded">
                    {riskItem.dampakKualitatif}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Dampak Kuantitatif:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-purple-50 p-3 rounded">
                    {riskItem.dampakKuantitatif}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Control Measures */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Control Measures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Kontrol Eksisting:
                </p>
                <p className="text-sm text-gray-600 leading-relaxed bg-green-50 p-3 rounded border-l-4 border-green-400">
                  {riskItem.kontrolEksisting}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Export Detail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function RiskCategoryDetailDialog({
  isOpen,
  onClose,
  category,
}: RiskCategoryDetailDialogProps) {
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  if (!category) return null;

  const riskItems = generateMockRiskItems(category.id);

  // Apply filters
  let filteredRiskItems = riskItems;

  // Status filter
  if (statusFilter !== "all") {
    filteredRiskItems = filteredRiskItems.filter(
      (item) => item.status === statusFilter,
    );
  }

  // Search filter
  if (searchQuery.trim() !== "") {
    filteredRiskItems = filteredRiskItems.filter(
      (item) =>
        item.sasaran.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.taksonomi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.peristiwaRisiko
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assignee.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  const IconComponent = category.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleViewDetail = (risk: RiskItem) => {
    setSelectedRisk(risk);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] lg:max-w-7xl max-h-[95vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-4 lg:p-6 border-b">
            <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-lg lg:text-xl">
              <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                <span>Detail Risiko: {category.name}</span>
              </div>
            </DialogTitle>
            <DialogDescription className="text-sm lg:text-base">
              Daftar lengkap risiko dalam kategori {category.name} dengan level
              detail dan status mitigasi
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Risiko
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {category.total}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">
                      {category.overdue}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Dalam Mitigasi
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {category.inProcess}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Selesai</p>
                    <p className="text-2xl font-bold text-green-600">
                      {category.closed}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">Semua Status</option>
                  <option value="overdue">Overdue</option>
                  <option value="inProcess">Dalam Mitigasi</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari kode, sasaran, taksonomi, atau project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 ml-auto">
              {/* Clear Search Button */}
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>

          {/* Search Results Info */}
          {(searchQuery || statusFilter !== "all") && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">
                    Menampilkan {filteredRiskItems.length} dari{" "}
                    {riskItems.length} risiko
                  </span>
                  {searchQuery && (
                    <span className="text-blue-600">
                      untuk pencarian "{searchQuery}"
                    </span>
                  )}
                  {statusFilter !== "all" && (
                    <span className="text-green-600">
                      dengan status "{statusFilter}"
                    </span>
                  )}
                </div>
                {(searchQuery || statusFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className="text-xs"
                  >
                    Reset Filter
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Risk Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-20">Kode</TableHead>
                    <TableHead className="min-w-[200px]">Sasaran</TableHead>
                    <TableHead className="w-32">Status</TableHead>
                    <TableHead className="w-24">Level</TableHead>
                    <TableHead className="w-32">PIC</TableHead>
                    <TableHead className="w-20">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRiskItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="w-8 h-8 text-gray-400" />
                          <p className="text-gray-500">
                            {searchQuery
                              ? `Tidak ada risiko yang ditemukan untuk "${searchQuery}"`
                              : "Tidak ada risiko dengan status yang dipilih"}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearchQuery("");
                              setStatusFilter("all");
                            }}
                          >
                            Reset Filter
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRiskItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs">
                          {item.kode}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {item.sasaran}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.project}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">
                              Awal: {item.risikoAwal.level}
                            </div>
                            <div className="text-xs font-medium">
                              Akhir: {item.resikoAkhir.level}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{item.assignee}</p>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(item)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </div>

          <DialogFooter className="bg-gray-50 p-4 lg:p-6 border-t flex-shrink-0">
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

      {/* Risk Detail Modal */}
      <RiskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        riskItem={selectedRisk}
      />
    </>
  );
}
