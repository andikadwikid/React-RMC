import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProjectDistributionChart from "@/components/ProjectDistributionChart";
import { RiskCategoryDetailDialog } from "@/components/dashboard/RiskCategoryDetailDialog";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Building,
  Shield,
  Gavel,
  Cpu,
  Leaf,
  Target,
  FileText,
  Calendar,
} from "lucide-react";

interface ProjectSummary {
  total: number;
  running: number;
  completed: number;
}

interface RiskCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  total: number;
  overdue: number;
  inProcess: number;
  closed: number;
}

interface InvoiceStatus {
  completed_no_invoice: number;
  issued_unpaid: number;
  paid: number;
}

interface AgingReceivable {
  category: string;
  amount: number;
  color: "green" | "yellow" | "red";
  days: string;
}

interface ProvinceData {
  name: string;
  value: number;
  projects: string[];
}

export default function Index() {
  const [projectSummary] = useState<ProjectSummary>({
    total: 45,
    running: 28,
    completed: 17,
  });

  const [riskCategories] = useState<RiskCategory[]>([
    {
      id: "strategic",
      name: "Strategis",
      icon: Target,
      total: 12,
      overdue: 3,
      inProcess: 6,
      closed: 3,
    },
    {
      id: "operational",
      name: "Operasional",
      icon: Building,
      total: 18,
      overdue: 5,
      inProcess: 8,
      closed: 5,
    },
    {
      id: "financial",
      name: "Keuangan",
      icon: DollarSign,
      total: 8,
      overdue: 2,
      inProcess: 4,
      closed: 2,
    },
    {
      id: "compliance",
      name: "Kepatuhan",
      icon: Gavel,
      total: 6,
      overdue: 1,
      inProcess: 3,
      closed: 2,
    },
    {
      id: "project",
      name: "Proyek",
      icon: FileText,
      total: 22,
      overdue: 7,
      inProcess: 10,
      closed: 5,
    },
    {
      id: "environment",
      name: "Lingkungan & Sosial",
      icon: Leaf,
      total: 4,
      overdue: 1,
      inProcess: 2,
      closed: 1,
    },
    {
      id: "it",
      name: "Teknologi Informasi",
      icon: Cpu,
      total: 9,
      overdue: 2,
      inProcess: 5,
      closed: 2,
    },
    {
      id: "hr",
      name: "Sumber Daya Manusia",
      icon: Users,
      total: 7,
      overdue: 1,
      inProcess: 4,
      closed: 2,
    },
  ]);

  const [invoiceStatus] = useState<InvoiceStatus>({
    completed_no_invoice: 5,
    issued_unpaid: 12,
    paid: 28,
  });

  const [agingReceivables] = useState<AgingReceivable[]>([
    { category: "0-30 hari", amount: 2500000000, color: "green", days: "0-30" },
    {
      category: "31-90 hari",
      amount: 1800000000,
      color: "yellow",
      days: "31-90",
    },
    { category: ">90 hari", amount: 650000000, color: "red", days: ">90" },
  ]);

  // Dialog state for risk category details
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<RiskCategory | null>(null);
  const [isRiskDialogOpen, setIsRiskDialogOpen] = useState(false);

  const [provinceData] = useState<ProvinceData[]>([
    {
      name: "DKI Jakarta",
      value: 12,
      projects: [
        "ERP System Bank Central",
        "Mobile Banking App",
        "E-Government Portal",
        "Smart City Dashboard",
        "Fintech Integration",
      ],
    },
    {
      name: "Jawa Barat",
      value: 8,
      projects: [
        "Manufacturing ERP",
        "Supply Chain Management",
        "Hospital Information System",
        "E-Commerce Platform",
      ],
    },
    {
      name: "Jawa Tengah",
      value: 6,
      projects: [
        "Agricultural Management System",
        "Tourism Portal",
        "Educational Platform",
      ],
    },
    {
      name: "Jawa Timur",
      value: 7,
      projects: [
        "Port Management System",
        "Logistics Platform",
        "Industrial IoT",
        "Smart Factory",
      ],
    },
    {
      name: "Sumatera Utara",
      value: 4,
      projects: ["Palm Oil Tracking", "Mining Management System"],
    },
    {
      name: "Sumatera Barat",
      value: 3,
      projects: ["Tourism Management", "Cultural Heritage Portal"],
    },
    {
      name: "Kalimantan Timur",
      value: 2,
      projects: ["Coal Mining System"],
    },
    {
      name: "Sulawesi Selatan",
      value: 2,
      projects: ["Fisheries Management"],
    },
    {
      name: "Bali",
      value: 1,
      projects: ["Resort Management System"],
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: "overdue" | "inProcess" | "closed") => {
    switch (status) {
      case "overdue":
        return "bg-red-500";
      case "inProcess":
        return "bg-yellow-500";
      case "closed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAgingColor = (color: "green" | "yellow" | "red") => {
    switch (color) {
      case "green":
        return "text-green-600 bg-green-50 border-green-200";
      case "yellow":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "red":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Handle risk category card click
  const handleRiskCategoryClick = (category: RiskCategory) => {
    setSelectedRiskCategory(category);
    setIsRiskDialogOpen(true);
  };

  const closeRiskDialog = () => {
    setIsRiskDialogOpen(false);
    setSelectedRiskCategory(null);
  };

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Management Risiko
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor dan kelola risiko proyek secara real-time
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
              <Badge variant="outline" className="px-3 py-1">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Proyek
                  </p>
                  <p className="text-3xl font-bold">{projectSummary.total}</p>
                </div>
                <BarChart3 className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Proyek Berjalan
                  </p>
                  <p className="text-3xl font-bold">{projectSummary.running}</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Proyek Selesai
                  </p>
                  <p className="text-3xl font-bold">
                    {projectSummary.completed}
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Status by RMC Categories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-500" />
              Status Risiko Proyek (Kategori RMC)
            </CardTitle>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Belum ditindaklanjuti &gt;14 hari</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Dalam proses mitigasi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Closed dengan bukti mitigasi</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {riskCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300 hover:bg-blue-50"
                    onClick={() => handleRiskCategoryClick(category)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <h3 className="font-medium text-sm">{category.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total:</span>
                        <span className="font-semibold">{category.total}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor("overdue")}`}
                            ></div>
                            <span className="text-xs">Overdue</span>
                          </div>
                          <span className="text-xs font-medium">
                            {category.overdue}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor("inProcess")}`}
                            ></div>
                            <span className="text-xs">In Process</span>
                          </div>
                          <span className="text-xs font-medium">
                            {category.inProcess}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor("closed")}`}
                            ></div>
                            <span className="text-xs">Closed</span>
                          </div>
                          <span className="text-xs font-medium">
                            {category.closed}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                  Distribusi Project per Provinsi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectDistributionChart data={provinceData} title="" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan Geografis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {provinceData
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5)
                    .map((province, index) => (
                      <div
                        key={province.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {province.name}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {province.value} project
                          {province.value !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    ))}
                </div>
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-2">
                      <span>Total Provinsi:</span>
                      <span className="font-semibold">
                        {provinceData.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rata-rata per Provinsi:</span>
                      <span className="font-semibold">
                        {Math.round(
                          provinceData.reduce((sum, p) => sum + p.value, 0) /
                            provinceData.length,
                        )}{" "}
                        projects
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue & Invoice Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-500" />
                Status Pendapatan & Invoice
              </CardTitle>
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
                      <p className="text-sm text-yellow-600">
                        Menunggu pembayaran
                      </p>
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
                      <p className="text-sm text-green-600">
                        Pembayaran completed
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-700">
                    {invoiceStatus.paid}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aging Receivables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-orange-500" />
                Aging Piutang Proyek
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Urutkan: Nilai Terbesar
                </Button>
                <Button variant="outline" size="sm">
                  Urutkan: Risiko Proyek
                </Button>
              </div>
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
                        <p className="text-sm opacity-75">
                          Outstanding piutang
                        </p>
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
                        agingReceivables.reduce(
                          (sum, item) => sum + item.amount,
                          0,
                        ),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Laporan Risiko</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <FileText className="h-6 w-6" />
                <span>Generate Invoice</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <BarChart3 className="h-6 w-6" />
                <span>Analytics</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
