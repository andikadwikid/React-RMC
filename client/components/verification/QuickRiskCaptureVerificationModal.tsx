import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  AlertTriangle,
  Shield,
  Clock,
  Plus,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { getProjectRiskCapture } from "@/utils/dataLoader";
import { toast } from "sonner";

import type { RiskItem } from "@/types";

interface QuickRiskItem extends RiskItem {
  risikoAwal: {
    kejadian: number;
    dampak: number;
    level: number;
  };
  risikoSaatIni: {
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

interface TaksonomiItem {
  kode: string;
  title: string;
  taksonomi: string;
}

interface QuickRiskCaptureVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onSave: (data: any) => void;
}

export function QuickRiskCaptureVerificationModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  onSave,
}: QuickRiskCaptureVerificationModalProps) {
  const [quickRiskCapture, setQuickRiskCapture] = useState<QuickRiskItem[]>([]);
  const [taksonomiData, setTaksonomiData] = useState<TaksonomiItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load taksonomi data
  useEffect(() => {
    const loadTaksonomiData = async () => {
      try {
        const response = await fetch('/client/data/master/taksonomi.json');
        const data = await response.json();
        setTaksonomiData(data.taksonomi);
      } catch (error) {
        console.error('Failed to load taksonomi data:', error);
      }
    };
    loadTaksonomiData();
  }, []);

  useEffect(() => {
    if (isOpen && projectId) {
      // Load quick risk capture data from project
      const quickRiskData = getProjectRiskCapture(projectId);
      if (quickRiskData && quickRiskData.risks) {
        const quickRisks: QuickRiskItem[] = quickRiskData.risks.map((risk: RiskItem) => ({
          ...risk,
          risikoAwal: { kejadian: 1, dampak: 1, level: 1 },
          risikoSaatIni: { kejadian: 1, dampak: 1, level: 1 },
          resikoAkhir: { kejadian: 1, dampak: 1, level: 1 },
          isVerified: false,
          verifierComment: "",
        }));
        setQuickRiskCapture(quickRisks);
      }
    }
  }, [isOpen, projectId]);

  const updateQuickRiskCapture = (
    riskId: string,
    field: string,
    value: any,
  ): void => {
    setQuickRiskCapture((prev) =>
      prev.map((risk) => {
        if (risk.id !== riskId) return risk;

        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          return {
            ...risk,
            [parent]: {
              ...risk[parent as keyof QuickRiskItem],
              [child]: value,
            },
          };
        }

        return { ...risk, [field]: value };
      }),
    );
  };

  const addNewQuickRisk = () => {
    const newRisk: QuickRiskItem = {
      id: Date.now().toString(),
      kode: "",
      taksonomi: "",
      peristiwaRisiko: "",
      sumberRisiko: "",
      dampakKualitatif: "",
      dampakKuantitatif: "",
      kontrolEksisting: "",
      risikoAwal: { kejadian: 1, dampak: 1, level: 1 },
      risikoSaatIni: { kejadian: 1, dampak: 1, level: 1 },
      resikoAkhir: { kejadian: 1, dampak: 1, level: 1 },
      isVerified: false,
      verifierComment: "",
    };
    setQuickRiskCapture([...quickRiskCapture, newRisk]);
  };

  const removeQuickRisk = (riskId: string) => {
    setQuickRiskCapture(quickRiskCapture.filter(risk => risk.id !== riskId));
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

  const calculateProgress = () => {
    if (quickRiskCapture.length === 0) return { verified: 0, total: 0, percentage: 0 };
    
    const verified = quickRiskCapture.filter(risk => risk.isVerified).length;
    const total = quickRiskCapture.length;
    const percentage = total > 0 ? Math.round((verified / total) * 100) : 0;
    
    return { verified, total, percentage };
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      const verificationData = {
        projectId,
        quickRiskCapture,
        verifiedAt: new Date().toISOString(),
        verifierName: "Risk Officer", // This should come from auth context
      };
      
      await onSave(verificationData);
      toast.success("Quick Risk Capture berhasil diverifikasi!");
      onClose();
    } catch (error) {
      console.error("Error saving verification:", error);
      toast.error("Gagal menyimpan verifikasi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = calculateProgress();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6 text-orange-600" />
            Quick Risk Capture Verification - {projectName}
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Verifikasi dan kelola quick risk capture yang disubmit user. 
            Anda dapat memperbarui assessment dan menambah risk baru.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Summary */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-600" />
                Progress Verifikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Verification Progress
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {progress.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Verified: <strong className="text-green-600">{progress.verified}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-gray-600" />
                  Total: <strong>{progress.total}</strong>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Add New Risk Button */}
          <div className="flex justify-end">
            <Button onClick={addNewQuickRisk} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Quick Risk Baru
            </Button>
          </div>

          {/* Quick Risk Items */}
          <div className="space-y-4">
            {quickRiskCapture.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="text-center py-12">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Belum ada Quick Risk Capture
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Belum ada data quick risk capture untuk project ini.
                    Anda dapat menambahkan risk baru dengan klik tombol di atas.
                  </p>
                </CardContent>
              </Card>
            ) : (
              quickRiskCapture.map((risk, index) => (
                <Card key={risk.id} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-base font-medium">
                        Quick Risk #{index + 1}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getRiskColor(risk.risikoSaatIni.level)}
                          size="sm"
                        >
                          Level {risk.risikoSaatIni.level} - {getRiskLabel(risk.risikoSaatIni.level)}
                        </Badge>
                        <Button
                          variant={risk.isVerified ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            updateQuickRiskCapture(
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuickRisk(risk.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Editable Risk Details */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`kode-${risk.id}`}>Kode *</Label>
                          <Select
                            value={risk.kode}
                            onValueChange={(value) => {
                              updateQuickRiskCapture(risk.id, "kode", value);
                              // Auto-fill taksonomi based on selected kode
                              const selectedTaksonomi = taksonomiData.find(
                                (item) => item.kode === value
                              );
                              if (selectedTaksonomi) {
                                updateQuickRiskCapture(
                                  risk.id,
                                  "taksonomi",
                                  selectedTaksonomi.taksonomi
                                );
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kode risiko" />
                            </SelectTrigger>
                            <SelectContent>
                              {taksonomiData.map((item) => (
                                <SelectItem key={item.kode} value={item.kode}>
                                  {item.kode} - {item.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`taksonomi-${risk.id}`}>Taksonomi *</Label>
                          <Input
                            id={`taksonomi-${risk.id}`}
                            value={risk.taksonomi}
                            readOnly
                            placeholder="Akan terisi otomatis berdasarkan kode"
                            className="bg-gray-50"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`sumberRisiko-${risk.id}`}>Sumber Risiko *</Label>
                        <Input
                          id={`sumberRisiko-${risk.id}`}
                          value={risk.sumberRisiko}
                          onChange={(e) =>
                            updateQuickRiskCapture(
                              risk.id,
                              "sumberRisiko",
                              e.target.value,
                            )
                          }
                          placeholder="Masukkan sumber risiko"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`peristiwaRisiko-${risk.id}`}>Peristiwa Risiko *</Label>
                        <Textarea
                          id={`peristiwaRisiko-${risk.id}`}
                          value={risk.peristiwaRisiko}
                          onChange={(e) =>
                            updateQuickRiskCapture(
                              risk.id,
                              "peristiwaRisiko",
                              e.target.value,
                            )
                          }
                          placeholder="Jelaskan peristiwa risiko yang mungkin terjadi"
                          className="min-h-[80px] resize-none"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`dampakKualitatif-${risk.id}`}>Dampak Kualitatif *</Label>
                          <Textarea
                            id={`dampakKualitatif-${risk.id}`}
                            value={risk.dampakKualitatif}
                            onChange={(e) =>
                              updateQuickRiskCapture(
                                risk.id,
                                "dampakKualitatif",
                                e.target.value,
                              )
                            }
                            placeholder="Jelaskan dampak kualitatif"
                            className="min-h-[80px] resize-none"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`dampakKuantitatif-${risk.id}`}>Dampak Kuantitatif *</Label>
                          <Textarea
                            id={`dampakKuantitatif-${risk.id}`}
                            value={risk.dampakKuantitatif}
                            onChange={(e) =>
                              updateQuickRiskCapture(
                                risk.id,
                                "dampakKuantitatif",
                                e.target.value,
                              )
                            }
                            placeholder="Jelaskan dampak kuantitatif (angka, nilai, dll)"
                            className="min-h-[80px] resize-none"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`kontrolEksisting-${risk.id}`}>Kontrol Eksisting *</Label>
                        <Textarea
                          id={`kontrolEksisting-${risk.id}`}
                          value={risk.kontrolEksisting}
                          onChange={(e) =>
                            updateQuickRiskCapture(
                              risk.id,
                              "kontrolEksisting",
                              e.target.value,
                            )
                          }
                          placeholder="Jelaskan kontrol yang sudah ada"
                          className="min-h-[80px] resize-none"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Risk Officer Assessment */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Risiko Awal */}
                      <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                        <h5 className="font-medium mb-3 text-blue-700 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Risiko Awal
                        </h5>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs">Kejadian (1-25)</Label>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={risk.risikoAwal.kejadian}
                              onChange={(e) =>
                                updateQuickRiskCapture(
                                  risk.id,
                                  "risikoAwal.kejadian",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Dampak (1-25)</Label>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={risk.risikoAwal.dampak}
                              onChange={(e) =>
                                updateQuickRiskCapture(
                                  risk.id,
                                  "risikoAwal.dampak",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Level (1-25)</Label>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={risk.risikoAwal.level}
                              onChange={(e) =>
                                updateQuickRiskCapture(
                                  risk.id,
                                  "risikoAwal.level",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Risiko Saat Ini */}
                      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                        <h5 className="font-medium mb-3 text-yellow-700 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Risiko Saat Ini
                        </h5>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs">Kejadian (1-25)</Label>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={risk.risikoSaatIni.kejadian}
                              onChange={(e) =>
                                updateQuickRiskCapture(
                                  risk.id,
                                  "risikoSaatIni.kejadian",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Dampak (1-25)</Label>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={risk.risikoSaatIni.dampak}
                              onChange={(e) =>
                                updateQuickRiskCapture(
                                  risk.id,
                                  "risikoSaatIni.dampak",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Level (1-25)</Label>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={risk.risikoSaatIni.level}
                              onChange={(e) =>
                                updateQuickRiskCapture(
                                  risk.id,
                                  "risikoSaatIni.level",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Risiko Akhir */}
                      <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                        <h5 className="font-medium mb-3 text-green-700 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Risiko Akhir
                        </h5>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs">Kejadian (1-25)</Label>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={risk.resikoAkhir.kejadian}
                              onChange={(e) =>
                                updateQuickRiskCapture(
                                  risk.id,
                                  "resikoAkhir.kejadian",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Dampak (1-25)</Label>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={risk.resikoAkhir.dampak}
                              onChange={(e) =>
                                updateQuickRiskCapture(
                                  risk.id,
                                  "resikoAkhir.dampak",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Level (1-25)</Label>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={risk.resikoAkhir.level}
                              onChange={(e) =>
                                updateQuickRiskCapture(
                                  risk.id,
                                  "resikoAkhir.level",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Officer Comment */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Komentar Risk Officer
                      </Label>
                      <Textarea
                        value={risk.verifierComment || ""}
                        onChange={(e) =>
                          updateQuickRiskCapture(
                            risk.id,
                            "verifierComment",
                            e.target.value,
                          )
                        }
                        placeholder="Tambahkan komentar verifikasi untuk quick risk capture ini..."
                        className="mt-2 min-h-[80px] resize-none"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <DialogFooter className="border-t pt-6">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Menyimpan..." : "Simpan Verifikasi"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
