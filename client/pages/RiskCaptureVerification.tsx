import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Search,
  Eye,
  CheckCircle,
  AlertTriangle,
  Shield,
  FileX,
  ChevronDown,
  ChevronRight,
  FileText,
  Database,
  Users,
  DollarSign,
  Cpu,
  Leaf,
  Target,
  Info,
  XCircle,
} from "lucide-react";
import type { RiskItem } from "@/types";
import { formatDateTime } from "@/utils/formatters";
import { 
  getReadinessTemplate,
  getAllProjects,
  getProjectReadinessItems 
} from "@/utils/dataLoader";

// Icon mapping
const iconMap = {
  FileText,
  Database,
  Users,
  DollarSign,
  Cpu,
  Leaf,
  Target,
};

// Category display names
const CATEGORY_DISPLAY_NAMES = {
  administrative: "Dokumen Administratif",
  "user-technical-data": "Data Teknis dari User",
  personnel: "Personel Proyek",
  "legal-financial": "Legal & Finansial",
  "system-equipment": "Kesiapan Sistem & Peralatan",
  "hsse-permits": "HSSE & Perizinan Lapangan",
  "deliverable-output": "Kesiapan Deliverable & Output",
};

interface ProjectRiskSummary {
  projectId: string;
  projectName: string;
  totalRisks: number;
  totalReadinessItems: number;
  itemsWithRisks: number;
  riskDistribution: {
    sangatRendah: number;
    rendah: number;
    sedang: number;
    tinggi: number;
    sangatTinggi: number;
  };
  highestRiskLevel: number;
  categoriesWithRisks: string[];
}

interface ProjectRiskDetail {
  projectId: string;
  projectName: string;
  readinessCategories: ReadinessCategoryWithRisks[];
  totalRisks: number;
  riskDistribution: {
    sangatRendah: number;
    rendah: number;
    sedang: number;
    tinggi: number;
    sangatTinggi: number;
  };
}

interface ReadinessCategoryWithRisks {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  items: ReadinessItemWithRisks[];
  totalRisks: number;
}

interface ReadinessItemWithRisks {
  id: string;
  title: string;
  risks: RiskItem[];
  hasRisks: boolean;
}

const RISK_LEVEL_CONFIG = {
  1: { label: "Sangat Rendah", color: "bg-green-100 text-green-800", range: "1-5" },
  2: { label: "Rendah", color: "bg-green-100 text-green-800", range: "6-10" },
  3: { label: "Sedang", color: "bg-yellow-100 text-yellow-800", range: "11-15" },
  4: { label: "Tinggi", color: "bg-orange-100 text-orange-800", range: "16-20" },
  5: { label: "Sangat Tinggi", color: "bg-red-100 text-red-800", range: "21-25" },
};

const getRiskLevel = (level: number): number => {
  if (level >= 1 && level <= 5) return 1;
  if (level >= 6 && level <= 10) return 2;
  if (level >= 11 && level <= 15) return 3;
  if (level >= 16 && level <= 20) return 4;
  if (level >= 21 && level <= 25) return 5;
  return 1;
};

const getRiskLevelBadge = (level: number) => {
  const riskLevel = getRiskLevel(level);
  const config = RISK_LEVEL_CONFIG[riskLevel as keyof typeof RISK_LEVEL_CONFIG];
  
  return (
    <Badge className={config.color}>
      {config.label} ({level})
    </Badge>
  );
};

const getRiskPriorityBadge = (highestLevel: number) => {
  if (highestLevel >= 16) {
    return <Badge className="bg-red-100 text-red-800">High Priority</Badge>;
  } else if (highestLevel >= 11) {
    return <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>;
  } else {
    return <Badge className="bg-green-100 text-green-800">Low Priority</Badge>;
  }
};

// Main data loading function for summary table
const loadProjectRiskSummary = (): ProjectRiskSummary[] => {
  try {
    const template = getReadinessTemplate();
    const projects = getAllProjects();
    
    const projectRiskSummaries: ProjectRiskSummary[] = [];

    projects.forEach((project) => {
      const readinessItems = getProjectReadinessItems(project.id);
      
      // Count all risks across all readiness items
      const allProjectRisks = readinessItems.flatMap(item => item.risk_capture || []);
      const itemsWithRisks = readinessItems.filter(item => item.risk_capture && item.risk_capture.length > 0);
      
      // Get categories that have risks
      const categoriesWithRisks = Array.from(new Set(
        readinessItems
          .filter(item => item.risk_capture && item.risk_capture.length > 0)
          .map(item => item.category)
      ));

      // Calculate risk distribution
      const riskDistribution = {
        sangatRendah: allProjectRisks.filter(r => getRiskLevel(r.risikoSaatIni.level) === 1).length,
        rendah: allProjectRisks.filter(r => getRiskLevel(r.risikoSaatIni.level) === 2).length,
        sedang: allProjectRisks.filter(r => getRiskLevel(r.risikoSaatIni.level) === 3).length,
        tinggi: allProjectRisks.filter(r => getRiskLevel(r.risikoSaatIni.level) === 4).length,
        sangatTinggi: allProjectRisks.filter(r => getRiskLevel(r.risikoSaatIni.level) === 5).length,
      };

      // Find highest risk level
      const highestRiskLevel = allProjectRisks.length > 0 
        ? Math.max(...allProjectRisks.map(r => r.risikoSaatIni.level))
        : 0;

      // Only include projects that have readiness data (even if no risks)
      if (readinessItems.length > 0) {
        projectRiskSummaries.push({
          projectId: project.id,
          projectName: project.name,
          totalRisks: allProjectRisks.length,
          totalReadinessItems: readinessItems.length,
          itemsWithRisks: itemsWithRisks.length,
          riskDistribution,
          highestRiskLevel,
          categoriesWithRisks,
        });
      }
    });

    return projectRiskSummaries;
  } catch (error) {
    console.error("Error loading project risk summary:", error);
    return [];
  }
};

