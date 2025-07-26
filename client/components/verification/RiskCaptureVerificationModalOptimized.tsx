import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Save,
  TrendingUp,
  Target,
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
  riskLevel: string;
  probabilitas: number;
  dampak: number;
  riskScore: number;
  mitigasiPlan: string;
  responsible: string;
  targetCompletion: string;
  verifierStatus?: "approved" | "rejected" | "pending";
  verifierComment?: string;
}

interface RiskCaptureSubmission {
  id: string;
  projectId: string;
  projectName: string;
  submittedBy: string;
  submittedAt: string;
  totalRisks: number;
  riskLevelDistribution: {
    sangatRendah: number;
    rendah: number;
    sedang: number;
    tinggi: number;
    sangatTinggi: number;
  };
  overallComment?: string;
  risks: RiskItem[];
}

interface RiskCaptureVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: RiskCaptureSubmission;
  onSave: (submissionId: string, verificationData: any) => void;
}

export function RiskCaptureVerificationModal({
  isOpen,
  onClose,
  submission,
  onSave,
}: RiskCaptureVerificationModalProps) {
  const [verificationRisks, setVerificationRisks] = useState<RiskItem[]>(
    submission.risks?.map((risk) => ({
      ...risk,
      verifierStatus: risk.verifierStatus || "pending",
      verifierComment: risk.verifierComment || "",
    })) || [],
  );

  const [overallComment, setOverallComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRiskVerification = useCallback(
    (
      riskId: string,
      status: "approved" | "rejected" | "pending",
      comment: string,
    ) => {
      setVerificationRisks((prev) =>
        prev.map((risk) =>
          risk.id === riskId
            ? { ...risk, verifierStatus: status, verifierComment: comment }
            : risk,
        ),
      );
    },
    [],
  );

  const handleSave = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const verificationData = {
        risks: verificationRisks,
        overallComment,
        status: "verified",
        verifierName: "Current Verifier",
        verifiedAt: new Date().toISOString(),
      };

      await onSave(submission.id, verificationData);
    } catch (error) {
      console.error("Error saving verification:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [verificationRisks, overallComment, submission.id, onSave]);

  const getRiskLevelColor = useCallback((level: string) => {
    switch (level.toLowerCase()) {
      case "sangat rendah":
        return "bg-green-100 text-green-800 border-green-200";
      case "rendah":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "sedang":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "tinggi":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "sangat tinggi":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  }, []);

  // Memoized statistics
  const verificationStats = useMemo(() => {
    const total = verificationRisks.length;
    const approved = verificationRisks.filter(
      (r) => r.verifierStatus === "approved",
    ).length;
    const rejected = verificationRisks.filter(
      (r) => r.verifierStatus === "rejected",
    ).length;
    const pending = verificationRisks.filter(
      (r) => r.verifierStatus === "pending",
    ).length;

    return { total, approved, rejected, pending };
  }, [verificationRisks]);

  const riskDistribution = useMemo(() => {
    const distribution = {
      "sangat rendah": 0,
      rendah: 0,
      sedang: 0,
      tinggi: 0,
      "sangat tinggi": 0,
    };

    verificationRisks.forEach((risk) => {
      const level = risk.riskLevel.toLowerCase();
      if (distribution.hasOwnProperty(level)) {
        distribution[level as keyof typeof distribution]++;
      }
    });

    return distribution;
  }, [verificationRisks]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] sm:max-w-[95vw] lg:max-w-6xl xl:max-w-7xl h-[100vh] sm:h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-3 sm:p-4 lg:p-6 border-b bg-white flex-shrink-0">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-base sm:text-lg lg:text-xl">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
              <span className="truncate">Risk Capture Verification</span>
            </div>
            <span className="text-xs sm:text-sm lg:text-base text-gray-600 font-normal truncate">
              {submission.projectName}
            </span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-3 sm:p-4 lg:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Submission Info - Mobile Optimized */}
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium text-xs sm:text-sm">
                        Submitted by:
                      </span>
                    </div>
                    <span className="text-gray-900 text-xs sm:text-sm break-words">
                      {submission.submittedBy}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium text-xs sm:text-sm">
                        Date:
                      </span>
                    </div>
                    <span className="text-gray-900 text-xs sm:text-sm">
                      {new Date(submission.submittedAt).toLocaleDateString(
                        "id-ID",
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium text-xs sm:text-sm">
                        Total Risks:
                      </span>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs">
                      {submission.totalRisks}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Overview - Mobile Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-gray-900">
                  {verificationStats.total}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Total</div>
              </Card>
              <Card className="p-3 text-center bg-green-50">
                <div className="text-lg sm:text-xl font-bold text-green-600">
                  {verificationStats.approved}
                </div>
                <div className="text-xs sm:text-sm text-green-600">
                  Approved
                </div>
              </Card>
              <Card className="p-3 text-center bg-red-50">
                <div className="text-lg sm:text-xl font-bold text-red-600">
                  {verificationStats.rejected}
                </div>
                <div className="text-xs sm:text-sm text-red-600">Rejected</div>
              </Card>
              <Card className="p-3 text-center bg-yellow-50">
                <div className="text-lg sm:text-xl font-bold text-yellow-600">
                  {verificationStats.pending}
                </div>
                <div className="text-xs sm:text-sm text-yellow-600">
                  Pending
                </div>
              </Card>
            </div>

            {/* Risk Level Distribution - Mobile Responsive */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Risk Level Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                  {Object.entries(riskDistribution).map(([level, count]) => (
                    <div key={level} className="text-center">
                      <Badge
                        className={`w-full justify-center mb-1 text-xs ${getRiskLevelColor(level)}`}
                      >
                        {count}
                      </Badge>
                      <div className="text-xs text-gray-600 capitalize">
                        {level.replace("_", " ")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Items - Mobile Optimized */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">
                  Risk Items Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {verificationRisks.map((risk, index) => (
                    <div
                      key={risk.id}
                      className="border rounded-lg p-3 sm:p-4 space-y-3 hover:bg-gray-50 transition-colors"
                    >
                      {/* Risk Header - Mobile Stacked */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0.5"
                          >
                            #{index + 1}
                          </Badge>
                          <Badge
                            className={`text-xs px-2 py-0.5 ${getRiskLevelColor(risk.riskLevel)}`}
                          >
                            {risk.riskLevel}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm sm:text-base text-gray-900 break-words">
                          {risk.peristiwaRisiko}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 break-words">
                          {risk.sumberRisiko}
                        </p>
                      </div>

                      {/* Risk Details - Mobile Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">
                            Sasaran
                          </Label>
                          <p className="break-words">{risk.sasaran}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Kode</Label>
                          <p className="font-mono break-all">{risk.kode}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Score</Label>
                          <Badge variant="outline" className="w-fit">
                            {risk.riskScore}
                          </Badge>
                        </div>
                      </div>

                      {/* Impact & Control - Mobile Optimized */}
                      <div className="space-y-2">
                        <div className="bg-orange-50 p-2 sm:p-3 rounded border border-orange-200">
                          <Label className="text-xs text-orange-700 font-medium">
                            Dampak
                          </Label>
                          <p className="text-xs sm:text-sm text-orange-800 mt-1 break-words">
                            {risk.dampakKualitatif}
                          </p>
                        </div>
                        <div className="bg-blue-50 p-2 sm:p-3 rounded border border-blue-200">
                          <Label className="text-xs text-blue-700 font-medium">
                            Kontrol Eksisting
                          </Label>
                          <p className="text-xs sm:text-sm text-blue-800 mt-1 break-words">
                            {risk.kontrolEksisting}
                          </p>
                        </div>
                      </div>

                      {/* Verification Section - Mobile Optimized */}
                      <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg space-y-3">
                        <Label className="text-xs sm:text-sm font-medium text-gray-800">
                          Verifier Assessment
                        </Label>

                        {/* Status Selection - Full Width on Mobile */}
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-700">
                            Status
                          </Label>
                          <Select
                            value={risk.verifierStatus || "pending"}
                            onValueChange={(
                              value: "approved" | "rejected" | "pending",
                            ) =>
                              handleRiskVerification(
                                risk.id,
                                value,
                                risk.verifierComment || "",
                              )
                            }
                          >
                            <SelectTrigger className="h-8 text-xs sm:text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="approved">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon("approved")}
                                  <span>Approved</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="rejected">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon("rejected")}
                                  <span>Rejected</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="pending">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon("pending")}
                                  <span>Pending</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Comment Section - Full Width */}
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-700">
                            Komentar
                          </Label>
                          <Textarea
                            value={risk.verifierComment || ""}
                            onChange={(e) =>
                              handleRiskVerification(
                                risk.id,
                                risk.verifierStatus || "pending",
                                e.target.value,
                              )
                            }
                            placeholder="Tambahkan komentar verifikasi..."
                            className="min-h-[60px] text-xs sm:text-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Overall Comment - Mobile Optimized */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">
                  Overall Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Textarea
                  value={overallComment}
                  onChange={(e) => setOverallComment(e.target.value)}
                  placeholder="Tambahkan assessment keseluruhan untuk risk capture ini..."
                  className="min-h-[80px] sm:min-h-[100px] text-sm resize-none"
                />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Footer - Mobile Optimized */}
        <DialogFooter className="p-3 sm:p-4 lg:p-6 border-t bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Verification"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
