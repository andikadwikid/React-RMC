import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  MessageSquare,
  User,
  Calendar,
} from "lucide-react";
import type { ProjectReadiness, ReadinessItem, ReadinessStatus } from "@/types";
import { formatDateTime } from "@/utils/formatters";

import type { ProjectReadinessVerificationModalProps } from "@/types";

// Mock readiness categories and items
const READINESS_CATEGORIES = {
  Administrative: [
    "Surat Izin Usaha",
    "NPWP Perusahaan",
    "Akta Pendirian Perusahaan",
    "Surat Domisili Perusahaan",
  ],
  "User Data": [
    "Master Data Customer",
    "Master Data Supplier",
    "Master Data Product/Service",
  ],
  Personnel: [
    "CV Tim Project",
    "Sertifikat Keahlian",
    "Struktur Organisasi Tim",
    "Job Description Role",
  ],
  "Legal & Financial": [
    "Kontrak Kerjasama",
    "Laporan Keuangan",
    "Asuransi Project",
  ],
};

const STATUS_CONFIG = {
  lengkap: {
    label: "Lengkap",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  parsial: {
    label: "Parsial",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertTriangle,
  },
  tidak_tersedia: {
    label: "Tidak Tersedia",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

export function ProjectReadinessVerificationModal({
  isOpen,
  onClose,
  submission,
  onSave,
}: ProjectReadinessVerificationModalProps) {
  const [verificationItems, setVerificationItems] = useState<ReadinessItem[]>(
    [],
  );
  const [overallStatus, setOverallStatus] = useState<string>(
    submission.status || "submitted",
  );
  const [overallComment, setOverallComment] = useState<string>(
    submission.overallComment || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize verification items based on submission
    const allItems: ReadinessItem[] = [];

    Object.entries(READINESS_CATEGORIES).forEach(([category, items]) => {
      items.forEach((item, index) => {
        const existingItem = submission.items.find(
          (subItem) => subItem.category === category && subItem.item === item,
        );

        allItems.push({
          id: existingItem?.id || `${category}-${index}`,
          category,
          item,
          userStatus: existingItem?.userStatus || "tidak_tersedia",
          verifierStatus: existingItem?.verifierStatus,
          userComment: existingItem?.userComment,
          verifierComment: existingItem?.verifierComment,
          verifierName: existingItem?.verifierName,
          verifiedAt: existingItem?.verifiedAt,
        });
      });
    });

    setVerificationItems(allItems);
  }, [submission]);

  const updateVerificationStatus = (
    itemId: string,
    status: ReadinessStatus,
  ) => {
    setVerificationItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, verifierStatus: status } : item,
      ),
    );
  };

  const updateVerificationComment = (itemId: string, comment: string) => {
    setVerificationItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, verifierComment: comment } : item,
      ),
    );
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      const verificationData = {
        items: verificationItems,
        status: overallStatus,
        overallComment,
        verifierName: "Current Verifier", // Should come from auth context
        verifiedAt: new Date().toISOString(),
      };

      await onSave(submission.id, verificationData);
    } catch (error) {
      console.error("Error saving verification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: ReadinessStatus) => {
    const config = STATUS_CONFIG[status];
    const IconComponent = config.icon;

    return (
      <Badge className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const groupedItems = verificationItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, ReadinessItem[]>,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Verifikasi Project Readiness
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Nama Project
                  </Label>
                  <p className="text-sm">{submission.projectName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Project ID
                  </Label>
                  <p className="text-sm">{submission.projectId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Submitter
                  </Label>
                  <p className="text-sm flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {submission.submittedBy}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Tanggal Submit
                  </Label>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDateTime(submission.submittedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Items */}
          <div className="space-y-4">
            {Object.entries(groupedItems).map(([category, items]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-base">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.item}
                            </h4>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  User Status:
                                </span>
                                {getStatusBadge(item.userStatus)}
                              </div>
                              {item.verifierStatus && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    Verifier Status:
                                  </span>
                                  {getStatusBadge(item.verifierStatus)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {item.userComment && (
                          <div className="bg-blue-50 p-3 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="w-3 h-3 text-blue-600" />
                              <span className="text-xs font-medium text-blue-600">
                                Komentar User:
                              </span>
                            </div>
                            <p className="text-sm text-blue-800">
                              {item.userComment}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">
                              Verifier Status
                            </Label>
                            <Select
                              value={item.verifierStatus || ""}
                              onValueChange={(value: ReadinessStatus) =>
                                updateVerificationStatus(item.id, value)
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Pilih status verifikasi" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lengkap">
                                  ✅ Lengkap
                                </SelectItem>
                                <SelectItem value="parsial">
                                  ⚠️ Parsial
                                </SelectItem>
                                <SelectItem value="tidak_tersedia">
                                  ❌ Tidak Tersedia
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">
                              Komentar Verifier
                            </Label>
                            <Textarea
                              placeholder="Tambahkan komentar verifikasi..."
                              className="mt-1"
                              rows={2}
                              value={item.verifierComment || ""}
                              onChange={(e) =>
                                updateVerificationComment(
                                  item.id,
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overall Verification */}
          <Card>
            <CardHeader>
              <CardTitle>Hasil Verifikasi Keseluruhan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  Status Keseluruhan
                </Label>
                <Select value={overallStatus} onValueChange={setOverallStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_review">
                      🔍 Sedang Direview
                    </SelectItem>
                    <SelectItem value="verified">✅ Terverifikasi</SelectItem>
                    <SelectItem value="needs_revision">
                      ⚠️ Perlu Revisi
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Komentar Keseluruhan
                </Label>
                <Textarea
                  placeholder="Tambahkan komentar keseluruhan hasil verifikasi..."
                  className="mt-1"
                  rows={3}
                  value={overallComment}
                  onChange={(e) => setOverallComment(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Verifikasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
