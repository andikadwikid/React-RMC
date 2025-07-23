import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, TrendingUp } from "lucide-react";
import {
  InvoiceStatus,
  InvoiceStatusDataPeriod,
  AgingReceivable,
  availableInvoiceStatusPeriods,
} from "@/hooks/useDashboardData";
import { PeriodSelector } from "./PeriodSelector";
import { FallbackMessage } from "./FallbackMessage";
import { InsightCardsGrid } from "./InsightCards";
import { getFinancialInsights } from "@/hooks/useDashboardCalculations";

interface InvoiceStatusSectionProps {
  selectedPeriod: InvoiceStatusDataPeriod;
  invoiceStatus: InvoiceStatus;
  agingReceivables: AgingReceivable[];
  onPeriodChange: (period: InvoiceStatusDataPeriod) => void;
  autoSelected: boolean;
}

export function InvoiceStatusSection({
  selectedPeriod,
  invoiceStatus,
  agingReceivables,
  onPeriodChange,
  autoSelected,
}: InvoiceStatusSectionProps) {
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
      title: "Total Invoice",
      value: insights.totalInvoices,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    },
    {
      title: "Paid Rate",
      value: `${insights.paidPercentage}%`,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    {
      title: "Overdue",
      value: `${insights.overduePercentage}%`,
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
              <div className="flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-green-500" />
                <CardTitle className="flex items-center gap-2">
                  <span>Status Pendapatan & Invoice</span>
                </CardTitle>
              </div>
            </div>
            <div className="flex my-3">
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
            periods={availableInvoiceStatusPeriods}
            selectedPeriod={selectedPeriod}
            onPeriodChange={onPeriodChange}
            className="mb-3 md:mb-0"
          />
        </div>

        <FallbackMessage
          title="Menampilkan Data Invoice Triwulan"
          description={`Data invoice tahun ${new Date().getFullYear()} belum lengkap, menampilkan data triwulan terakhir.`}
          show={shouldShowFallbackMessage()}
        />

        <InsightCardsGrid
          insights={insightCardsData}
          className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3"
        />
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-medium text-red-800">
                  Selesai, Belum Ada Invoice
                </p>
                <p className="text-sm text-red-600">
                  Proyek completed tanpa invoice
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-red-700">
              {invoiceStatus.completed_no_invoice}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium text-yellow-800">
                  Invoice Issued, Belum Dibayar
                </p>
                <p className="text-sm text-yellow-600">Menunggu pembayaran</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-yellow-700">
              {invoiceStatus.issued_unpaid}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-800">
                  Invoice Sudah Dibayar
                </p>
                <p className="text-sm text-green-600">Pembayaran completed</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-green-700">
              {invoiceStatus.paid}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
