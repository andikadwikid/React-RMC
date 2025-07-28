import { useState, useEffect, useMemo, useCallback } from "react";
import type { RiskItem } from "@/types";
import {
  getReadinessTemplate,
  getAllProjects,
  getProjectReadinessItems,
  getProjectRiskCapture,
} from "@/utils/dataLoader";
import {
  getRiskLevel,
  ICON_MAP,
  CATEGORY_DISPLAY_NAMES,
} from "@/constants/riskCapture";

export interface ProjectRiskSummary {
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

export interface ProjectRiskDetail {
  projectId: string;
  projectName: string;
  readinessCategories: ReadinessCategoryWithRisks[];
  quickRiskCapture: {
    risks: RiskItem[];
    totalRisks: number;
    completedAt?: string;
  } | null;
  totalRisks: number;
  riskDistribution: {
    sangatRendah: number;
    rendah: number;
    sedang: number;
    tinggi: number;
    sangatTinggi: number;
  };
}

export interface ReadinessCategoryWithRisks {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  items: ReadinessItemWithRisks[];
  totalRisks: number;
}

export interface ReadinessItemWithRisks {
  id: string;
  title: string;
  risks: RiskItem[];
  hasRisks: boolean;
}

// Memoized risk distribution calculation
const calculateRiskDistribution = (risks: RiskItem[]) => {
  return risks.reduce(
    (acc, risk) => {
      // Handle both readiness-based risks (with risikoSaatIni) and quick risk capture (without risk levels)
      // For quick risk capture, we'll assign a default medium risk level since they don't have assessment yet
      const riskLevel = risk.risikoSaatIni?.level || 3; // Default to medium risk level
      const level = getRiskLevel(riskLevel);
      switch (level) {
        case 1:
          acc.sangatRendah++;
          break;
        case 2:
          acc.rendah++;
          break;
        case 3:
          acc.sedang++;
          break;
        case 4:
          acc.tinggi++;
          break;
        case 5:
          acc.sangatTinggi++;
          break;
      }
      return acc;
    },
    {
      sangatRendah: 0,
      rendah: 0,
      sedang: 0,
      tinggi: 0,
      sangatTinggi: 0,
    },
  );
};

// Main data loading function for summary table with memoization
const loadProjectRiskSummary = (): ProjectRiskSummary[] => {
  try {
    const template = getReadinessTemplate();
    const projects = getAllProjects();

    return projects
      .map((project) => {
        const readinessItems = getProjectReadinessItems(project.id);
        const quickRiskData = getProjectRiskCapture(project.id);

        // Count all risks across all readiness items
        const readinessRisks = readinessItems.flatMap(
          (item) => item.risk_capture || [],
        );
        // Ensure quick risk capture risks have proper structure with default risk levels
        const quickRisks = (quickRiskData?.risks || []).map((risk) => ({
          ...risk,
          risikoSaatIni: risk.risikoSaatIni || {
            kejadian: 3,
            dampak: 3,
            level: 9,
          }, // Default medium risk
        }));
        const allProjectRisks = [...readinessRisks, ...quickRisks];

        const itemsWithRisks = readinessItems.filter(
          (item) => item.risk_capture && item.risk_capture.length > 0,
        );

        // Get categories that have risks
        const categoriesWithRisks = Array.from(
          new Set(
            readinessItems
              .filter(
                (item) => item.risk_capture && item.risk_capture.length > 0,
              )
              .map((item) => item.category),
          ),
        );

        // Calculate risk distribution using memoized function (includes quick risks)
        const riskDistribution = calculateRiskDistribution(allProjectRisks);

        // Find highest risk level (handle both data structures)
        const highestRiskLevel =
          allProjectRisks.length > 0
            ? Math.max(
                ...allProjectRisks.map((r) => r.risikoSaatIni?.level || 3),
              )
            : 0;

        return {
          projectId: project.id,
          projectName: project.name,
          totalRisks: allProjectRisks.length,
          totalReadinessItems: readinessItems.length,
          itemsWithRisks: itemsWithRisks.length,
          riskDistribution,
          highestRiskLevel,
          categoriesWithRisks,
        };
      })
      .filter((project) => project.totalReadinessItems > 0);
  } catch (error) {
    console.error("Error loading project risk summary:", error);
    return [];
  }
};

// Load detailed project risk data for modal with memoization
const loadProjectRiskDetail = (projectId: string): ProjectRiskDetail | null => {
  try {
    const template = getReadinessTemplate();
    const projects = getAllProjects();
    const project = projects.find((p) => p.id === projectId);

    if (!project) return null;

    const readinessItems = getProjectReadinessItems(projectId);
    const quickRiskData = getProjectRiskCapture(projectId);

    // Group readiness items by category
    const itemsByCategory = readinessItems.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    // Build categories with risks
    const readinessCategories: ReadinessCategoryWithRisks[] =
      template.categories.map((categoryTemplate) => {
        const categoryItems = itemsByCategory[categoryTemplate.id] || [];

        const itemsWithRisks: ReadinessItemWithRisks[] =
          categoryTemplate.items.map((itemTemplate) => {
            // Find actual readiness item
            const actualItem = categoryItems.find(
              (item) => item.item === itemTemplate.title,
            );
            const risks = actualItem?.risk_capture || [];

            return {
              id: itemTemplate.id,
              title: itemTemplate.title,
              risks: risks,
              hasRisks: risks.length > 0,
            };
          });

        const totalCategoryRisks = itemsWithRisks.reduce(
          (sum, item) => sum + item.risks.length,
          0,
        );

        return {
          id: categoryTemplate.id,
          title: categoryTemplate.title,
          icon: ICON_MAP[categoryTemplate.icon as keyof typeof ICON_MAP],
          items: itemsWithRisks,
          totalRisks: totalCategoryRisks,
        };
      });

    // Calculate total risks and distribution for project
    const allProjectRisks = readinessCategories.flatMap((cat) =>
      cat.items.flatMap((item) => item.risks),
    );

    // Ensure quick risk capture risks have proper structure with default risk levels
    const quickRisks = (quickRiskData?.risks || []).map((risk) => ({
      ...risk,
      risikoSaatIni: risk.risikoSaatIni || { kejadian: 3, dampak: 3, level: 9 }, // Default medium risk
      risikoAwal: risk.risikoAwal || { kejadian: 3, dampak: 3, level: 9 },
      resikoAkhir: risk.resikoAkhir || { kejadian: 3, dampak: 3, level: 9 },
    }));
    const combinedRisks = [...allProjectRisks, ...quickRisks];
    const riskDistribution = calculateRiskDistribution(combinedRisks);

    return {
      projectId: project.id,
      projectName: project.name,
      readinessCategories,
      quickRiskCapture: quickRiskData
        ? {
            risks: quickRiskData.risks,
            totalRisks: quickRiskData.risks.length,
            completedAt: quickRiskData.completedAt,
          }
        : null,
      totalRisks: combinedRisks.length,
      riskDistribution,
    };
  } catch (error) {
    console.error("Error loading project risk detail:", error);
    return null;
  }
};

export const useRiskCaptureData = () => {
  const [projectRiskSummaries, setProjectRiskSummaries] = useState<
    ProjectRiskSummary[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Load initial data
  useEffect(() => {
    const timer = setTimeout(() => {
      const summaries = loadProjectRiskSummary();
      setProjectRiskSummaries(summaries);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Memoized filtered projects
  const filteredProjects = useMemo(() => {
    return projectRiskSummaries.filter((project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [projectRiskSummaries, searchTerm]);

  // Memoized statistics
  const statistics = useMemo(() => {
    const totalRisks = projectRiskSummaries.reduce(
      (sum, project) => sum + project.totalRisks,
      0,
    );
    const projectsWithRisks = projectRiskSummaries.filter(
      (project) => project.totalRisks > 0,
    ).length;
    const highRiskProjects = projectRiskSummaries.filter(
      (project) =>
        project.riskDistribution.tinggi +
          project.riskDistribution.sangatTinggi >
        0,
    ).length;

    return {
      totalProjects: projectRiskSummaries.length,
      totalRisks,
      projectsWithRisks,
      highRiskProjects,
    };
  }, [projectRiskSummaries]);

  // Memoized detail loader
  const loadDetailData = useCallback((projectId: string) => {
    return loadProjectRiskDetail(projectId);
  }, []);

  return {
    projectRiskSummaries,
    filteredProjects,
    statistics,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadDetailData,
  };
};
