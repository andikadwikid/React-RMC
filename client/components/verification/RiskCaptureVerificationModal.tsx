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
  Shield,
  User,
  Calendar,
  Save,
  MessageSquare,
} from "lucide-react";
import type { RiskCapture, RiskItem, RiskVerificationStatus } from "@/types";
import { formatDateTime } from "@/utils/formatters";

interface RiskCaptureVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: RiskCapture;
  onSave: (submissionId: string, data: any) => void;
}

const VERIFICATION_STATUS_CONFIG = {
  pending: {
    label: "Pending Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertTriangle,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  rejected: {
    label: "Needs Revision",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

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

export function RiskCaptureVerificationModal({
  isOpen,
  onClose,
  submission,
  onSave,
}: RiskCaptureVerificationModalProps) {
  const [verificationRisks, setVerificationRisks] = useState<RiskItem[]>([]);
  const [overallStatus, setOverallStatus] = useState<string>(
    submission.status || "submitted",
  );
  const [overallComment, setOverallComment] = useState<string>(
    submission.overallComment || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize verification risks based on submission
    const risks = submission.risks.map((risk) => ({
      ...risk,
      verifierComment: risk.verifierComment || "",
      isVerified: risk.isVerified || false,
    }));
    setVerificationRisks(risks);
  }, [submission]);

  const updateRiskVerification = (
    riskId: string,
    field: "verifierComment" | "isVerified",
    value: string | boolean,
  ) => {
    setVerificationRisks((prev) =>
      prev.map((risk) =>
        risk.id === riskId ? { ...risk, [field]: value } : risk,
      ),
    );
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const verificationData = {
        risks: verificationRisks.map((risk) => ({
          ...risk,
          verifierName: "Current Risk Officer", // This should come from auth context
          verifiedAt: new Date().toISOString(),
        })),
        status: overallStatus,
        overallComment: overallComment,
        verifierName: "Current Risk Officer", // This should come from auth context
        verifiedAt: new Date().toISOString(),
      };

      await onSave(submission.id, verificationData);
    } catch (error) {
      console.error("Error saving risk verification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVerificationProgress = () => {
    const verifiedCount = verificationRisks.filter(
      (risk) => risk.isVerified,
    ).length;
    const totalCount = verificationRisks.length;
    return {
      verified: verifiedCount,
      total: totalCount,
      percentage:
        totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0,
    };
  };

  const progress = getVerificationProgress();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Risk Capture Verification - {submission.projectName}
          </DialogTitle>
        </DialogHeader>

        {/* Submission Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Submitted by:</span>
                <span>{submission.submittedBy}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Submitted at:</span>
                <span>{formatDateTime(submission.submittedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Total Risks:</span>
                <span>{submission.totalRisks}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Verification Progress
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
                Verified:{" "}
                <strong className="text-green-600">{progress.verified}</strong>
              </span>
              <span>
                Total: <strong>{progress.total}</strong>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Risk Items for Verification */}
        <div className="space-y-6 mb-6">
          {verificationRisks.map((risk, index) => (
            <Card key={risk.id} className="border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-medium">
                      Risk #{index + 1}: {risk.sasaran}
                    </h4>
                    <Badge
                      className={getRiskColor(risk.risikoAwal.level)}
                      size="sm"
                    >
                      Level {risk.risikoAwal.level} -{" "}
                      {getRiskLabel(risk.risikoAwal.level)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={risk.isVerified ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateRiskVerification(
                          risk.id,
                          "isVerified",
                          !risk.isVerified,
                        )
                      }
                    >
                      {risk.isVerified ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Pending
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Risk Details */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-xs font-medium text-gray-600">
                      Kode:
                    </Label>
                    <p className="text-sm">{risk.kode}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600">
                      Taksonomi:
                    </Label>
                    <p className="text-sm">{risk.taksonomi}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs font-medium text-gray-600">
                      Peristiwa Risiko:
                    </Label>
                    <p className="text-sm">{risk.peristiwaRisiko}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600">
                      Sumber Risiko:
                    </Label>
                    <p className="text-sm">{risk.sumberRisiko}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600">
                      Kontrol Eksisting:
                    </Label>
                    <p className="text-sm">{risk.kontrolEksisting}</p>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 text-blue-600">
                      Risiko Awal
                    </h5>
                    <div className="space-y-1 text-sm">
                      <div>
                        Kejadian:{" "}
                        <span className="font-medium">
                          {risk.risikoAwal.kejadian}
                        </span>
                      </div>
                      <div>
                        Dampak:{" "}
                        <span className="font-medium">
                          {risk.risikoAwal.dampak}
                        </span>
                      </div>
                      <div>
                        Level:{" "}
                        <span className="font-medium">
                          {risk.risikoAwal.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 text-green-600">
                      Risiko Akhir
                    </h5>
                    <div className="space-y-1 text-sm">
                      <div>
                        Kejadian:{" "}
                        <span className="font-medium">
                          {risk.resikoAkhir.kejadian}
                        </span>
                      </div>
                      <div>
                        Dampak:{" "}
                        <span className="font-medium">
                          {risk.resikoAkhir.dampak}
                        </span>
                      </div>
                      <div>
                        Level:{" "}
                        <span className="font-medium">
                          {risk.resikoAkhir.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dampak Analysis */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-600">
                      Dampak Kualitatif:
                    </Label>
                    <p className="text-sm p-2 bg-gray-50 rounded">
                      {risk.dampakKualitatif}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-600">
                      Dampak Kuantitatif:
                    </Label>
                    <p className="text-sm p-2 bg-gray-50 rounded">
                      {risk.dampakKuantitatif}
                    </p>
                  </div>
                </div>

                {/* Verifier Comment */}
                <div>
                  <Label
                    htmlFor={`comment-${risk.id}`}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Risk Officer Comment
                  </Label>
                  <Textarea
                    id={`comment-${risk.id}`}
                    value={risk.verifierComment}
                    onChange={(e) =>
                      updateRiskVerification(
                        risk.id,
                        "verifierComment",
                        e.target.value,
                      )
                    }
                    placeholder="Add your verification comment for this risk item..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Assessment */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Overall Risk Capture Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="overall-status">Verification Status</Label>
              <Select value={overallStatus} onValueChange={setOverallStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="needs_revision">Needs Revision</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="overall-comment">Overall Comment</Label>
              <Textarea
                id="overall-comment"
                value={overallComment}
                onChange={(e) => setOverallComment(e.target.value)}
                placeholder="Provide overall assessment and recommendations..."
                className="mt-1"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Verification
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
