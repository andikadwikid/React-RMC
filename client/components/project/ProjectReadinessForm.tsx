import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Database,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  Save,
  MessageSquare,
  UserCheck,
  Calendar,
  AlertTriangle,
} from "lucide-react";

type ReadinessStatus = "lengkap" | "parsial" | "tidak-tersedia";

interface ReadinessItem {
  id: string;
  title: string;
  status: ReadinessStatus;
  userComment?: string;
  verifierStatus?: ReadinessStatus;
  verifierComment?: string;
  verifierName?: string;
  verifiedAt?: string;
}

interface ReadinessCategory {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  items: ReadinessItem[];
}

interface ProjectReadinessFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onSave: (data: ReadinessCategory[]) => void;
}

const defaultReadinessData: ReadinessCategory[] = [
  {
    id: "administrative",
    title: "Dokumen Administratif Lengkap",
    icon: FileText,
    items: [
      {
        id: "contract",
        title: "Kontrak atau PO dari user",
        status: "tidak-tersedia",
      },
      {
        id: "handover",
        title: "BA serah terima awal (jika ada)",
        status: "tidak-tersedia",
      },
      {
        id: "schedule",
        title: "Jadwal kerja disetujui",
        status: "tidak-tersedia",
      },
      {
        id: "weekly-plan",
        title: "Rencana kerja mingguan disampaikan",
        status: "tidak-tersedia",
      },
    ],
  },
  {
    id: "user-data",
    title: "Data dari User Tersedia",
    icon: Database,
    items: [
      {
        id: "drawings",
        title: "Drawing atau layout teknis terkini",
        status: "tidak-tersedia",
      },
      {
        id: "specifications",
        title: "Spesifikasi teknis atau SOW rinci",
        status: "tidak-tersedia",
      },
      {
        id: "location-data",
        title: "Data lokasi dan akses kerja",
        status: "tidak-tersedia",
      },
      {
        id: "coordinates",
        title: "Informasi titik koordinat (jika applicable)",
        status: "tidak-tersedia",
      },
    ],
  },
  {
    id: "personnel",
    title: "Personel Proyek Siap",
    icon: Users,
    items: [
      {
        id: "personnel-list",
        title: "Daftar personel dan penanggung jawab teknis",
        status: "tidak-tersedia",
      },
      {
        id: "certifications",
        title: "Sertifikasi yang relevan (jika dibutuhkan)",
        status: "tidak-tersedia",
      },
      {
        id: "hr-approval",
        title: "Approval SDM internal/outsourcing",
        status: "tidak-tersedia",
      },
    ],
  },
  {
    id: "legal-financial",
    title: "Legal & Finansial",
    icon: DollarSign,
    items: [
      {
        id: "erp-tagging",
        title: "Proses tagging ke ERP proyek",
        status: "tidak-tersedia",
      },
      {
        id: "contract-number",
        title: "No. kontrak dan cost center disiapkan",
        status: "tidak-tersedia",
      },
      {
        id: "payment-scheme",
        title: "Verifikasi skema pembayaran dan milestone",
        status: "tidak-tersedia",
      },
    ],
  },
];

const getStatusBadge = (status: ReadinessStatus) => {
  switch (status) {
    case "lengkap":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Lengkap
        </Badge>
      );
    case "parsial":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Parsial
        </Badge>
      );
    case "tidak-tersedia":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Tidak Tersedia
        </Badge>
      );
  }
};

const getStatusIcon = (status: ReadinessStatus) => {
  switch (status) {
    case "lengkap":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "parsial":
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    case "tidak-tersedia":
      return <XCircle className="w-4 h-4 text-red-600" />;
  }
};

const getCategoryProgress = (items: ReadinessItem[]) => {
  const completed = items.filter((item) => item.status === "lengkap").length;
  const partial = items.filter((item) => item.status === "parsial").length;
  const total = items.length;

  const completionPercentage = Math.round(
    ((completed + partial * 0.5) / total) * 100,
  );

  return {
    completed,
    partial,
    total,
    percentage: completionPercentage,
  };
};

export function ProjectReadinessForm({
  isOpen,
  onClose,
  projectId,
  projectName,
  onSave,
}: ProjectReadinessFormProps) {
  const [readinessData, setReadinessData] =
    useState<ReadinessCategory[]>(defaultReadinessData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateItemStatus = (
    categoryId: string,
    itemId: string,
    status: ReadinessStatus,
  ) => {
    setReadinessData((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, status } : item,
              ),
            }
          : category,
      ),
    );
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave(readinessData);
      onClose();
    } catch (error) {
      console.error("Error saving readiness data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const overallProgress = () => {
    const allItems = readinessData.flatMap((category) => category.items);
    return getCategoryProgress(allItems);
  };

  const progress = overallProgress();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Project Readiness Assessment
          </DialogTitle>
          <DialogDescription>
            Lengkapi data readiness untuk project:{" "}
            <strong>{projectName}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Overall Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Readiness Progress
              </span>
              <span className="text-sm font-bold text-gray-900">
                {progress.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            <div className="flex gap-4 text-xs text-gray-600">
              <span>
                Lengkap:{" "}
                <strong className="text-green-600">{progress.completed}</strong>
              </span>
              <span>
                Parsial:{" "}
                <strong className="text-yellow-600">{progress.partial}</strong>
              </span>
              <span>
                Total: <strong>{progress.total}</strong>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Readiness Categories */}
        <div className="space-y-6">
          {readinessData.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            const categoryProgress = getCategoryProgress(category.items);

            return (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <span>{category.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {categoryProgress.completed + categoryProgress.partial}/
                        {categoryProgress.total}
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${categoryProgress.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {getStatusIcon(item.status)}
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(item.status)}
                          <Select
                            value={item.status}
                            onValueChange={(value) =>
                              updateItemStatus(
                                category.id,
                                item.id,
                                value as ReadinessStatus,
                              )
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lengkap">Lengkap</SelectItem>
                              <SelectItem value="parsial">Parsial</SelectItem>
                              <SelectItem value="tidak-tersedia">
                                Tidak Tersedia
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Simpan Data Readiness
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