// Load detailed project risk data for modal
const loadProjectRiskDetail = (projectId: string): ProjectRiskDetail | null => {
  try {
    const template = getReadinessTemplate();
    const projects = getAllProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return null;

    const readinessItems = getProjectReadinessItems(projectId);
    
    // Group readiness items by category
    const itemsByCategory = readinessItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    // Build categories with risks
    const readinessCategories: ReadinessCategoryWithRisks[] = template.categories.map((categoryTemplate) => {
      const categoryItems = itemsByCategory[categoryTemplate.id] || [];
      
      const itemsWithRisks: ReadinessItemWithRisks[] = categoryTemplate.items.map((itemTemplate) => {
        // Find actual readiness item
        const actualItem = categoryItems.find(item => item.item === itemTemplate.title);
        const risks = actualItem?.risk_capture || [];
        
        return {
          id: itemTemplate.id,
          title: itemTemplate.title,
          risks: risks,
          hasRisks: risks.length > 0,
        };
      });

      const totalCategoryRisks = itemsWithRisks.reduce((sum, item) => sum + item.risks.length, 0);

      return {
        id: categoryTemplate.id,
        title: categoryTemplate.title,
        icon: iconMap[categoryTemplate.icon as keyof typeof iconMap],
        items: itemsWithRisks,
        totalRisks: totalCategoryRisks,
      };
    });

    // Calculate total risks and distribution for project
    const allProjectRisks = readinessCategories.flatMap(cat => 
      cat.items.flatMap(item => item.risks)
    );

    const riskDistribution = {
      sangatRendah: allProjectRisks.filter(r => getRiskLevel(r.risikoSaatIni.level) === 1).length,
      rendah: allProjectRisks.filter(r => getRiskLevel(r.risikoSaatIni.level) === 2).length,
      sedang: allProjectRisks.filter(r => getRiskLevel(r.risikoSaatIni.level) === 3).length,
      tinggi: allProjectRisks.filter(r => getRiskLevel(r.risikoSaatIni.level) === 4).length,
      sangatTinggi: allProjectRisks.filter(r => getRiskLevel(r.risikoSaatIni.level) === 5).length,
    };

    return {
      projectId: project.id,
      projectName: project.name,
      readinessCategories,
      totalRisks: allProjectRisks.length,
      riskDistribution,
    };
  } catch (error) {
    console.error("Error loading project risk detail:", error);
    return null;
  }
};

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

// Risk Item Detail Component
interface RiskItemDetailProps {
  risk: RiskItem;
}

function RiskItemDetail({ risk }: RiskItemDetailProps) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h4 className="font-medium text-gray-900">{risk.peristiwaRisiko}</h4>
          <p className="text-sm text-gray-600">{risk.kode} - {risk.taksonomi}</p>
        </div>
        {getRiskLevelBadge(risk.risikoSaatIni.level)}
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
            Kejadian: {risk.risikoAwal.kejadian}, Dampak: {risk.risikoAwal.dampak}
          </p>
          <p className="text-red-900 font-semibold">Level: {risk.risikoAwal.level}</p>
        </div>
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <span className="font-medium text-yellow-700">Risiko Saat Ini:</span>
          <p className="text-yellow-900">
            Kejadian: {risk.risikoSaatIni.kejadian}, Dampak: {risk.risikoSaatIni.dampak}
          </p>
          <p className="text-yellow-900 font-semibold">Level: {risk.risikoSaatIni.level}</p>
        </div>
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <span className="font-medium text-green-700">Risiko Akhir:</span>
          <p className="text-green-900">
            Kejadian: {risk.resikoAkhir.kejadian}, Dampak: {risk.resikoAkhir.dampak}
          </p>
          <p className="text-green-900 font-semibold">Level: {risk.resikoAkhir.level}</p>
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
}

// Project Risk Detail Modal
interface ProjectRiskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectDetail: ProjectRiskDetail | null;
}

