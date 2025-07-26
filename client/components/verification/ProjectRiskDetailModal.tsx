import React, { useState, memo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Shield, FileX, ChevronDown, ChevronRight, Info } from "lucide-react";
import type { ProjectRiskDetail } from "@/hooks/verification/useRiskCaptureData";
import { CATEGORY_DISPLAY_NAMES } from "@/constants/riskCapture";
import RiskItemDetail from "./RiskItemDetail";

interface ProjectRiskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectDetail: ProjectRiskDetail | null;
}

const ProjectRiskDetailModal = memo(
  ({ isOpen, onClose, projectDetail }: ProjectRiskDetailModalProps) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
      new Set(),
    );
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleCategory = useCallback((categoryId: string) => {
      setExpandedCategories((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(categoryId)) {
          newSet.delete(categoryId);
        } else {
          newSet.add(categoryId);
        }
        return newSet;
      });
    }, []);

    const toggleItem = useCallback((itemId: string) => {
      setExpandedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    }, []);

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
                <h4 className="font-medium text-gray-900 mb-3">
                  Distribusi Risiko:
                </h4>
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
                const hasAnyRisks = category.items.some(
                  (item) => item.hasRisks,
                );

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
                              {CATEGORY_DISPLAY_NAMES[
                                category.id as keyof typeof CATEGORY_DISPLAY_NAMES
                              ] || category.title}
                            </span>
                            <Badge
                              variant={hasAnyRisks ? "default" : "secondary"}
                            >
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
                                <div
                                  key={itemKey}
                                  className="bg-white border rounded-lg"
                                >
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
                                          {item.risks.length} risk
                                          {item.risks.length > 1 ? "s" : ""}
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="secondary"
                                          className="bg-gray-100 text-gray-600"
                                        >
                                          <Info className="w-3 h-3 mr-1" />
                                          Tidak ada risk capture
                                        </Badge>
                                      )}
                                    </div>
                                    {item.hasRisks &&
                                      (isItemExpanded ? (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                      ))}
                                  </div>

                                  {isItemExpanded && item.hasRisks && (
                                    <div className="px-3 pb-3 border-t bg-gray-50">
                                      <div className="space-y-3 mt-3">
                                        {item.risks.map((risk, riskIndex) => (
                                          <RiskItemDetail
                                            key={riskIndex}
                                            risk={risk}
                                          />
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
                <p className="text-gray-500">
                  Tidak ada risk capture data untuk project ini
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Risk capture dapat ditambahkan melalui halaman verifikasi
                  readiness
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

ProjectRiskDetailModal.displayName = "ProjectRiskDetailModal";

export default ProjectRiskDetailModal;
