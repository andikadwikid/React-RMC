import React, { memo } from "react";
import { Badge } from "@/components/ui/badge";
import type { RiskItem } from "@/types";
import { getRiskLevelBadge } from "@/constants/riskCapture";

interface RiskItemDetailProps {
  risk: RiskItem;
}

const RiskItemDetail = memo(({ risk }: RiskItemDetailProps) => {
  const riskBadge = getRiskLevelBadge(risk.risikoSaatIni.level);

  return (
    <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h4 className="font-medium text-gray-900">{risk.peristiwaRisiko}</h4>
          <p className="text-sm text-gray-600">
            {risk.kode} - {risk.taksonomi}
          </p>
        </div>
        <Badge className={riskBadge.color}>
          {riskBadge.label} ({riskBadge.level})
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">Sumber Risiko:</span>
          <p className="text-gray-900 mt-1">{risk.sumberRisiko}</p>
        </div>
        <div>
          <span className="font-medium text-gray-700">Dampak Kualitatif:</span>
          <p className="text-gray-900 mt-1">{risk.dampakKualitatif}</p>
        </div>
        <div>
          <span className="font-medium text-gray-700">Dampak Kuantitatif:</span>
          <p className="text-gray-900 mt-1">{risk.dampakKuantitatif}</p>
        </div>
        <div>
          <span className="font-medium text-gray-700">Kontrol Eksisting:</span>
          <p className="text-gray-900 mt-1">{risk.kontrolEksisting}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-red-50 border border-red-200 rounded">
          <span className="font-medium text-red-700">Risiko Awal:</span>
          <p className="text-red-900">
            Kejadian: {risk.risikoAwal.kejadian}, Dampak:{" "}
            {risk.risikoAwal.dampak}
          </p>
          <p className="text-red-900 font-semibold">
            Level: {risk.risikoAwal.level}
          </p>
        </div>
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <span className="font-medium text-yellow-700">Risiko Saat Ini:</span>
          <p className="text-yellow-900">
            Kejadian: {risk.risikoSaatIni.kejadian}, Dampak:{" "}
            {risk.risikoSaatIni.dampak}
          </p>
          <p className="text-yellow-900 font-semibold">
            Level: {risk.risikoSaatIni.level}
          </p>
        </div>
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <span className="font-medium text-green-700">Risiko Akhir:</span>
          <p className="text-green-900">
            Kejadian: {risk.resikoAkhir.kejadian}, Dampak:{" "}
            {risk.resikoAkhir.dampak}
          </p>
          <p className="text-green-900 font-semibold">
            Level: {risk.resikoAkhir.level}
          </p>
        </div>
      </div>

      {risk.verifierComment && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <span className="font-medium text-blue-700">Komentar Verifier:</span>
          <p className="text-blue-900 mt-1">{risk.verifierComment}</p>
          {risk.verifierName && (
            <p className="text-blue-600 text-sm mt-1">— {risk.verifierName}</p>
          )}
        </div>
      )}
    </div>
  );
});

RiskItemDetail.displayName = "RiskItemDetail";

export default RiskItemDetail;
