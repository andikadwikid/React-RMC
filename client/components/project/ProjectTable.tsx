import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { ProjectTableRow } from "./ProjectTableRow";
import type { Project } from "@/types";

interface ProjectTableProps {
  projects: Project[];
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export function ProjectTable({
  projects,
  onResetFilters,
  hasActiveFilters,
}: ProjectTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3 lg:pb-6">
        <CardTitle className="text-base lg:text-lg">
          Daftar Project ({projects.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px] sm:min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="min-w-[150px] sm:min-w-[200px] lg:min-w-[250px]">
                  Project
                </TableHead>
                <TableHead className="min-w-[120px] lg:min-w-[150px] hidden sm:table-cell">
                  Client
                </TableHead>
                <TableHead className="min-w-[80px] sm:min-w-[100px] lg:min-w-[120px]">
                  Progress
                </TableHead>
                <TableHead className="min-w-[100px] sm:min-w-[120px] lg:min-w-[140px]">
                  Budget
                </TableHead>
                <TableHead className="min-w-[120px] lg:min-w-[140px] hidden sm:table-cell">
                  Timeline
                </TableHead>
                <TableHead className="min-w-[100px] lg:min-w-[120px] hidden md:table-cell">
                  Readiness
                </TableHead>
                <TableHead className="min-w-[100px] lg:min-w-[120px] hidden md:table-cell">
                  Risk Capture
                </TableHead>
                <TableHead className="min-w-[120px] lg:min-w-[140px] hidden lg:table-cell">
                  Verifikasi
                </TableHead>
                <TableHead className="min-w-[60px] sm:min-w-[100px] lg:min-w-[120px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500 text-sm lg:text-base">
                        {hasActiveFilters
                          ? "Tidak ada project yang ditemukan dengan filter yang dipilih"
                          : "Belum ada project yang terdaftar"}
                      </p>
                      {hasActiveFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onResetFilters}
                        >
                          Reset Filter
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <ProjectTableRow key={project.id} project={project} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
