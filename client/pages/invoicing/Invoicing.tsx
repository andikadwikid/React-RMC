import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Receipt,
  Search,
  Plus,
  Eye,
  Calendar,
  DollarSign,
  Building2,
  User,
  Filter,
  Download,
  FileText,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { getAllProjects } from "@/utils/dataLoader";
import type { Project } from "@/types";

// Enhanced project type for invoicing
interface ProjectWithInvoicing extends Project {
  invoiceStatus: "not_created" | "draft" | "sent" | "paid" | "overdue";
  lastInvoiceDate?: string;
  totalInvoiced: number;
  outstandingAmount: number;
}

const INVOICE_STATUS_CONFIG = {
  not_created: {
    label: "Belum Dibuat",
    color: "bg-gray-100 text-gray-800",
  },
  draft: {
    label: "Draft",
    color: "bg-blue-100 text-blue-800",
  },
  sent: {
    label: "Terkirim",
    color: "bg-yellow-100 text-yellow-800",
  },
  paid: {
    label: "Lunas",
    color: "bg-green-100 text-green-800",
  },
  overdue: {
    label: "Terlambat",
    color: "bg-red-100 text-red-800",
  },
};

export default function Invoicing() {
  const [projects, setProjects] = useState<ProjectWithInvoicing[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<
    ProjectWithInvoicing[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = () => {
      try {
        const projectsData = getAllProjects();

        // Enhance projects with invoicing data (in real app, this would come from API)
        const enhancedProjects: ProjectWithInvoicing[] = projectsData.map(
          (project) => ({
            ...project,
            invoiceStatus: ["not_created", "draft", "sent", "paid", "overdue"][
              Math.floor(Math.random() * 5)
            ] as any,
            lastInvoiceDate:
              Math.random() > 0.5
                ? new Date(
                    Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
                  ).toISOString()
                : undefined,
            totalInvoiced: Math.floor(
              (project.spent || 0) * (0.6 + Math.random() * 0.4),
            ),
            outstandingAmount: Math.floor(
              (project.budget || 0) * (Math.random() * 0.3),
            ),
          }),
        );

        setProjects(enhancedProjects);
        setFilteredProjects(enhancedProjects);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading projects:", error);
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (project) => project.invoiceStatus === statusFilter,
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, statusFilter, projects]);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const summary = {
    totalProjects: projects.length,
    totalInvoiced: projects.reduce((sum, p) => sum + p.totalInvoiced, 0),
    totalOutstanding: projects.reduce((sum, p) => sum + p.outstandingAmount, 0),
    pendingInvoices: projects.filter((p) =>
      ["not_created", "draft"].includes(p.invoiceStatus),
    ).length,
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading invoicing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Receipt className="h-8 w-8 text-blue-600" />
            Invoicing Management
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola invoice dan pembayaran untuk semua project
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Link to="/invoicing/bulk-create">
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              Bulk Create Invoices
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Projects
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.totalProjects}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Invoiced
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.totalInvoiced)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(summary.totalOutstanding)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Invoices
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {summary.pendingInvoices}
                </p>
              </div>
              <FileText className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects, clients, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not_created">Belum Dibuat</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Terkirim</SelectItem>
                  <SelectItem value="paid">Lunas</SelectItem>
                  <SelectItem value="overdue">Terlambat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projects & Invoicing Status</CardTitle>
          <p className="text-sm text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Invoiced</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Invoice Status</TableHead>
                  <TableHead>Last Invoice</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {project.category}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{project.client}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span
                          className={`text-sm font-medium ${getProgressColor(project.progress)}`}
                        >
                          {project.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(project.budget)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrency(project.totalInvoiced)}
                    </TableCell>
                    <TableCell className="font-medium text-yellow-600">
                      {formatCurrency(project.outstandingAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          INVOICE_STATUS_CONFIG[project.invoiceStatus].color
                        }
                      >
                        {INVOICE_STATUS_CONFIG[project.invoiceStatus].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {project.lastInvoiceDate ? (
                        <span className="text-sm text-gray-600">
                          {new Date(project.lastInvoiceDate).toLocaleDateString(
                            "id-ID",
                          )}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/projects/${project.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/invoicing/create/${project.id}`}>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Receipt className="w-4 h-4 mr-1" />
                            Create Invoice
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
