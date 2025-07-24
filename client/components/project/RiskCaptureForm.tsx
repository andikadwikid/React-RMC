import { useState } from "react";
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

const isValidRange = (value: number) => {
  return value >= 1 && value <= 25;
};

export function RiskCaptureForm({
  isOpen,
  onClose,
  projectId,
  projectName,
  onSave,
}: RiskCaptureFormProps) {
  const [risks, setRisks] = useState<RiskItem[]>(() => {
    const existingRiskCapture = getProjectRiskCapture(projectId);
    return existingRiskCapture ? existingRiskCapture.risks : [];
  });

  const addRiskItem = () => {
    const newRisk: RiskItem = {
      id: Date.now().toString(),
      sasaran: "",
      kode: "",
      taksonomi: "",
      peristiwaRisiko: "",
      sumberRisiko: "",
      dampakKualitatif: "",
      dampakKuantitatif: "",
      kontrolEksisting: "",
      risikoAwal: {
        kejadian: 1,
        dampak: 1,
        level: 1,
      },
      resikoAkhir: {
        kejadian: 1,
        dampak: 1,
        level: 1,
      },
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
      riskLevelDistribution: {
        sangatRendah: risks.filter(
          (r) => r.risikoAwal.level >= 1 && r.risikoAwal.level <= 5,
        ).length,
        rendah: risks.filter(
          (r) => r.risikoAwal.level >= 6 && r.risikoAwal.level <= 10,
        ).length,
        sedang: risks.filter(
          (r) => r.risikoAwal.level >= 11 && r.risikoAwal.level <= 15,
        ).length,
        tinggi: risks.filter(
          (r) => r.risikoAwal.level >= 16 && r.risikoAwal.level <= 20,
        ).length,
        sangatTinggi: risks.filter(
          (r) => r.risikoAwal.level >= 21 && r.risikoAwal.level <= 25,
        ).length,
      },
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
              Risk Capture Assessment - {projectName}
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
                    <span>Daftar Risk Capture</span>
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Tambahkan dan kelola risk capture untuk project ini
                  </p>
                </div>
                <Badge variant="outline" className="text-blue-600 self-start">
                  {risks.length} Risk{risks.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {risks.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Shield className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">
                    Belum ada risk capture
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 px-4">
                    Mulai dengan menambahkan risk capture pertama untuk project
                    ini.
                  </p>
                  <div className="mt-4 sm:mt-6">
                    <Button onClick={addRiskItem} className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Tambah Risk Capture Pertama</span>
                      <span className="sm:hidden">Tambah Risk Capture</span>
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
                            Risk Capture #{index + 1}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                            {isValidRange(risk.risikoAwal.kejadian) && (
                              <Badge
                                className={`${getRiskColor(
                                  risk.risikoAwal.kejadian,
                                )} text-xs`}
                                size="sm"
                              >
                                <span className="hidden sm:inline">
                                  Kejadian {risk.risikoAwal.kejadian} -{" "}
                                  {getRiskLabel(risk.risikoAwal.kejadian)}
                                </span>
                                <span className="sm:hidden">
                                  K{risk.risikoAwal.kejadian}
                                </span>
                              </Badge>
                            )}
                            {isValidRange(risk.risikoAwal.dampak) && (
                              <Badge
                                className={`${getRiskColor(risk.risikoAwal.dampak)} text-xs`}
                                size="sm"
                              >
                                <span className="hidden sm:inline">
                                  Dampak {risk.risikoAwal.dampak} -{" "}
                                  {getRiskLabel(risk.risikoAwal.dampak)}
                                </span>
                                <span className="sm:hidden">
                                  D{risk.risikoAwal.dampak}
                                </span>
                              </Badge>
                            )}
                            {isValidRange(risk.risikoAwal.level) && (
                              <Badge
                                className={`${getRiskColor(risk.risikoAwal.level)} text-xs`}
                                size="sm"
                              >
                                <span className="hidden sm:inline">
                                  Level {risk.risikoAwal.level} -{" "}
                                  {getRiskLabel(risk.risikoAwal.level)}
                                </span>
                                <span className="sm:hidden">
                                  L{risk.risikoAwal.level}
                                </span>
                              </Badge>
                            )}
                            {/* {isValidRange(risk.resikoAkhir.kejadian) && (
                              <Badge
                                className={getRiskColor(
                                  risk.resikoAkhir.kejadian,
                                )}
                                size="sm"
                                variant="secondary"
                              >
                                Final K{risk.resikoAkhir.kejadian} -{" "}
                                {getRiskLabel(risk.resikoAkhir.kejadian)}
                              </Badge>
                            )}
                            {isValidRange(risk.resikoAkhir.dampak) && (
                              <Badge
                                className={getRiskColor(
                                  risk.resikoAkhir.dampak,
                                )}
                                size="sm"
                                variant="secondary"
                              >
                                Final D{risk.resikoAkhir.dampak} -{" "}
                                {getRiskLabel(risk.resikoAkhir.dampak)}
                              </Badge>
                            )}
                            {isValidRange(risk.resikoAkhir.level) && (
                              <Badge
                                className={getRiskColor(risk.resikoAkhir.level)}
                                size="sm"
                                variant="secondary"
                              >
                                Final L{risk.resikoAkhir.level} -{" "}
                                {getRiskLabel(risk.resikoAkhir.level)}
                              </Badge>
                            )} */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRiskItem(risk.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`sasaran-${risk.id}`}>
                              Sasaran *
                            </Label>
                            <Input
                              id={`sasaran-${risk.id}`}
                              value={risk.sasaran}
                              onChange={(e) =>
                                updateRiskItem(
                                  risk.id,
                                  "sasaran",
                                  e.target.value,
                                )
                              }
                              placeholder="Masukkan sasaran"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`kode-${risk.id}`}>Kode *</Label>
                            <Input
                              id={`kode-${risk.id}`}
                              value={risk.kode}
                              onChange={(e) =>
                                updateRiskItem(risk.id, "kode", e.target.value)
                              }
                              placeholder="Masukkan kode"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`taksonomi-${risk.id}`}>
                              Taksonomi *
                            </Label>
                            <Input
                              id={`taksonomi-${risk.id}`}
                              value={risk.taksonomi}
                              onChange={(e) =>
                                updateRiskItem(
                                  risk.id,
                                  "taksonomi",
                                  e.target.value,
                                )
                              }
                              placeholder="Masukkan taksonomi"
                            />
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

                        <div className="grid grid-cols-2 gap-4">
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

                        <div className="border-t pt-4">
                          <h5 className="font-medium mb-3">Risiko Awal</h5>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor={`kejadian-${risk.id}`}>
                                Kejadian (1-25) *
                              </Label>
                              <Input
                                id={`kejadian-${risk.id}`}
                                type="number"
                                min={1}
                                max={25}
                                value={risk.risikoAwal.kejadian}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "") {
                                    updateRiskItem(
                                      risk.id,
                                      "risikoAwal.kejadian",
                                      1,
                                    );
                                  } else {
                                    const kejadian = parseInt(value);
                                    if (!isNaN(kejadian)) {
                                      updateRiskItem(
                                        risk.id,
                                        "risikoAwal.kejadian",
                                        kejadian,
                                      );
                                    }
                                  }
                                }}
                                placeholder="1-25"
                                className={
                                  !isValidRange(risk.risikoAwal.kejadian)
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              {!isValidRange(risk.risikoAwal.kejadian) && (
                                <p className="text-sm text-red-600 mt-1">
                                  Kejadian harus antara 1-25
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`dampak-${risk.id}`}>
                                Dampak (1-25) *
                              </Label>
                              <Input
                                id={`dampak-${risk.id}`}
                                type="number"
                                min={1}
                                max={25}
                                value={risk.risikoAwal.dampak}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "") {
                                    updateRiskItem(
                                      risk.id,
                                      "risikoAwal.dampak",
                                      1,
                                    );
                                  } else {
                                    const dampak = parseInt(value);
                                    if (!isNaN(dampak)) {
                                      updateRiskItem(
                                        risk.id,
                                        "risikoAwal.dampak",
                                        dampak,
                                      );
                                    }
                                  }
                                }}
                                placeholder="1-25"
                                className={
                                  !isValidRange(risk.risikoAwal.dampak)
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              {!isValidRange(risk.risikoAwal.dampak) && (
                                <p className="text-sm text-red-600 mt-1">
                                  Dampak harus antara 1-25
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`level-${risk.id}`}>
                                Level (1-25) *
                              </Label>
                              <Input
                                id={`level-${risk.id}`}
                                type="number"
                                min={1}
                                max={25}
                                value={risk.risikoAwal.level}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "") {
                                    updateRiskItem(
                                      risk.id,
                                      "risikoAwal.level",
                                      1,
                                    );
                                  } else {
                                    const level = parseInt(value);
                                    if (!isNaN(level)) {
                                      updateRiskItem(
                                        risk.id,
                                        "risikoAwal.level",
                                        level,
                                      );
                                    }
                                  }
                                }}
                                placeholder="1-25"
                                className={
                                  !isValidRange(risk.risikoAwal.level)
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              {!isValidRange(risk.risikoAwal.level) && (
                                <p className="text-sm text-red-600 mt-1">
                                  Level harus antara 1-25
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h5 className="font-medium mb-3">Resiko Akhir</h5>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor={`final-kejadian-${risk.id}`}>
                                Kejadian (1-25) *
                              </Label>
                              <Input
                                id={`final-kejadian-${risk.id}`}
                                type="number"
                                min={1}
                                max={25}
                                value={risk.resikoAkhir.kejadian}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "") {
                                    updateRiskItem(
                                      risk.id,
                                      "resikoAkhir.kejadian",
                                      1,
                                    );
                                  } else {
                                    const kejadian = parseInt(value);
                                    if (!isNaN(kejadian)) {
                                      updateRiskItem(
                                        risk.id,
                                        "resikoAkhir.kejadian",
                                        kejadian,
                                      );
                                    }
                                  }
                                }}
                                placeholder="1-25"
                                className={
                                  !isValidRange(risk.resikoAkhir.kejadian)
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              {!isValidRange(risk.resikoAkhir.kejadian) && (
                                <p className="text-sm text-red-600 mt-1">
                                  Kejadian harus antara 1-25
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`final-dampak-${risk.id}`}>
                                Dampak (1-25) *
                              </Label>
                              <Input
                                id={`final-dampak-${risk.id}`}
                                type="number"
                                min={1}
                                max={25}
                                value={risk.resikoAkhir.dampak}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "") {
                                    updateRiskItem(
                                      risk.id,
                                      "resikoAkhir.dampak",
                                      1,
                                    );
                                  } else {
                                    const dampak = parseInt(value);
                                    if (!isNaN(dampak)) {
                                      updateRiskItem(
                                        risk.id,
                                        "resikoAkhir.dampak",
                                        dampak,
                                      );
                                    }
                                  }
                                }}
                                placeholder="1-25"
                                className={
                                  !isValidRange(risk.resikoAkhir.dampak)
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              {!isValidRange(risk.resikoAkhir.dampak) && (
                                <p className="text-sm text-red-600 mt-1">
                                  Dampak harus antara 1-25
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`final-level-${risk.id}`}>
                                Level (1-25) *
                              </Label>
                              <Input
                                id={`final-level-${risk.id}`}
                                type="number"
                                min={1}
                                max={25}
                                value={risk.resikoAkhir.level}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "") {
                                    updateRiskItem(
                                      risk.id,
                                      "resikoAkhir.level",
                                      1,
                                    );
                                  } else {
                                    const level = parseInt(value);
                                    if (!isNaN(level)) {
                                      updateRiskItem(
                                        risk.id,
                                        "resikoAkhir.level",
                                        level,
                                      );
                                    }
                                  }
                                }}
                                placeholder="1-25"
                                className={
                                  !isValidRange(risk.resikoAkhir.level)
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              {!isValidRange(risk.resikoAkhir.level) && (
                                <p className="text-sm text-red-600 mt-1">
                                  Level harus antara 1-25
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="flex justify-center">
                    <Button variant="outline" onClick={addRiskItem}>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Risk Capture Lainnya
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          {risks.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-800">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">
                      Total: {risks.length} Risk Capture
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      Sangat Rendah (1-5):{" "}
                      {
                        risks.filter(
                          (r) =>
                            r.risikoAwal.level >= 1 && r.risikoAwal.level <= 5,
                        ).length
                      }
                    </div>
                    <div>
                      Rendah (6-10):{" "}
                      {
                        risks.filter(
                          (r) =>
                            r.risikoAwal.level >= 6 && r.risikoAwal.level <= 10,
                        ).length
                      }
                    </div>
                    <div>
                      Sedang (11-15):{" "}
                      {
                        risks.filter(
                          (r) =>
                            r.risikoAwal.level >= 11 &&
                            r.risikoAwal.level <= 15,
                        ).length
                      }
                    </div>
                    <div>
                      Tinggi (16-20):{" "}
                      {
                        risks.filter(
                          (r) =>
                            r.risikoAwal.level >= 16 &&
                            r.risikoAwal.level <= 20,
                        ).length
                      }
                    </div>
                    <div>
                      Sangat Tinggi (21-25):{" "}
                      {
                        risks.filter(
                          (r) =>
                            r.risikoAwal.level >= 21 &&
                            r.risikoAwal.level <= 25,
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={risks.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan Risk Capture ({risks.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
