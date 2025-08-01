import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { getProjectRiskCapture } from "@/utils/dataLoader";

import type { RiskItem, RiskCaptureFormProps } from "@/types";

interface TaksonomiItem {
  kode: string;
  title: string;
  taksonomi: string;
}

export function RiskCaptureForm({
  isOpen,
  onClose,
  projectId,
  projectName,
  onSave,
}: RiskCaptureFormProps) {
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [taksonomiData, setTaksonomiData] = useState<TaksonomiItem[]>([]);

  // Load taksonomi data
  useEffect(() => {
    const loadTaksonomiData = async () => {
      try {
        const response = await fetch("/client/data/master/taksonomi.json");
        const data = await response.json();
        setTaksonomiData(data.taksonomi);
      } catch (error) {
        console.error("Failed to load taksonomi data:", error);
      }
    };
    loadTaksonomiData();
  }, []);

  // Load existing risk capture data when modal opens
  useEffect(() => {
    if (isOpen && projectId) {
      const existingRiskCapture = getProjectRiskCapture(projectId);
      if (existingRiskCapture && existingRiskCapture.risks) {
        setRisks(existingRiskCapture.risks);
      } else {
        setRisks([]);
      }
    }
  }, [isOpen, projectId]);

  const addRiskItem = () => {
    const newRisk: RiskItem = {
      id: Date.now().toString(),
      kode: "",
      taksonomi: "",
      peristiwaRisiko: "",
      sumberRisiko: "",
      dampakKualitatif: "",
      dampakKuantitatif: "",
      kontrolEksisting: "",
    };
    setRisks([...risks, newRisk]);
  };

  const removeRiskItem = (id: string) => {
    setRisks(risks.filter((risk) => risk.id !== id));
  };

  const updateRiskItem = (
    id: string,
    field: keyof RiskItem | string,
    value: string | number,
  ) => {
    setRisks((prev) =>
      prev.map((risk) => {
        if (risk.id !== id) return risk;

        if (field.includes(".")) {
          // Handle nested fields like 'risikoAwal.kejadian'
          const [parent, child] = field.split(".");
          return {
            ...risk,
            [parent]: {
              ...risk[parent as keyof RiskItem],
              [child]: value,
            },
          };
        }

        return { ...risk, [field]: value };
      }),
    );
  };

  const handleSave = () => {
    const riskData = {
      projectId,
      risks,
      completedAt: new Date().toISOString(),
      totalRisks: risks.length,
    };

    onSave(riskData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto sm:w-full">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-start gap-2 text-lg sm:text-xl">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="leading-tight break-words">
              Quick Risk Capture Assessment - {projectName}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Risk Items */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <span>Daftar Quick Risk Capture</span>
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Tambahkan dan kelola quick risk capture untuk project ini
                  </p>
                </div>
                <Badge variant="outline" className="text-blue-600 self-start">
                  {risks.length} Quick Risk{risks.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {risks.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Shield className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">
                    Belum ada quick risk capture
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 px-4">
                    Mulai dengan menambahkan quick risk capture pertama untuk
                    project ini.
                  </p>
                  <div className="mt-4 sm:mt-6">
                    <Button onClick={addRiskItem} className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">
                        Tambah Quick Risk Capture Pertama
                      </span>
                      <span className="sm:hidden">
                        Tambah Quick Risk Capture
                      </span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {risks.map((risk, index) => (
                    <Card key={risk.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <h4 className="text-base sm:text-lg font-medium">
                            Quick Risk Capture #{index + 1}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRiskItem(risk.id)}
                              className="text-red-600 hover:text-red-700 p-1 sm:p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 p-3 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`kode-${risk.id}`}>Kode *</Label>
                            <Select
                              value={risk.kode}
                              onValueChange={(value) => {
                                updateRiskItem(risk.id, "kode", value);
                                // Auto-fill taksonomi based on selected kode
                                const selectedTaksonomi = taksonomiData.find(
                                  (item) => item.kode === value,
                                );
                                if (selectedTaksonomi) {
                                  updateRiskItem(
                                    risk.id,
                                    "taksonomi",
                                    selectedTaksonomi.taksonomi,
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
                            <Label htmlFor={`taksonomi-${risk.id}`}>
                              Taksonomi *
                            </Label>
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
                          <Label htmlFor={`sumberRisiko-${risk.id}`}>
                            Sumber Risiko *
                          </Label>
                          <Input
                            id={`sumberRisiko-${risk.id}`}
                            value={risk.sumberRisiko}
                            onChange={(e) =>
                              updateRiskItem(
                                risk.id,
                                "sumberRisiko",
                                e.target.value,
                              )
                            }
                            placeholder="Masukkan sumber risiko"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`peristiwaRisiko-${risk.id}`}>
                            Peristiwa Risiko *
                          </Label>
                          <Textarea
                            id={`peristiwaRisiko-${risk.id}`}
                            value={risk.peristiwaRisiko}
                            onChange={(e) =>
                              updateRiskItem(
                                risk.id,
                                "peristiwaRisiko",
                                e.target.value,
                              )
                            }
                            placeholder="Jelaskan peristiwa risiko yang mungkin terjadi"
                            className="min-h-20"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`dampakKualitatif-${risk.id}`}>
                              Dampak Kualitatif *
                            </Label>
                            <Textarea
                              id={`dampakKualitatif-${risk.id}`}
                              value={risk.dampakKualitatif}
                              onChange={(e) =>
                                updateRiskItem(
                                  risk.id,
                                  "dampakKualitatif",
                                  e.target.value,
                                )
                              }
                              placeholder="Jelaskan dampak kualitatif"
                              className="min-h-20"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`dampakKuantitatif-${risk.id}`}>
                              Dampak Kuantitatif *
                            </Label>
                            <Textarea
                              id={`dampakKuantitatif-${risk.id}`}
                              value={risk.dampakKuantitatif}
                              onChange={(e) =>
                                updateRiskItem(
                                  risk.id,
                                  "dampakKuantitatif",
                                  e.target.value,
                                )
                              }
                              placeholder="Jelaskan dampak kuantitatif (angka, nilai, dll)"
                              className="min-h-20"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`kontrolEksisting-${risk.id}`}>
                            Kontrol Eksisting *
                          </Label>
                          <Textarea
                            id={`kontrolEksisting-${risk.id}`}
                            value={risk.kontrolEksisting}
                            onChange={(e) =>
                              updateRiskItem(
                                risk.id,
                                "kontrolEksisting",
                                e.target.value,
                              )
                            }
                            placeholder="Jelaskan kontrol yang sudah ada"
                            className="min-h-20"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={addRiskItem}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">
                        Tambah Quick Risk Capture Lainnya
                      </span>
                      <span className="sm:hidden">
                        Tambah Quick Risk Lainnya
                      </span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          {risks.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Total: {risks.length} Quick Risk Capture telah dibuat
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={risks.length === 0}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto order-1 sm:order-2"
            >
              <Save className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">
                Simpan Quick Risk Capture ({risks.length})
              </span>
              <span className="sm:hidden">Simpan ({risks.length})</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
