import React, { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  Calendar,
  X,
  Eye,
  Shield,
  AlertTriangle,
  FileText,
  Building2,
  User,
} from "lucide-react";
import type { RiskItem } from "@/types";

interface QuickRiskCaptureDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  quickRiskData: {
    risks: RiskItem[];
    totalRisks: number;
    completedAt?: string;
  } | null;
}

const QuickRiskCaptureDetailModal = memo(
  ({ isOpen, onClose, projectName, quickRiskData }: QuickRiskCaptureDetailModalProps) => {
    if (!quickRiskData) return null;

    const getRiskLevelColor = (level: number) => {
      if (level >= 1 && level <= 5) return "bg-green-100 text-green-800";
      if (level >= 6 && level <= 10) return "bg-yellow-100 text-yellow-800";
      if (level >= 11 && level <= 15) return "bg-orange-100 text-orange-800";
      if (level >= 16 && level <= 20) return "bg-red-100 text-red-800";
      if (level >= 21 && level <= 25) return "bg-red-200 text-red-900";
      return "bg-gray-100 text-gray-800";
    };

    const getRiskLevelLabel = (level: number) => {
      if (level >= 1 && level <= 5) return "Sangat Rendah";
      if (level >= 6 && level <= 10) return "Rendah";
      if (level >= 11 && level <= 15) return "Sedang";
      if (level >= 16 && level <= 20) return "Tinggi";
      if (level >= 21 && level <= 25) return "Sangat Tinggi";
      return "Belum Dinilai";
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[95vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 border-b bg-orange-50">
            <DialogTitle className="flex items-center gap-3">
              <Target className="w-6 h-6 text-orange-600" />
              <div>
                <span className="text-orange-900">Quick Risk Capture - Detail View</span>
                <p className="text-sm font-normal text-orange-700 mt-1">
                  Project: {projectName}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Summary Card */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <span className="text-orange-900">Quick Risk Capture Summary</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    {quickRiskData.totalRisks} Risk{quickRiskData.totalRisks > 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-700 font-medium">Project:</span>
                    <span className="text-orange-900">{projectName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-700 font-medium">Total Risks:</span>
                    <span className="text-orange-900 font-semibold">{quickRiskData.totalRisks}</span>
                  </div>
                  {quickRiskData.completedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-700 font-medium">Completed:</span>
                      <span className="text-orange-900">
                        {new Date(quickRiskData.completedAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
                
                <Separator className="bg-orange-200" />
                
                <div className="text-xs text-orange-700">
                  <p className="flex items-start gap-2">
                    <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Quick Risk Capture adalah data risiko yang diinput langsung oleh user untuk identifikasi cepat risiko project.
                    Data ini dapat diverifikasi dan dinilai lebih lanjut oleh Risk Officer.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Risk Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Risk Items Detail
              </h3>
              
              {quickRiskData.risks.map((risk, index) => (
                <Card key={risk.id || index} className="border-orange-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium">
                            Risk #{index + 1}
                          </span>
                          <Badge variant="outline" className="text-orange-600 border-orange-300">
                            {risk.kode}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{risk.taksonomi}</p>
                      </div>
                      
                      {/* Risk Level Badge */}
                      {risk.risikoSaatIni && (
                        <Badge className={getRiskLevelColor(risk.risikoSaatIni.level)}>
                          Level {risk.risikoSaatIni.level} - {getRiskLevelLabel(risk.risikoSaatIni.level)}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Risk Event */}
                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        Peristiwa Risiko
                      </h5>
                      <div className="bg-gray-50 p-3 rounded-lg border">
                        <p className="text-sm text-gray-900">{risk.peristiwaRisiko}</p>
                      </div>
                    </div>

                    {/* Source and Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Sumber Risiko</h5>
                        <div className="bg-gray-50 p-3 rounded-lg border">
                          <p className="text-sm text-gray-900">{risk.sumberRisiko}</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Kontrol Eksisting</h5>
                        <div className="bg-gray-50 p-3 rounded-lg border">
                          <p className="text-sm text-gray-900">{risk.kontrolEksisting}</p>
                        </div>
                      </div>
                    </div>

                    {/* Impact Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Dampak Kualitatif</h5>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-900">{risk.dampakKualitatif}</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Dampak Kuantitatif</h5>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="text-sm text-green-900">{risk.dampakKuantitatif}</p>
                        </div>
                      </div>
                    </div>

                    {/* Risk Assessment (if available) */}
                    {risk.risikoSaatIni && (
                      <div className="border-t pt-4">
                        <h5 className="font-medium text-sm text-gray-700 mb-3">Risk Assessment</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                            <p className="text-xs text-blue-600 font-medium mb-1">Kejadian</p>
                            <p className="text-lg font-bold text-blue-800">{risk.risikoSaatIni.kejadian}</p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center">
                            <p className="text-xs text-yellow-600 font-medium mb-1">Dampak</p>
                            <p className="text-lg font-bold text-yellow-800">{risk.risikoSaatIni.dampak}</p>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-center">
                            <p className="text-xs text-red-600 font-medium mb-1">Level Risiko</p>
                            <p className="text-lg font-bold text-red-800">{risk.risikoSaatIni.level}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No risks message */}
            {quickRiskData.risks.length === 0 && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="text-center py-12">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Quick Risk Capture Data
                  </h3>
                  <p className="text-gray-500">
                    Belum ada data quick risk capture untuk project ini.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-gray-600">
                <User className="w-4 h-4 inline mr-1" />
                Quick Risk Capture dapat diverifikasi melalui dialog verifikasi project readiness
              </div>
              <Button onClick={onClose} className="gap-2">
                <X className="w-4 h-4" />
                Tutup
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

QuickRiskCaptureDetailModal.displayName = "QuickRiskCaptureDetailModal";

export default QuickRiskCaptureDetailModal;