function ProjectRiskDetailModal({ 
  isOpen, 
  onClose, 
  projectDetail 
}: ProjectRiskDetailModalProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  if (!projectDetail) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <span>Risk Capture Detail - {projectDetail.projectName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Risk Distribution Summary */}
          {projectDetail.totalRisks > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Distribusi Risiko:</h4>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 text-sm">
                <Badge className="bg-green-100 text-green-800 justify-center">
                  Sangat Rendah: {projectDetail.riskDistribution.sangatRendah}
                </Badge>
                <Badge className="bg-green-100 text-green-800 justify-center">
                  Rendah: {projectDetail.riskDistribution.rendah}
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800 justify-center">
                  Sedang: {projectDetail.riskDistribution.sedang}
                </Badge>
                <Badge className="bg-orange-100 text-orange-800 justify-center">
                  Tinggi: {projectDetail.riskDistribution.tinggi}
                </Badge>
                <Badge className="bg-red-100 text-red-800 justify-center">
                  Sangat Tinggi: {projectDetail.riskDistribution.sangatTinggi}
                </Badge>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {projectDetail.readinessCategories.map((category) => {
              const IconComponent = category.icon;
              const isExpanded = expandedCategories.has(category.id);
              const hasAnyRisks = category.items.some(item => item.hasRisks);

              return (
                <div key={category.id} className="border rounded-lg">
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <div
                        onClick={() => toggleCategory(category.id)}
                        className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">
                            {CATEGORY_DISPLAY_NAMES[category.id as keyof typeof CATEGORY_DISPLAY_NAMES] || category.title}
                          </span>
                          <Badge variant={hasAnyRisks ? "default" : "secondary"}>
                            {category.totalRisks} risks
                          </Badge>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-3 border-t bg-gray-50">
                          {category.items.map((item) => {
                            const itemKey = `${category.id}-${item.id}`;
                            const isItemExpanded = expandedItems.has(itemKey);

                            return (
                              <div key={itemKey} className="bg-white border rounded-lg">
                                <div
                                  onClick={() => toggleItem(itemKey)}
                                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-900">
                                      {item.title}
                                    </span>
                                    {item.hasRisks ? (
                                      <Badge className="bg-orange-100 text-orange-800">
                                        {item.risks.length} risk{item.risks.length > 1 ? 's' : ''}
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                        <Info className="w-3 h-3 mr-1" />
                                        Tidak ada risk capture
                                      </Badge>
                                    )}
                                  </div>
                                  {item.hasRisks && (
                                    isItemExpanded ? (
                                      <ChevronDown className="w-4 h-4 text-gray-400" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-400" />
                                    )
                                  )}
                                </div>
                                
                                {isItemExpanded && item.hasRisks && (
                                  <div className="px-3 pb-3 border-t bg-gray-50">
                                    <div className="space-y-3 mt-3">
                                      {item.risks.map((risk, riskIndex) => (
                                        <RiskItemDetail key={riskIndex} risk={risk} />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}
          </div>

          {projectDetail.totalRisks === 0 && (
            <div className="text-center py-8">
              <FileX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada risk capture data untuk project ini</p>
              <p className="text-sm text-gray-400 mt-1">
                Risk capture dapat ditambahkan melalui halaman verifikasi readiness
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function RiskCaptureVerification() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [projectRiskSummaries, setProjectRiskSummaries] = useState<ProjectRiskSummary[]>([]);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState<ProjectRiskDetail | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const summaries = loadProjectRiskSummary();
      setProjectRiskSummaries(summaries);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = projectRiskSummaries.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRisks = projectRiskSummaries.reduce((sum, project) => sum + project.totalRisks, 0);
  const projectsWithRisks = projectRiskSummaries.filter(project => project.totalRisks > 0).length;
  const highRiskProjects = projectRiskSummaries.filter(project => 
    project.riskDistribution.tinggi + project.riskDistribution.sangatTinggi > 0
  ).length;

  const handleViewDetail = (projectId: string) => {
    const projectDetail = loadProjectRiskDetail(projectId);
    setSelectedProjectDetail(projectDetail);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedProjectDetail(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Capture Verification"
        description="Review dan verifikasi risk capture data berdasarkan readiness categories dan items dari setiap project"
        icon="Shield"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {projectRiskSummaries.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Projects dengan data</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Total Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalRisks}
            </div>
            <p className="text-xs text-blue-600 mt-1">Semua risk items</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Projects dengan Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {projectsWithRisks}
            </div>
            <p className="text-xs text-green-600 mt-1">Ada risk capture data</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              High Risk Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {highRiskProjects}
            </div>
            <p className="text-xs text-red-600 mt-1">Tinggi/Sangat Tinggi</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari berdasarkan nama project..."
              className="pl-10 h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Capture Summary Table</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12">
              <LoadingSpinner />
              <p className="text-center text-gray-500 mt-4">
                Memuat data risk capture...
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FileX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm 
                  ? "Tidak ada project yang ditemukan dengan kriteria pencarian"
                  : "Tidak ada project dengan data risk capture"
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[400px]">Project Name</TableHead>
                    <TableHead className="text-center">Total Risks</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.projectId} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {project.projectName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {project.totalReadinessItems} readiness items • {project.itemsWithRisks} with risks
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={project.totalRisks > 0 ? "default" : "secondary"} className="text-sm">
                          {project.totalRisks} risk{project.totalRisks !== 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(project.projectId)}
                          className="hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <ProjectRiskDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        projectDetail={selectedProjectDetail}
      />
    </div>
  );
}
