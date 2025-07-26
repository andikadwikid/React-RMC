import { useState, useMemo, useCallback } from "react";
import { getProjectsWithStatus } from "@/utils/dataLoader";
import type { Project } from "@/types";

export interface ProjectFilters {
  searchTerm: string;
  statusFilter: string;
  riskFilter: string;
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  totalBudget: number;
  totalSpent: number;
}

export interface UseProjectsDataReturn {
  projects: Project[];
  filteredProjects: Project[];
  filters: ProjectFilters;
  stats: ProjectStats;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setRiskFilter: (risk: string) => void;
  resetFilters: () => void;
  getProjectStatus: (progress: number) => string;
  getProjectRisk: (riskScore?: number) => string;
}

export const useProjectsData = (): UseProjectsDataReturn => {
  const [projects] = useState<Project[]>(getProjectsWithStatus());
  const [filters, setFilters] = useState<ProjectFilters>({
    searchTerm: "",
    statusFilter: "all",
    riskFilter: "all",
  });

  // Filter handlers
  const setSearchTerm = useCallback((term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  }, []);

  const setStatusFilter = useCallback((status: string) => {
    setFilters(prev => ({ ...prev, statusFilter: status }));
  }, []);

  const setRiskFilter = useCallback((risk: string) => {
    setFilters(prev => ({ ...prev, riskFilter: risk }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      statusFilter: "all",
      riskFilter: "all",
    });
  }, []);

  // Utility functions
  const getProjectStatus = useCallback((progress: number): string => {
    if (progress === 100) return "completed";
    if (progress > 0) return "running";
    return "planning";
  }, []);

  const getProjectRisk = useCallback((riskScore?: number): string => {
    if (!riskScore || riskScore === 0) return "not_assessed";
    if (riskScore >= 80) return "low";
    if (riskScore >= 60) return "medium";
    return "high";
  }, []);

  // Memoized filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const projectStatus = getProjectStatus(project.progress);
      const matchesStatus = filters.statusFilter === "all" || projectStatus === filters.statusFilter;

      const projectRisk = getProjectRisk(project.riskCaptureScore);
      const matchesRisk = filters.riskFilter === "all" || projectRisk === filters.riskFilter;

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [projects, filters, getProjectStatus, getProjectRisk]);

  // Memoized stats
  const stats = useMemo((): ProjectStats => {
    const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
    const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
    const activeProjects = projects.filter(p => p.progress > 0 && p.progress < 100).length;
    const completedProjects = projects.filter(p => p.progress === 100).length;

    return {
      total: projects.length,
      active: activeProjects,
      completed: completedProjects,
      totalBudget,
      totalSpent,
    };
  }, [projects]);

  return {
    projects,
    filteredProjects,
    filters,
    stats,
    setSearchTerm,
    setStatusFilter,
    setRiskFilter,
    resetFilters,
    getProjectStatus,
    getProjectRisk,
  };
};
