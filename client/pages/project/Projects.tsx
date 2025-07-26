import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";
import { useProjectsData } from "@/hooks/project";
import { useDebounce } from "@/hooks/common";
import { ProjectStatsCards } from "@/components/project/ProjectStatsCards";
import { ProjectFiltersComponent } from "@/components/project/ProjectFilters";
import { ProjectTable } from "@/components/project/ProjectTable";

// Memoized header component
const ProjectsHeader = React.memo(() => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 lg:gap-4">
    <div className="flex-1 min-w-0">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
        <Building2 className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
        <span className="break-words">List Project</span>
      </h1>
      <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
        Kelola dan monitor semua proyek yang sedang berjalan
      </p>
    </div>
    <Link to="/projects/create" className="w-full sm:w-auto">
      <Button className="flex items-center justify-center gap-2 w-full sm:w-auto">
        <Plus className="w-4 h-4" />
        <span className="sm:inline">Tambah Project</span>
      </Button>
    </Link>
  </div>
));

ProjectsHeader.displayName = "ProjectsHeader";

export default function Projects() {
  const {
    filteredProjects,
    filters,
    stats,
    setSearchTerm,
    setStatusFilter,
    setRiskFilter,
    resetFilters,
  } = useProjectsData();

  // Debounce search for better performance
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

  // Memoized filtered projects with debounced search
  const finalFilteredProjects = useMemo(() => {
    if (debouncedSearchTerm === filters.searchTerm) {
      return filteredProjects;
    }
    
    // Apply debounced search filter
    return filteredProjects.filter((project) => {
      return (
        project.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    });
  }, [filteredProjects, debouncedSearchTerm, filters.searchTerm]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchTerm !== "" ||
      filters.statusFilter !== "all" ||
      filters.riskFilter !== "all"
    );
  }, [filters]);

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <ProjectsHeader />

      {/* Summary Cards */}
      <ProjectStatsCards stats={stats} />

      {/* Filters */}
      <ProjectFiltersComponent
        filters={filters}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onRiskChange={setRiskFilter}
        onResetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Projects Table */}
      <ProjectTable
        projects={finalFilteredProjects}
        onResetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
}
