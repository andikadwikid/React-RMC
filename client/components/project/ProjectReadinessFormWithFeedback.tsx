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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import type { ReadinessItem, ReadinessStatus } from "@/types";

interface ReadinessCategory {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  items: ReadinessItem[];
}

import type { ProjectReadinessFormWithFeedbackProps } from "@/types";

// Enhanced readiness data with mock verifier feedback
const defaultReadinessData: ReadinessCategory[] = [
  {
    id: "administrative",
    title: "Dokumen Administratif Lengkap",
    icon: FileText,
    items: [
      {
        id: "admin-1",
        category: "Administrative",
        item: "Surat Izin Usaha",
        userStatus: "lengkap",
        verifierStatus: "parsial",
        userComment: "Dokumen sudah tersedia dan lengkap",
        verifierComment:
          "Dokumen perlu diperbaharui, masa berlaku hampir habis",
        verifierName: "Admin Verifier",
        verifiedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "admin-2",
        category: "Administrative",
        item: "NPWP Perusahaan",
        userStatus: "lengkap",
        verifierStatus: "lengkap",
        verifierName: "Admin Verifier",
        verifiedAt: "2024-01-15T10:35:00Z",
      },
      {
        id: "admin-3",
        category: "Administrative",
        item: "Akta Pendirian Perusahaan",
        userStatus: "parsial",
        userComment: "Sedang dalam proses legalisasi",
      },
      {
        id: "admin-4",
        category: "Administrative",
        item: "Surat Domisili Perusahaan",
        userStatus: "tidak_tersedia",
      },
    ],
  },
  {
    id: "user-data",
    title: "Data dari User Tersedia",
    icon: Database,
    items: [
      {
        id: "data-1",
        category: "User Data",
        item: "Master Data Customer",
        userStatus: "parsial",
        verifierStatus: "tidak_tersedia",
        userComment: "Data customer sedang dalam migrasi",
        verifierComment: "Data tidak dapat diverifikasi, migrasi belum selesai",
        verifierName: "Data Verifier",
        verifiedAt: "2024-01-14T16:20:00Z",
      },
      {
        id: "data-2",
        category: "User Data",
        item: "Master Data Supplier",
        userStatus: "lengkap",
      },
      {
        id: "data-3",
        category: "User Data",
        item: "Master Data Product/Service",
        userStatus: "lengkap",
      },
    ],
  },
  {
    id: "personnel",
    title: "Personel Proyek Siap",
    icon: Users,
    items: [
      {
        id: "person-1",
        category: "Personnel",
        item: "CV Tim Project",
        userStatus: "lengkap",
        verifierStatus: "lengkap",
        verifierName: "HR Verifier",
        verifiedAt: "2024-01-13T14:10:00Z",
      },
      {
        id: "person-2",
        category: "Personnel",
        item: "Sertifikat Keahlian",
        userStatus: "parsial",
        userComment: "Beberapa sertifikat masih dalam proses",
      },
      {
        id: "person-3",
        category: "Personnel",
        item: "Struktur Organisasi Tim",
        userStatus: "lengkap",
      },
      {
        id: "person-4",
        category: "Personnel",
        item: "Job Description Role",
        userStatus: "lengkap",
      },
    ],
  },
  {
    id: "legal-financial",
    title: "Legal & Finansial",
    icon: DollarSign,
    items: [
      {
        id: "legal-1",
        category: "Legal & Financial",
        item: "Kontrak Kerjasama",
        userStatus: "lengkap",
        verifierStatus: "lengkap",
        verifierName: "Legal Verifier",
        verifiedAt: "2024-01-12T11:45:00Z",
      },
      {
        id: "legal-2",
        category: "Legal & Financial",
        item: "Laporan Keuangan",
        userStatus: "parsial",
        verifierStatus: "parsial",
        userComment: "Laporan Q4 masih dalam audit",
        verifierComment: "Perlu melengkapi laporan keuangan terbaru",
        verifierName: "Finance Verifier",
        verifiedAt: "2024-01-11T09:20:00Z",
      },
      {
        id: "legal-3",
        category: "Legal & Financial",
        item: "Asuransi Project",
        userStatus: "tidak_tersedia",
        verifierStatus: "tidak_tersedia",
        verifierComment:
          "Asuransi project harus diurus sebelum project dimulai",
        verifierName: "Legal Verifier",
        verifiedAt: "2024-01-10T15:30:00Z",
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
    case "tidak_tersedia":
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
    case "tidak_tersedia":
      return <XCircle className="w-4 h-4 text-red-600" />;
  }
};

const getCategoryProgress = (items: ReadinessItem[]) => {
  const completed = items.filter(
    (item) => item.userStatus === "lengkap",
  ).length;
  const partial = items.filter((item) => item.userStatus === "parsial").length;
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

export function ProjectReadinessFormWithFeedback({
  isOpen,
  onClose,
  projectId,
  projectName,
  onSave,
}: ProjectReadinessFormWithFeedbackProps) {
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
                item.id === itemId ? { ...item, userStatus: status } : item,
              ),
            }
          : category,
      ),
    );
  };

  const updateItemComment = (
    categoryId: string,
    itemId: string,
    comment: string,
  ) => {
    setReadinessData((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, userComment: comment } : item,
              ),
            }
          : category,
      ),
    );
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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
          {readinessData.map((category) => {
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
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        {/* Main Item Row */}
                        <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            {getStatusIcon(item.userStatus)}
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.item}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(item.userStatus)}
                            <Select
                              value={item.userStatus}
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
                                <SelectItem value="tidak_tersedia">
                                  Tidak Tersedia
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* User Comment Section */}
                        <div className="px-4 pb-4">
                          <Label className="text-sm font-medium text-gray-700">
                            Komentar Anda (Opsional)
                          </Label>
                          <Textarea
                            placeholder="Tambahkan komentar atau keterangan tambahan..."
                            className="mt-1"
                            rows={2}
                            value={item.userComment || ""}
                            onChange={(e) =>
                              updateItemComment(
                                category.id,
                                item.id,
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        {/* Verifier Feedback Section */}
                        {item.verifierStatus && (
                          <div className="bg-blue-50 border-t px-4 py-3">
                            <div className="flex items-center gap-2 mb-2">
                              <UserCheck className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">
                                Feedback Verifikator
                              </span>
                              {item.verifierName && (
                                <span className="text-xs text-blue-600">
                                  ({item.verifierName})
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs text-blue-600">
                                Status Verifikator:
                              </span>
                              {getStatusBadge(item.verifierStatus)}
                              {item.verifierStatus !== item.userStatus && (
                                <div className="flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-orange-500" />
                                  <span className="text-xs text-orange-600">
                                    Berbeda dengan status Anda
                                  </span>
                                </div>
                              )}
                            </div>

                            {item.verifierComment && (
                              <div className="mb-2">
                                <div className="flex items-center gap-1 mb-1">
                                  <MessageSquare className="w-3 h-3 text-blue-600" />
                                  <span className="text-xs font-medium text-blue-600">
                                    Komentar:
                                  </span>
                                </div>
                                <p className="text-sm text-blue-800 italic pl-4 border-l-2 border-blue-200">
                                  "{item.verifierComment}"
                                </p>
                              </div>
                            )}

                            {item.verifiedAt && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-blue-600" />
                                <span className="text-xs text-blue-600">
                                  Diverifikasi:{" "}
                                  {new Date(item.verifiedAt).toLocaleDateString(
                                    "id-ID",
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
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
