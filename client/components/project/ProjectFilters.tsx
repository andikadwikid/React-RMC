import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { ProjectFilters } from "@/hooks/project";

interface ProjectFiltersProps {
  filters: ProjectFilters;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRiskChange: (value: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export function ProjectFiltersComponent({
  filters,
  onSearchChange,
  onStatusChange,
  onRiskChange,
  onResetFilters,
  hasActiveFilters,
}: ProjectFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4 lg:p-6">
        <div className="flex flex-col gap-3 lg:gap-4">
          {/* Search Input */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari project atau client..."
                value={filters.searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 text-sm lg:text-base"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <Select value={filters.statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full min-w-0">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="running">Berjalan</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="on-hold">Tertunda</SelectItem>
                  <SelectItem value="planning">Perencanaan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={filters.riskFilter} onValueChange={onRiskChange}>
              <SelectTrigger className="w-full sm:w-48 min-w-0">
                <SelectValue placeholder="Filter Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Risk</SelectItem>
                <SelectItem value="not_assessed">Belum Dinilai</SelectItem>
                <SelectItem value="low">Rendah</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="high">Tinggi</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onResetFilters}
                className="whitespace-nowrap"
              >
                Reset Filter
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
