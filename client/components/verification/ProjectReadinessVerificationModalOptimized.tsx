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
  CheckCircle,
  User,
  Calendar,
  MessageSquare,
  FileText,
  Eye,
  Save,
  X,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { ReadinessDetailDialog } from "@/components/project/ReadinessDetailDialog";
import type { ProjectReadiness, ReadinessStatus } from "@/types";

interface ReadinessItem {
  id: string;
  category: string;
  item: string;
  userStatus: ReadinessStatus;
  verifierStatus: ReadinessStatus;
  userComments: Array<{ id: string; text: string; createdAt: string }>;
  userComment: string;
  verifierComment: string;
  verifierName: string;
  verifiedAt: string;
  riskCapture: Array<{
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
  }>;
}

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
}

interface ProjectReadinessVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: ProjectReadiness;
  onSave: (submissionId: string, verificationData: any) => void;
}

export function ProjectReadinessVerificationModal({
  isOpen,
  onClose,
  submission,
  onSave,
}: ProjectReadinessVerificationModalProps) {
  const [verificationItems, setVerificationItems] = useState<ReadinessItem[]>(
    submission.items?.map((item) => ({
      ...item,
      verifierStatus: item.verifierStatus || "lengkap",
      verifierComment: item.verifierComment || "",
    })) || []
  );

  const [overallComment, setOverallComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailDialog, setDetailDialog] = useState<{
    isOpen: boolean;
    type: "user-comments" | "verifier-feedback";
    title: string;
    data: any;
  }>({
    isOpen: false,
    type: "user-comments",
    title: "",
    data: null,
  });

  const handleItemVerification = useCallback((
    itemId: string,
    status: ReadinessStatus,
    comment: string
  ) => {
    setVerificationItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, verifierStatus: status, verifierComment: comment }
          : item
      )
    );
  }, []);

  const handleSave = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const verificationData = {
        items: verificationItems,
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
  }, [verificationItems, overallComment, submission.id, onSave]);

  const getStatusIcon = useCallback((status: ReadinessStatus) => {
    switch (status) {
      case "lengkap":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "parsial":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "tidak_tersedia":
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  }, []);

  const getStatusColor = useCallback((status: ReadinessStatus) => {
    switch (status) {
      case "lengkap":
        return "bg-green-50 text-green-800 border-green-200";
      case "parsial":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "tidak_tersedia":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  }, []);

  // Memoized summary stats
  const summaryStats = useMemo(() => {
    const total = verificationItems.length;
    const verified = verificationItems.filter(item => item.verifierStatus === "lengkap").length;
    const partial = verificationItems.filter(item => item.verifierStatus === "parsial").length;
    const notAvailable = verificationItems.filter(item => item.verifierStatus === "tidak_tersedia").length;
    
    return { total, verified, partial, notAvailable };
  }, [verificationItems]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] sm:max-w-[95vw] lg:max-w-5xl xl:max-w-6xl h-[100vh] sm:h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-3 sm:p-4 lg:p-6 border-b bg-white flex-shrink-0">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-base sm:text-lg lg:text-xl">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
              <span className="truncate">Verifikasi Project Readiness</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-3 sm:p-4 lg:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Project Information - Responsive Grid */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Informasi Project
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs sm:text-sm font-medium text-gray-600">
                      Nama Project
                    </Label>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                      {submission.projectName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs sm:text-sm font-medium text-gray-600">
                      Project ID
                    </Label>
                    <p className="text-xs sm:text-sm text-gray-900 font-mono break-all">
                      {submission.projectId}
                    </p>
                  </div>
                  <div className="space-y-1 sm:col-span-1">
                    <Label className="text-xs sm:text-sm font-medium text-gray-600">
                      Submitter
                    </Label>
                    <p className="text-sm sm:text-base flex items-center gap-2 text-gray-900 break-words">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                      {submission.submittedBy}
                    </p>
                  </div>
                </div>
                
                {/* Summary Statistics - Mobile Optimized */}
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg sm:text-xl font-bold text-gray-900">{summaryStats.total}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Total Items</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                      <div className="text-lg sm:text-xl font-bold text-green-600">{summaryStats.verified}</div>
                      <div className="text-xs sm:text-sm text-green-600">Verified</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                      <div className="text-lg sm:text-xl font-bold text-yellow-600">{summaryStats.partial}</div>
                      <div className="text-xs sm:text-sm text-yellow-600">Partial</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg">
                      <div className="text-lg sm:text-xl font-bold text-red-600">{summaryStats.notAvailable}</div>
                      <div className="text-xs sm:text-sm text-red-600">Issues</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Items - Mobile Optimized */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Items Verification</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {verificationItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Item Header - Mobile Stacked */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                              {index + 1}
                            </Badge>
                            <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(item.userStatus)}`}>
                              User: {item.userStatus}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm sm:text-base text-gray-900 break-words">
                            {item.category} - {item.item}
                          </h4>
                        </div>
                      </div>

                      {/* User Comments Section - Mobile Optimized */}
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <Label className="text-xs sm:text-sm font-medium text-green-800">
                            User Comments
                          </Label>
                          {item.userComments && item.userComments.length > 0 && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7 px-2 w-full sm:w-auto"
                              onClick={() =>
                                setDetailDialog({
                                  isOpen: true,
                                  type: "user-comments",
                                  title: `User Comments - ${item.category}`,
                                  data: {
                                    userComments: item.userComments,
                                    userStatus: item.userStatus,
                                  },
                                })
                              }
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Details ({item.userComments.length})
                            </Button>
                          )}
                        </div>
                        {item.userComment && (
                          <p className="text-xs sm:text-sm text-green-800 break-words">
                            {item.userComment}
                          </p>
                        )}
                      </div>

                      {/* Verifier Section - Mobile Optimized */}
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg space-y-3">
                        <Label className="text-xs sm:text-sm font-medium text-blue-800">
                          Verifier Assessment
                        </Label>
                        
                        {/* Status Selection - Full Width on Mobile */}
                        <div className="space-y-2">
                          <Label className="text-xs text-blue-700">Status</Label>
                          <Select
                            value={item.verifierStatus}
                            onValueChange={(value: ReadinessStatus) =>
                              handleItemVerification(item.id, value, item.verifierComment)
                            }
                          >
                            <SelectTrigger className="h-8 text-xs sm:text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lengkap">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon("lengkap")}
                                  <span>Lengkap</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="parsial">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon("parsial")}
                                  <span>Parsial</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="tidak_tersedia">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon("tidak_tersedia")}
                                  <span>Tidak Tersedia</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Comment Section - Full Width */}
                        <div className="space-y-2">
                          <Label className="text-xs text-blue-700">Komentar</Label>
                          <Textarea
                            value={item.verifierComment}
                            onChange={(e) =>
                              handleItemVerification(item.id, item.verifierStatus, e.target.value)
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
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Overall Comment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Textarea
                  value={overallComment}
                  onChange={(e) => setOverallComment(e.target.value)}
                  placeholder="Tambahkan komentar overall untuk submission ini..."
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
