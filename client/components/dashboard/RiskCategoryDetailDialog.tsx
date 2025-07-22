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
} from "lucide-react";

interface RiskItem {
  id: string;
  title: string;
  description: string;
  status: "overdue" | "inProcess" | "closed";
  priority: "high" | "medium" | "low";
  assignee: string;
  dueDate: string;
  createdAt: string;
  project: string;
  lastUpdate?: string;
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

// Mock detailed data for risk items
const generateMockRiskItems = (categoryId: string) => {
  const riskTemplates = {
    strategic: [
      {
        title: "Ketergantungan pada vendor utama",
        description: "Risiko ketergantungan tinggi pada satu vendor teknologi",
        project: "ERP System Bank Central",
      },
      {
        title: "Perubahan regulasi pemerintah",
        description: "Potensi perubahan regulasi yang mempengaruhi project scope",
        project: "E-Government Portal",
      },
      {
        title: "Kompetitor dengan teknologi serupa",
        description: "Risiko pesaing meluncurkan solusi serupa lebih dulu",
        project: "Mobile Banking App",
      },
    ],
    operational: [
      {
        title: "Keterbatasan sumber daya teknis",
        description: "Kurangnya developer berpengalaman untuk teknologi terbaru",
        project: "Manufacturing ERP",
      },
      {
        title: "Integrasi sistem legacy",
        description: "Kompleksitas integrasi dengan sistem lama yang masih digunakan",
        project: "Hospital Information System",
      },
      {
        title: "Masalah infrastruktur IT",
        description: "Keterbatasan bandwidth dan hardware yang memadai",
        project: "Supply Chain Management",
      },
    ],
    financial: [
      {
        title: "Eskalasi biaya development",
        description: "Peningkatan biaya development akibat perubahan requirement",
        project: "Fintech Integration",
      },
      {
        title: "Fluktuasi nilai tukar",
        description: "Risiko perubahan nilai tukar untuk komponen impor",
        project: "Smart City Dashboard",
      },
    ],
    compliance: [
      {
        title: "Kepatuhan data privacy",
        description: "Memastikan compliance dengan regulasi GDPR dan UU PDP",
        project: "E-Commerce Platform",
      },
      {
        title: "Audit keamanan sistem",
        description: "Requirement audit keamanan sebelum go-live",
        project: "Educational Platform",
      },
    ],
    project: [
      {
        title: "Keterlambatan milestone utama",
        description: "Risiko delay pada critical path project",
        project: "Tourism Portal",
      },
      {
        title: "Scope creep dari client",
        description: "Penambahan fitur diluar kontrak awal",
        project: "Agricultural Management System",
      },
      {
        title: "Quality assurance issues",
        description: "Ditemukan bugs critical pada fase testing",
        project: "Port Management System",
      },
    ],
    environment: [
      {
        title: "Dampak lingkungan server farm",
        description: "Analisis dampak konsumsi energi data center",
        project: "Logistics Platform",
      },
      {
        title: "Kebijakan green IT",
        description: "Implementasi standar ramah lingkungan",
        project: "Industrial IoT",
      },
    ],
    it: [
      {
        title: "Kerentanan keamanan sistem",
        description: "Potensi vulnerability pada infrastructure",
        project: "Smart Factory",
      },
      {
        title: "Kapasitas sistem tidak mencukupi",
        description: "Load testing menunjukkan bottleneck performance",
        project: "Palm Oil Tracking",
      },
      {
        title: "Backup dan disaster recovery",
        description: "Belum ada strategi backup yang comprehensive",
        project: "Mining Management System",
      },
    ],
    hr: [
      {
        title: "Turnover key personnel",
        description: "Risiko resign developer kunci ditengah project",
        project: "Tourism Management",
      },
      {
        title: "Skill gap tim development",
        description: "Kurangnya expertise dalam teknologi yang digunakan",
        project: "Cultural Heritage Portal",
      },
    ],
  };

  const templates = riskTemplates[categoryId as keyof typeof riskTemplates] || [];
  const statuses: ("overdue" | "inProcess" | "closed")[] = ["overdue", "inProcess", "closed"];
  const priorities: ("high" | "medium" | "low")[] = ["high", "medium", "low"];
  const assignees = ["Ahmad Rahman", "Siti Nurhaliza", "Budi Santoso", "Maya Sari", "Randi Pratama"];

  return templates.map((template, index) => ({
    id: `${categoryId}-${index + 1}`,
    title: template.title,
    description: template.description,
    status: statuses[index % statuses.length],
    priority: priorities[index % priorities.length],
    assignee: assignees[index % assignees.length],
    dueDate: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - (30 - index * 3) * 24 * 60 * 60 * 1000).toISOString(),
    project: template.project,
    lastUpdate: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

const getStatusBadge = (status: "overdue" | "inProcess" | "closed") => {
  const config = {
    overdue: {
      label: "Overdue",
      color: "bg-red-100 text-red-800",
      icon: XCircle,
    },
    inProcess: {
      label: "In Process",
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    closed: {
      label: "Closed",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
  };

  const statusConfig = config[status];
  const IconComponent = statusConfig.icon;

  return (
    <Badge className={statusConfig.color}>
      <IconComponent className="w-3 h-3 mr-1" />
      {statusConfig.label}
    </Badge>
  );
};

const getPriorityBadge = (priority: "high" | "medium" | "low") => {
  const config = {
    high: { label: "High", color: "bg-red-100 text-red-800" },
    medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    low: { label: "Low", color: "bg-green-100 text-green-800" },
  };

  const priorityConfig = config[priority];
  return <Badge className={priorityConfig.color}>{priorityConfig.label}</Badge>;
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Risiko
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {category.total}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {category.overdue}
              </div>
              <p className="text-xs text-gray-500">Belum ditindaklanjuti</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                In Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {category.inProcess}
              </div>
              <p className="text-xs text-gray-500">Dalam mitigasi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Closed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {category.closed}
              </div>
              <p className="text-xs text-gray-500">Selesai mitigasi</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Risk Items */}
        <div className="space-y-6">
          {/* Overdue Items */}
          {overdueItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  Overdue Items ({overdueItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {overdueItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-red-200 rounded-lg p-4 bg-red-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {item.title}
                            </h4>
                            {getStatusBadge(item.status)}
                            {getPriorityBadge(item.priority)}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {item.description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>Project: {item.project}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>Assignee: {item.assignee}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Due: {formatDate(item.dueDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Created: {formatDate(item.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700">
                  <Clock className="w-5 h-5" />
                  In Process Items ({inProcessItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inProcessItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-yellow-200 rounded-lg p-4 bg-yellow-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {item.title}
                            </h4>
                            {getStatusBadge(item.status)}
                            {getPriorityBadge(item.priority)}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {item.description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>Project: {item.project}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>Assignee: {item.assignee}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Due: {formatDate(item.dueDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>
                                Last Update: {formatDateTime(item.lastUpdate!)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  Closed Items ({closedItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {closedItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-green-200 rounded-lg p-4 bg-green-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {item.title}
                            </h4>
                            {getStatusBadge(item.status)}
                            {getPriorityBadge(item.priority)}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {item.description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>Project: {item.project}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>Assignee: {item.assignee}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Closed: {formatDate(item.dueDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Resolved: {formatDate(item.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
