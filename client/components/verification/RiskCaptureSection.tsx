import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Shield,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import type { RiskItem } from "@/types";
import { loadTaksonomiData } from "@/utils/dataLoader";

interface RiskCaptureSectionProps {
  readinessItemId: string;
  readinessItemTitle: string;
  riskCapture: RiskItem[];
  onRiskCaptureChange: (readinessItemId: string, risks: RiskItem[]) => void;
  disabled?: boolean;
}

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

export function RiskCaptureSection({
  readinessItemId,
  readinessItemTitle,
  riskCapture,
  onRiskCaptureChange,
  disabled = false,
}: RiskCaptureSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const taksonomiData = loadTaksonomiData();

  const addRiskItem = () => {
    const newRisk: RiskItem = {
      id: `risk-${readinessItemId}-${Date.now()}`,
      sasaran: readinessItemTitle,
      kode: `${readinessItemId.toUpperCase()}-001`,
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
      createdAt: new Date().toISOString(),
    };
    onRiskCaptureChange(readinessItemId, [...riskCapture, newRisk]);
  };

  const removeRiskItem = (riskId: string) => {
    onRiskCaptureChange(
      readinessItemId,
      riskCapture.filter((risk) => risk.id !== riskId)
    );
  };

  const updateRiskItem = (
    riskId: string,
    field: keyof RiskItem | string,
    value: string | number
  ) => {
    const updatedRisks = riskCapture.map((risk) => {
      if (risk.id !== riskId) return risk;

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
    });

    onRiskCaptureChange(readinessItemId, updatedRisks);
  };

  const handleKodeSelection = (riskId: string, kode: string) => {
    const selectedTaksonomi = taksonomiData.taksonomi.find(t => t.kode === kode);
    const updatedRisks = riskCapture.map((risk) => {
      if (risk.id !== riskId) return risk;

      return {
        ...risk,
        kode: kode,
        taksonomi: selectedTaksonomi ? selectedTaksonomi.taksonomi : "",
      };
    });

    onRiskCaptureChange(readinessItemId, updatedRisks);
  };

  const totalRisks = riskCapture.length;
  const riskSummary = {
    sangatRendah: riskCapture.filter(
      (r) => r.risikoAwal.level >= 1 && r.risikoAwal.level <= 5
    ).length,
    rendah: riskCapture.filter(
      (r) => r.risikoAwal.level >= 6 && r.risikoAwal.level <= 10
    ).length,
    sedang: riskCapture.filter(
      (r) => r.risikoAwal.level >= 11 && r.risikoAwal.level <= 15
    ).length,
    tinggi: riskCapture.filter(
      (r) => r.risikoAwal.level >= 16 && r.risikoAwal.level <= 20
    ).length,
    sangatTinggi: riskCapture.filter(
      (r) => r.risikoAwal.level >= 21 && r.risikoAwal.level <= 25
    ).length,
  };

  return (
    <div className="mt-4 border border-blue-200 rounded-lg bg-blue-50/30">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-3 hover:bg-blue-50 cursor-pointer rounded-t-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">
                Risk Capture Assessment
              </span>
              {totalRisks > 0 && (
                <Badge variant="outline" className="text-blue-700">
                  {totalRisks} Risk{totalRisks !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {totalRisks > 0 && (
                <div className="flex gap-1">
                  {riskSummary.sangatTinggi > 0 && (
                    <Badge className="bg-red-200 text-red-900 text-xs">
                      ST: {riskSummary.sangatTinggi}
                    </Badge>
                  )}
                  {riskSummary.tinggi > 0 && (
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      T: {riskSummary.tinggi}
                    </Badge>
                  )}
                  {riskSummary.sedang > 0 && (
                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                      S: {riskSummary.sedang}
                    </Badge>
                  )}
                  {riskSummary.rendah > 0 && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      R: {riskSummary.rendah}
                    </Badge>
                  )}
                  {riskSummary.sangatRendah > 0 && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      SR: {riskSummary.sangatRendah}
                    </Badge>
                  )}
                </div>
              )}
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-blue-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-blue-600" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-3 pt-0">
            {totalRisks === 0 ? (
              <div className="text-center py-4">
                <AlertTriangle className="mx-auto h-8 w-8 text-gray-400" />
                <h4 className="mt-2 text-sm font-medium text-gray-900">
                  Belum ada risk capture
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  Tambahkan risk capture untuk readiness item ini
                </p>
                <div className="mt-3">
                  <Button
                    onClick={addRiskItem}
                    size="sm"
                    disabled={disabled}
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Tambah Risk Capture
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {riskCapture.map((risk, index) => (
                  <Card key={risk.id} className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm">
                          Risk #{index + 1}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          {isValidRange(risk.risikoAwal.level) && (
                            <Badge
                              className={`${getRiskColor(
                                risk.risikoAwal.level
                              )} text-xs`}
                              size="sm"
                            >
                              Level {risk.risikoAwal.level} -{" "}
                              {getRiskLabel(risk.risikoAwal.level)}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRiskItem(risk.id)}
                            disabled={disabled}
                            className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 p-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Kode</Label>
                          <Input
                            value={risk.kode}
                            onChange={(e) =>
                              updateRiskItem(risk.id, "kode", e.target.value)
                            }
                            placeholder="Kode risk"
                            className="h-8 text-xs"
                            disabled={disabled}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Taksonomi</Label>
                          <Input
                            value={risk.taksonomi}
                            onChange={(e) =>
                              updateRiskItem(risk.id, "taksonomi", e.target.value)
                            }
                            placeholder="Taksonomi"
                            className="h-8 text-xs"
                            disabled={disabled}
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Peristiwa Risiko</Label>
                        <Textarea
                          value={risk.peristiwaRisiko}
                          onChange={(e) =>
                            updateRiskItem(
                              risk.id,
                              "peristiwaRisiko",
                              e.target.value
                            )
                          }
                          placeholder="Jelaskan peristiwa risiko yang mungkin terjadi"
                          className="min-h-16 text-xs"
                          disabled={disabled}
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Sumber Risiko</Label>
                        <Input
                          value={risk.sumberRisiko}
                          onChange={(e) =>
                            updateRiskItem(
                              risk.id,
                              "sumberRisiko",
                              e.target.value
                            )
                          }
                          placeholder="Sumber risiko"
                          className="h-8 text-xs"
                          disabled={disabled}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Dampak Kualitatif</Label>
                          <Textarea
                            value={risk.dampakKualitatif}
                            onChange={(e) =>
                              updateRiskItem(
                                risk.id,
                                "dampakKualitatif",
                                e.target.value
                              )
                            }
                            placeholder="Dampak kualitatif"
                            className="min-h-16 text-xs"
                            disabled={disabled}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Dampak Kuantitatif</Label>
                          <Textarea
                            value={risk.dampakKuantitatif}
                            onChange={(e) =>
                              updateRiskItem(
                                risk.id,
                                "dampakKuantitatif",
                                e.target.value
                              )
                            }
                            placeholder="Dampak kuantitatif"
                            className="min-h-16 text-xs"
                            disabled={disabled}
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Kontrol Eksisting</Label>
                        <Textarea
                          value={risk.kontrolEksisting}
                          onChange={(e) =>
                            updateRiskItem(
                              risk.id,
                              "kontrolEksisting",
                              e.target.value
                            )
                          }
                          placeholder="Kontrol yang sudah ada"
                          className="min-h-16 text-xs"
                          disabled={disabled}
                        />
                      </div>

                      <div className="border-t pt-3">
                        <Label className="text-xs font-medium">
                          Risiko Awal
                        </Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div>
                            <Label className="text-xs text-gray-600">
                              Kejadian (1-25)
                            </Label>
                            <Input
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
                                    1
                                  );
                                } else {
                                  const kejadian = parseInt(value);
                                  if (!isNaN(kejadian)) {
                                    updateRiskItem(
                                      risk.id,
                                      "risikoAwal.kejadian",
                                      kejadian
                                    );
                                  }
                                }
                              }}
                              className={`h-7 text-xs ${
                                !isValidRange(risk.risikoAwal.kejadian)
                                  ? "border-red-500"
                                  : ""
                              }`}
                              disabled={disabled}
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">
                              Dampak (1-25)
                            </Label>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={risk.risikoAwal.dampak}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  updateRiskItem(risk.id, "risikoAwal.dampak", 1);
                                } else {
                                  const dampak = parseInt(value);
                                  if (!isNaN(dampak)) {
                                    updateRiskItem(
                                      risk.id,
                                      "risikoAwal.dampak",
                                      dampak
                                    );
                                  }
                                }
                              }}
                              className={`h-7 text-xs ${
                                !isValidRange(risk.risikoAwal.dampak)
                                  ? "border-red-500"
                                  : ""
                              }`}
                              disabled={disabled}
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">
                              Level (1-25)
                            </Label>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={risk.risikoAwal.level}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  updateRiskItem(risk.id, "risikoAwal.level", 1);
                                } else {
                                  const level = parseInt(value);
                                  if (!isNaN(level)) {
                                    updateRiskItem(
                                      risk.id,
                                      "risikoAwal.level",
                                      level
                                    );
                                  }
                                }
                              }}
                              className={`h-7 text-xs ${
                                !isValidRange(risk.risikoAwal.level)
                                  ? "border-red-500"
                                  : ""
                              }`}
                              disabled={disabled}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <Label className="text-xs font-medium">
                          Resiko Akhir
                        </Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div>
                            <Label className="text-xs text-gray-600">
                              Kejadian (1-25)
                            </Label>
                            <Input
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
                                    1
                                  );
                                } else {
                                  const kejadian = parseInt(value);
                                  if (!isNaN(kejadian)) {
                                    updateRiskItem(
                                      risk.id,
                                      "resikoAkhir.kejadian",
                                      kejadian
                                    );
                                  }
                                }
                              }}
                              className={`h-7 text-xs ${
                                !isValidRange(risk.resikoAkhir.kejadian)
                                  ? "border-red-500"
                                  : ""
                              }`}
                              disabled={disabled}
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">
                              Dampak (1-25)
                            </Label>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={risk.resikoAkhir.dampak}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  updateRiskItem(risk.id, "resikoAkhir.dampak", 1);
                                } else {
                                  const dampak = parseInt(value);
                                  if (!isNaN(dampak)) {
                                    updateRiskItem(
                                      risk.id,
                                      "resikoAkhir.dampak",
                                      dampak
                                    );
                                  }
                                }
                              }}
                              className={`h-7 text-xs ${
                                !isValidRange(risk.resikoAkhir.dampak)
                                  ? "border-red-500"
                                  : ""
                              }`}
                              disabled={disabled}
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">
                              Level (1-25)
                            </Label>
                            <Input
                              type="number"
                              min={1}
                              max={25}
                              value={risk.resikoAkhir.level}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  updateRiskItem(risk.id, "resikoAkhir.level", 1);
                                } else {
                                  const level = parseInt(value);
                                  if (!isNaN(level)) {
                                    updateRiskItem(
                                      risk.id,
                                      "resikoAkhir.level",
                                      level
                                    );
                                  }
                                }
                              }}
                              className={`h-7 text-xs ${
                                !isValidRange(risk.resikoAkhir.level)
                                  ? "border-red-500"
                                  : ""
                              }`}
                              disabled={disabled}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addRiskItem}
                    disabled={disabled}
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Tambah Risk Capture Lainnya
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
