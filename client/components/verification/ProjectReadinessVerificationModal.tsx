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
  Shield,
  UserCheck,
  Eye,
} from "lucide-react";
import { ReadinessDetailDialog } from "@/components/project/ReadinessDetailDialog";
import type { ProjectReadiness, ReadinessStatus } from "@/types";

interface UserComment {
  id: string;
  text: string;
  createdAt: string;
}

interface ReadinessItem {
  id: string;
  category: string;
  item: string;
  userStatus: ReadinessStatus;
  verifierStatus?: ReadinessStatus;
  userComments: UserComment[];
  userComment?: string; // Keep for backward compatibility
  verifierComment?: string;
  verifierName?: string;
  verifiedAt?: string;
  riskCapture?: RiskItem[];
}
import { formatDateTime } from "@/utils/formatters";
import { getProjectReadinessItems } from "@/utils/dataLoader";
import { RiskCaptureSection } from "./RiskCaptureSection";

import type { ProjectReadinessVerificationModalProps, RiskItem } from "@/types";

// Category display mapping for readiness items
const CATEGORY_DISPLAY_NAMES = {
  administrative: "Dokumen Administratif",
  "user-technical-data": "Data Teknis dari User",
  personnel: "Personel Proyek",
  "legal-financial": "Legal & Finansial",
  "system-equipment": "Kesiapan Sistem & Peralatan",
  "hsse-permits": "HSSE & Perizinan Lapangan",
  "deliverable-output": "Kesiapan Deliverable & Output",
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
  const [detailDialog, setDetailDialog] = useState<{
    isOpen: boolean;
    type: "user-comments" | "verifier-feedback";
    title: string;
    data: any;
  }>({ isOpen: false, type: "user-comments", title: "", data: {} });

  useEffect(() => {
    // Load actual readiness items that user submitted for this project
    const projectReadinessItems = getProjectReadinessItems(
      submission.projectId,
    );

    const allItems: ReadinessItem[] = projectReadinessItems.map((item) => ({
      id: item.id,
      category: item.category,
      item: item.item,
      userStatus: item.user_status,
      verifierStatus: item.verifier_status || undefined,
      userComments: item.user_comments || [],
      userComment: item.user_comment || "", // Keep for backward compatibility
      verifierComment: item.verifier_comment || "",
      verifierName: item.verifier_name || undefined,
      verifiedAt: item.verified_at || undefined,
      riskCapture: item.risk_capture || [],
    }));

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

  const updateRiskCapture = (itemId: string, risks: RiskItem[]) => {
    setVerificationItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, riskCapture: risks } : item,
      ),
    );
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      // Calculate total risk capture summary across all readiness items
      const allRisks = verificationItems.flatMap(
        (item) => item.riskCapture || [],
      );
      const totalRiskCapture = allRisks.length;
      const riskLevelDistribution = {
        sangatRendah: allRisks.filter(
          (r) => r.risikoSaatIni.level >= 1 && r.risikoSaatIni.level <= 5,
        ).length,
        rendah: allRisks.filter(
          (r) => r.risikoSaatIni.level >= 6 && r.risikoSaatIni.level <= 10,
        ).length,
        sedang: allRisks.filter(
          (r) => r.risikoSaatIni.level >= 11 && r.risikoSaatIni.level <= 15,
        ).length,
        tinggi: allRisks.filter(
          (r) => r.risikoSaatIni.level >= 16 && r.risikoSaatIni.level <= 20,
        ).length,
        sangatTinggi: allRisks.filter(
          (r) => r.risikoSaatIni.level >= 21 && r.risikoSaatIni.level <= 25,
        ).length,
      };

      const verificationData = {
        items: verificationItems,
        status: overallStatus,
        overallComment,
        verifierName: "Current Verifier", // Should come from auth context
        verifiedAt: new Date().toISOString(),
        riskCaptureData: {
          totalRiskCapture,
          riskLevelDistribution,
          allRisks,
        },
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
      <DialogContent className="max-w-[100vw] sm:max-w-[95vw] lg:max-w-5xl h-[100vh] sm:h-[95vh] max-h-[100vh] sm:max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-3 sm:p-4 lg:p-6 border-b">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-base sm:text-lg lg:text-xl">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 lg:w-6 lg:w-6 text-blue-600" />
              <span>Verifikasi Project Readiness</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {/* Project Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Informasi Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Nama Project
                  </Label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {submission.projectName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Project ID
                  </Label>
                  <p className="text-sm text-gray-900 mt-1 font-mono">
                    {submission.projectId}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Submitter
                  </Label>
                  <p className="text-sm flex items-center gap-2 text-gray-900 mt-1">
                    <User className="w-4 h-4 text-blue-600" />
                    {submission.submittedBy}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Tanggal Submit
                  </Label>
                  <p className="text-sm flex items-center gap-2 text-gray-900 mt-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
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
                  <CardTitle className="text-base">
                    {CATEGORY_DISPLAY_NAMES[
                      category as keyof typeof CATEGORY_DISPLAY_NAMES
                    ] || category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 space-y-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-base">
                              {item.item}
                            </h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 font-medium">
                                  User Status:
                                </span>
                                {getStatusBadge(item.userStatus)}
                              </div>
                              {item.verifierStatus && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 font-medium">
                                    Verifier Status:
                                  </span>
                                  {getStatusBadge(item.verifierStatus)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* User Comments Section with Detail Dialog */}
                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">
                                Keterangan User:
                              </span>
                              {item.userComments &&
                                item.userComments.length > 0 && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    {item.userComments.length} komentar
                                  </Badge>
                                )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setDetailDialog({
                                  isOpen: true,
                                  type: "user-comments",
                                  title: item.item,
                                  data: {
                                    userComments: item.userComments || [],
                                    userStatus: item.userStatus,
                                  },
                                })
                              }
                              className="min-h-[36px] px-3 py-2 text-xs sm:text-sm hover:bg-green-100 hover:border-green-300 w-full sm:w-auto"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              {item.userComments && item.userComments.length > 0
                                ? "Lihat Detail"
                                : "Tidak Ada"}
                            </Button>
                          </div>
                        </div>

                        {/* Verifier Feedback Section with Detail Dialog */}
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-700">
                                Feedback Risk Officer:
                              </span>
                              {item.verifierComment && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  Ada feedback
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setDetailDialog({
                                  isOpen: true,
                                  type: "verifier-feedback",
                                  title: item.item,
                                  data: {
                                    verifierComment: item.verifierComment,
                                    verifierName: item.verifierName,
                                    verifiedAt: item.verifiedAt,
                                    verifierStatus: item.verifierStatus,
                                  },
                                })
                              }
                              className="min-h-[36px] px-3 py-2 text-xs sm:text-sm hover:bg-blue-100 hover:border-blue-300 w-full sm:w-auto"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              {item.verifierComment
                                ? "Lihat Detail"
                                : "Tidak Ada"}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">
                              Verifier Status
                            </Label>
                            <Select
                              value={item.verifierStatus || ""}
                              onValueChange={(value: ReadinessStatus) =>
                                updateVerificationStatus(item.id, value)
                              }
                            >
                              <SelectTrigger className="mt-2 h-11">
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
                            <Label className="text-sm font-medium text-gray-700">
                              Komentar Verifier
                            </Label>
                            <Textarea
                              placeholder="Tambahkan komentar verifikasi..."
                              className="mt-2 min-h-[80px] resize-none focus:ring-blue-500 focus:border-blue-500"
                              rows={3}
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

                        {/* Risk Capture Section */}
                        <RiskCaptureSection
                          readinessItemId={item.id}
                          readinessItemTitle={item.item}
                          riskCapture={item.riskCapture || []}
                          onRiskCaptureChange={updateRiskCapture}
                          disabled={isSubmitting}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Risk Capture Summary */}
          {(() => {
            const allRisks = verificationItems.flatMap(
              (item) => item.riskCapture || [],
            );
            const totalRisks = allRisks.length;
            const riskSummary = {
              sangatRendah: allRisks.filter(
                (r) => r.risikoSaatIni.level >= 1 && r.risikoSaatIni.level <= 5,
              ).length,
              rendah: allRisks.filter(
                (r) =>
                  r.risikoSaatIni.level >= 6 && r.risikoSaatIni.level <= 10,
              ).length,
              sedang: allRisks.filter(
                (r) =>
                  r.risikoSaatIni.level >= 11 && r.risikoSaatIni.level <= 15,
              ).length,
              tinggi: allRisks.filter(
                (r) =>
                  r.risikoSaatIni.level >= 16 && r.risikoSaatIni.level <= 20,
              ).length,
              sangatTinggi: allRisks.filter(
                (r) =>
                  r.risikoSaatIni.level >= 21 && r.risikoSaatIni.level <= 25,
              ).length,
            };

            return totalRisks > 0 ? (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    Ringkasan Risk Capture Keseluruhan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {totalRisks}
                      </div>
                      <div className="text-xs text-gray-600">Total Risks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-700">
                        {riskSummary.sangatRendah}
                      </div>
                      <div className="text-xs text-green-600">
                        Sangat Rendah
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-700">
                        {riskSummary.rendah}
                      </div>
                      <div className="text-xs text-yellow-600">Rendah</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-700">
                        {riskSummary.sedang}
                      </div>
                      <div className="text-xs text-orange-600">Sedang</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-700">
                        {riskSummary.tinggi}
                      </div>
                      <div className="text-xs text-red-600">Tinggi</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-900">
                        {riskSummary.sangatTinggi}
                      </div>
                      <div className="text-xs text-red-800">Sangat Tinggi</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null;
          })()}

          {/* Overall Verification */}
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Hasil Verifikasi Keseluruhan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Status Keseluruhan
                </Label>
                <Select value={overallStatus} onValueChange={setOverallStatus}>
                  <SelectTrigger className="mt-2 h-11">
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
                <Label className="text-sm font-medium text-gray-700">
                  Komentar Keseluruhan
                </Label>
                <Textarea
                  placeholder="Tambahkan komentar keseluruhan hasil verifikasi..."
                  className="mt-2 min-h-[100px] resize-none focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={overallComment}
                  onChange={(e) => setOverallComment(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="p-3 sm:p-4 lg:p-6 border-t bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="order-2 sm:order-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="order-1 sm:order-2"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </div>
              ) : (
                "Simpan Verifikasi"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Detail Dialog for User Comments and Verifier Feedback */}
      <ReadinessDetailDialog
        isOpen={detailDialog.isOpen}
        onClose={() => setDetailDialog({ ...detailDialog, isOpen: false })}
        type={detailDialog.type}
        title={detailDialog.title}
        data={detailDialog.data}
      />
    </Dialog>
  );
}
