import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Database,
  Users,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MessageSquare,
  UserCheck,
  Calendar,
  Clock,
  Shield,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react";
import {
  getReadinessTemplate,
  getProjectReadiness,
  getProjectReadinessItems,
} from "@/utils/dataLoader";
import { formatDateTime } from "@/utils/formatters";
import type { ReadinessStatus } from "@/types";

interface UserComment {
  id: string;
  text: string;
  createdAt: string;
}

interface ReadinessItem {
  id: string;
  title: string;
  userStatus: ReadinessStatus;
  verifierStatus?: ReadinessStatus;
  userComments: UserComment[];
  userComment?: string;
  verifierComment?: string;
  verifierName?: string;
  verifiedAt?: string;
}

interface ReadinessCategory {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  items: ReadinessItem[];
}

interface ProjectReadinessResultsProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onEdit?: () => void;
}

const iconMap = {
  FileText,
  Database,
  Users,
  DollarSign,
};

const CATEGORY_DISPLAY_NAMES = {
  administrative: "Dokumen Administratif Lengkap",
  "user-data": "Data dari User Tersedia",
  personnel: "Personel Proyek Siap",
  "legal-financial": "Legal & Finansial",
};

const canEditReadiness = (status: string) => {
  return status !== "verified";
};

const STATUS_CONFIG = {
  lengkap: {
    label: "Lengkap",
    userColor: "bg-green-100 text-green-800",
    verifierColor: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  parsial: {
    label: "Parsial",
    userColor: "bg-yellow-100 text-yellow-800",
    verifierColor: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: AlertTriangle,
  },
  tidak_tersedia: {
    label: "Tidak Tersedia",
    userColor: "bg-red-100 text-red-800",
    verifierColor: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const VERIFICATION_STATUS_CONFIG = {
  verified: {
    label: "Terverifikasi",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  under_review: {
    label: "Sedang Direview",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Clock,
  },
  needs_revision: {
    label: "Perlu Revisi",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertTriangle,
  },
  submitted: {
    label: "Menunggu Review",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Clock,
  },
};

const loadReadinessResults = (projectId: string) => {
  const existingData = getProjectReadiness(projectId);

  if (!existingData) {
    return null;
  }

  const readinessItems = getProjectReadinessItems(projectId);

  if (readinessItems.length === 0) {
    return null;
  }
  
  const itemsByCategory = readinessItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }

      const processedItem = {
        id: item.id,
        title: item.item,
        userStatus: item.user_status,
        verifierStatus: item.verifier_status,
        userComments:
          item.user_comments ||
          (item.user_comment
            ? [
                {
                  id: `legacy-${item.id}`,
                  text: item.user_comment,
                  createdAt: item.created_at || new Date().toISOString(),
                },
              ]
            : []),
        userComment: item.user_comment,
        verifierComment: item.verifier_comment,
        verifierName: item.verifier_name,
        verifiedAt: item.verified_at,
      };

      acc[item.category].push(processedItem);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  const template = getReadinessTemplate();
  const categories = template.categories.map((category) => ({
    ...category,
    icon: iconMap[category.icon as keyof typeof iconMap],
    items: itemsByCategory[category.id] || [],
  }));

  return {
    submission: existingData,
    categories,
  };
};

const getStatusBadge = (status: ReadinessStatus, variant: 'user' | 'verifier' = 'user') => {
  const config = STATUS_CONFIG[status];
  const IconComponent = config.icon;
  const colorClass = variant === 'user' ? config.userColor : config.verifierColor;

  return (
    <Badge className={colorClass}>
      <IconComponent className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

const getCategoryProgress = (items: ReadinessItem[]) => {
  const verifiedItems = items.filter((item) => item.verifierStatus);
  const completed = verifiedItems.filter((item) => item.verifierStatus === "lengkap").length;
  const partial = verifiedItems.filter((item) => item.verifierStatus === "parsial").length;
  const total = items.length;

  const completionPercentage = verifiedItems.length > 0 ? Math.round(
    ((completed + partial * 0.5) / total) * 100,
  ) : 0;

  return {
    completed,
    partial,
    total,
    verified: verifiedItems.length,
    percentage: completionPercentage,
  };
};

export function ProjectReadinessResults({
  isOpen,
  onClose,
  projectId,
  projectName,
  onEdit,
}: ProjectReadinessResultsProps) {
  const [readinessData, setReadinessData] = useState<{
    submission: any;
    categories: ReadinessCategory[];
  } | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && projectId) {
      const data = loadReadinessResults(projectId);
      setReadinessData(data);
      
      // Expand all categories by default
      if (data) {
        setExpandedCategories(new Set(data.categories.map(cat => cat.id)));
      }
    }
  }, [isOpen, projectId]);

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

  if (!readinessData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Readiness Assessment</DialogTitle>
            <DialogDescription>
              Belum ada data readiness assessment untuk project ini.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={onClose}>Tutup</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { submission, categories } = readinessData;
  const overallProgress = getCategoryProgress(categories.flatMap(cat => cat.items));
  const verificationStatus = VERIFICATION_STATUS_CONFIG[submission.status as keyof typeof VERIFICATION_STATUS_CONFIG];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-4 lg:p-6 border-b">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg lg:text-xl">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              <span>Hasil Verifikasi Project Readiness</span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-sm lg:text-base">
            Hasil assessment dan feedback dari Risk Officer untuk project: <strong>{projectName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {/* Verification Summary */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Status Verifikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status Keseluruhan
                  </label>
                  <div className="mt-1">
                    <Badge className={verificationStatus.color}>
                      <verificationStatus.icon className="w-3 h-3 mr-1" />
                      {verificationStatus.label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Progress Verifikasi
                  </label>
                  <div className="mt-1">
                    <span className="text-lg font-semibold text-blue-600">
                      {overallProgress.verified}/{overallProgress.total} Items
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({overallProgress.percentage}%)
                    </span>
                  </div>
                </div>
                {submission.verifier_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Verifier
                    </label>
                    <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      {submission.verifier_name}
                    </p>
                  </div>
                )}
                {submission.verified_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Tanggal Verifikasi
                    </label>
                    <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      {formatDateTime(submission.verified_at)}
                    </p>
                  </div>
                )}
              </div>
              
              {submission.overall_comment && (
                <div className="mt-4 pt-4 border-t">
                  <label className="text-sm font-medium text-gray-600">
                    Komentar Keseluruhan
                  </label>
                  <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                    {submission.overall_comment}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overall Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Progress Verifikasi Keseluruhan
                </span>
                <span className="text-base font-bold text-gray-900">
                  {overallProgress.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress.percentage}%` }}
                ></div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                  Lengkap: <strong className="text-green-600">{overallProgress.completed}</strong>
                </span>
                <span>
                  Parsial: <strong className="text-yellow-600">{overallProgress.partial}</strong>
                </span>
                <span>
                  Total: <strong>{overallProgress.total}</strong>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Readiness Categories */}
          <div className="space-y-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const categoryProgress = getCategoryProgress(category.items);
              const isExpanded = expandedCategories.has(category.id);

              return (
                <Card key={category.id}>
                  <CardHeader className="pb-3">
                    <CardTitle 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <span className="text-base font-medium">
                          {CATEGORY_DISPLAY_NAMES[category.id as keyof typeof CATEGORY_DISPLAY_NAMES] || category.title}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({categoryProgress.verified}/{categoryProgress.total})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${categoryProgress.percentage}%` }}
                          ></div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {category.items.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 border rounded-lg bg-gray-50 space-y-4"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 text-base">
                                  {item.title}
                                </h4>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 font-medium">
                                      Status User:
                                    </span>
                                    {getStatusBadge(item.userStatus, 'user')}
                                  </div>
                                  {item.verifierStatus && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-500 font-medium">
                                        Status Verifier:
                                      </span>
                                      {getStatusBadge(item.verifierStatus, 'verifier')}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* User Comments */}
                            {item.userComments && item.userComments.length > 0 && (
                              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <MessageSquare className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-700">
                                    Keterangan User ({item.userComments.length}):
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  {item.userComments.map((comment, index) => (
                                    <div
                                      key={comment.id}
                                      className="bg-white border border-green-200 p-2 rounded"
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-green-600">
                                          Keterangan #{index + 1}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(comment.createdAt).toLocaleString("id-ID", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                      </div>
                                      <p className="text-sm text-green-800 leading-relaxed">
                                        {comment.text}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Verifier Feedback */}
                            {item.verifierComment ? (
                              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <UserCheck className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">
                                      Feedback Risk Officer:
                                    </span>
                                  </div>
                                  {item.verifiedAt && (
                                    <span className="text-xs text-blue-600">
                                      {new Date(item.verifiedAt).toLocaleString("id-ID", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  )}
                                </div>
                                <div className="bg-white border border-blue-200 p-3 rounded">
                                  <p className="text-sm text-blue-800 leading-relaxed">
                                    {item.verifierComment}
                                  </p>
                                  {item.verifierName && (
                                    <div className="mt-2 pt-2 border-t border-blue-200">
                                      <span className="text-xs text-blue-600 font-medium">
                                        — {item.verifierName}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center">
                                <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                                <p className="text-sm text-gray-500 italic">
                                  Menunggu feedback dari Risk Officer
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        <div className="p-4 lg:p-6 border-t bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {canEditReadiness(submission.status) && onEdit && (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Assessment dapat diupdate sampai terverifikasi final</span>
              </div>
            )}
            <div className="flex gap-2 w-full sm:w-auto">
              {canEditReadiness(submission.status) && onEdit && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onEdit();
                    onClose();
                  }}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update Assessment
                </Button>
              )}
              <Button onClick={onClose}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
