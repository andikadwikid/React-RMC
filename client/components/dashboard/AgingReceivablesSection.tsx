import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, TrendingUp } from "lucide-react";
import { availableAgingReceivablesPeriods } from "@/hooks/useDashboardData";
import type { AgingReceivable, AgingReceivablesDataPeriod, InvoiceStatus } from "@/types";
import { PeriodSelector } from "./PeriodSelector";
import { FallbackMessage } from "./FallbackMessage";
import { InsightCardsGrid } from "./InsightCards";
import {
  getFinancialInsights,
  formatCurrency,
  formatCurrencyShort,
  getAgingColor,
} from "@/hooks/useDashboardCalculations";

// AgingReceivablesSectionProps extended from base types
interface AgingReceivablesSectionProps {
  selectedPeriod: AgingReceivablesDataPeriod;
  agingReceivables: AgingReceivable[];
  invoiceStatus: InvoiceStatus;
  onPeriodChange: (period: AgingReceivablesDataPeriod) => void;
  autoSelected: boolean;
}

export function AgingReceivablesSection({
  selectedPeriod,
  agingReceivables,
  invoiceStatus,
  onPeriodChange,
  autoSelected,
}: AgingReceivablesSectionProps) {
  const shouldShowFallbackMessage = () => {
    const currentYear = new Date().getFullYear().toString();
    return (
      autoSelected &&
      selectedPeriod.type === "quarterly" &&
      selectedPeriod.id.includes(currentYear)
    );
  };

  const insights = getFinancialInsights(invoiceStatus, agingReceivables);

  const insightCardsData = [
    {
      title: "Total Outstanding",
      value: formatCurrencyShort(insights.totalOutstanding),
      bgColor: "bg-gray-50",
      textColor: "text-gray-800",
    },
    {
      title: "31-90 Hari",
      value: formatCurrencyShort(
        agingReceivables.find((item) => item.days === "31-90")?.amount || 0,
      ),
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
    },
    {
      title: ">90 Hari",
      value: formatCurrencyShort(insights.overdueAmount),
      bgColor: "bg-red-50",
      textColor: "text-red-800",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="flex flex-col items-start gap-2">
            <div>
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-orange-500" />
                <CardTitle>
                  <span>Aging Piutang Proyek</span>
                </CardTitle>
              </div>
            </div>
            <div className="flex my-2">
              <p className="text-sm text-gray-600 mt-1">
                {selectedPeriod.label}
              </p>
              <Badge
                variant="secondary"
                className={`ml-2 ${
                  selectedPeriod.type === "yearly"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {selectedPeriod.type === "yearly" ? (
                  <>
                    <Calendar className="w-3 h-3 mr-1" />
                    Tahunan
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Triwulan
                  </>
                )}
              </Badge>
            </div>
          </div>

          <PeriodSelector
            periods={availableAgingReceivablesPeriods}
            selectedPeriod={selectedPeriod}
            onPeriodChange={onPeriodChange}
            className="mb-3"
          />
        </div>

        <FallbackMessage
          title="Menampilkan Data Piutang Triwulan"
          description={`Data aging piutang tahun ${new Date().getFullYear()} belum lengkap, menampilkan data triwulan terakhir.`}
          show={shouldShowFallbackMessage()}
        />

        <InsightCardsGrid
          insights={insightCardsData}
          className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3"
        />
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {agingReceivables.map((item, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${getAgingColor(item.color)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.category}</p>
                  <p className="text-sm opacity-75">Outstanding piutang</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {formatCurrency(item.amount)}
                  </p>
                  <p className="text-xs opacity-75">{item.days} hari</p>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">
                Total Outstanding:
              </span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(
                  agingReceivables.reduce((sum, item) => sum + item.amount, 0),
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
