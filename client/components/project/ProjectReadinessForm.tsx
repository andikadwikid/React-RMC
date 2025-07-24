import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Database,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  Save,
  MessageSquare,
  UserCheck,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { getReadinessTemplate, getProjectReadiness } from "@/utils/dataLoader";
import type { ReadinessStatus } from "@/types";

interface ReadinessItem {
  id: string;
  title: string;
  status: ReadinessStatus;
  userComment?: string;
  verifierStatus?: ReadinessStatus;
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

import type { ProjectReadinessFormProps } from "@/types";

// Icon mapping for JSON data
const iconMap = {
  FileText,
  Database,
  Users,
  DollarSign,
};

const getDefaultReadinessData = (): ReadinessCategory[] => {
  const template = getReadinessTemplate();
  return template.categories.map((category) => ({
    ...category,
    icon: iconMap[category.icon as keyof typeof iconMap],
    items: category.items.map((item) => ({
      ...item,
      status: "tidak-tersedia" as ReadinessStatus,
    })),
  }));
};

const loadExistingReadinessData = (projectId: string): ReadinessCategory[] => {
  const existingData = getProjectReadiness(projectId);
  if (!existingData) {
    return getDefaultReadinessData();
  }

  return existingData.categories.map((category) => ({
    ...category,
    icon: iconMap[category.icon as keyof typeof iconMap],
  }));
};

const getStatusBadge = (status: ReadinessStatus) => {
  switch (status) {
    case "lengkap":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Lengkap
        </Badge>
      );
    case "parsial":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Parsial
        </Badge>
      );
    case "tidak-tersedia":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Tidak Tersedia
        </Badge>
      );
  }
};

const getStatusIcon = (status: ReadinessStatus) => {
  switch (status) {
    case "lengkap":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "parsial":
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    case "tidak-tersedia":
      return <XCircle className="w-4 h-4 text-red-600" />;
  }
};

const getCategoryProgress = (items: ReadinessItem[]) => {
  const completed = items.filter((item) => item.status === "lengkap").length;
  const partial = items.filter((item) => item.status === "parsial").length;
  const total = items.length;

  const completionPercentage = Math.round(
    ((completed + partial * 0.5) / total) * 100,
  );

  return {
    completed,
    partial,
    total,
    percentage: completionPercentage,
  };
};

export function ProjectReadinessForm({
  isOpen,
  onClose,
  projectId,
  projectName,
  onSave,
}: ProjectReadinessFormProps) {
  const [readinessData, setReadinessData] = useState<ReadinessCategory[]>(() =>
    loadExistingReadinessData(projectId),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateItemStatus = (
    categoryId: string,
    itemId: string,
    status: ReadinessStatus,
  ) => {
    setReadinessData((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, status } : item,
              ),
            }
          : category,
      ),
    );
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave(readinessData);
      onClose();
    } catch (error) {
      console.error("Error saving readiness data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const overallProgress = () => {
    const allItems = readinessData.flatMap((category) => category.items);
    return getCategoryProgress(allItems);
  };

  const progress = overallProgress();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto sm:w-full">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
            <span className="leading-tight">Project Readiness Assessment</span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Lengkapi data readiness untuk project:{" "}
            <strong className="break-words">{projectName}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Overall Progress */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Overall Readiness Progress
              </span>
              <span className="text-sm sm:text-base font-bold text-gray-900">
                {progress.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mb-2">
              <div
                className="bg-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-gray-600">
              <span>
                Lengkap:{" "}
                <strong className="text-green-600">{progress.completed}</strong>
              </span>
              <span>
                Parsial:{" "}
                <strong className="text-yellow-600">{progress.partial}</strong>
              </span>
              <span>
                Total: <strong>{progress.total}</strong>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Readiness Categories */}
        <div className="space-y-4 sm:space-y-6">
          {readinessData.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            const categoryProgress = getCategoryProgress(category.items);

            return (
              <Card key={category.id}>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm sm:text-base font-medium leading-tight">{category.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-gray-600">
                        {categoryProgress.completed + categoryProgress.partial}/
                        {categoryProgress.total}
                      </span>
                      <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${categoryProgress.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          {getStatusIcon(item.status)}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm sm:text-base leading-tight">
                              {item.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                          <div className="sm:hidden">
                            {getStatusBadge(item.status)}
                          </div>
                          <div className="hidden sm:block">
                            {getStatusBadge(item.status)}
                          </div>
                          <Select
                            value={item.status}
                            onValueChange={(value) =>
                              updateItemStatus(
                                category.id,
                                item.id,
                                value as ReadinessStatus,
                              )
                            }
                          >
                            <SelectTrigger className="w-full sm:w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lengkap">Lengkap</SelectItem>
                              <SelectItem value="parsial">Parsial</SelectItem>
                              <SelectItem value="tidak-tersedia">
                                Tidak Tersedia
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <DialogFooter className="mt-4 sm:mt-6 flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="hidden sm:inline">Menyimpan...</span>
                <span className="sm:hidden">Simpan...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Simpan Data Readiness</span>
                <span className="sm:hidden">Simpan</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
