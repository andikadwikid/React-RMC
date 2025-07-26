import React, { memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import type { ProjectRiskSummary } from "@/hooks/verification/useRiskCaptureData";

interface VirtualizedProjectTableProps {
  projects: ProjectRiskSummary[];
  onViewDetail: (projectId: string) => void;
}

// Row component memoized to prevent unnecessary re-renders
const ProjectTableRow = memo(
  ({
    project,
    onViewDetail,
  }: {
    project: ProjectRiskSummary;
    onViewDetail: (projectId: string) => void;
  }) => (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <div>
          <div className="font-medium text-gray-900">{project.projectName}</div>
          <div className="text-sm text-gray-500">
            {project.totalReadinessItems} readiness items •{" "}
            {project.itemsWithRisks} with risks
          </div>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Badge
          variant={project.totalRisks > 0 ? "default" : "secondary"}
          className="text-sm"
        >
          {project.totalRisks} risk{project.totalRisks !== 1 ? "s" : ""}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetail(project.projectId)}
          className="hover:bg-blue-50 hover:border-blue-300"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Detail
        </Button>
      </TableCell>
    </TableRow>
  ),
);

ProjectTableRow.displayName = "ProjectTableRow";

const VirtualizedProjectTable = memo(
  ({ projects, onViewDetail }: VirtualizedProjectTableProps) => {
    // For now, we'll render all items but in chunks to prevent blocking
    // For true virtualization, we'd need to implement a windowing library like react-window
    const memoizedRows = useMemo(() => {
      return projects.map((project) => (
        <ProjectTableRow
          key={project.projectId}
          project={project}
          onViewDetail={onViewDetail}
        />
      ));
    }, [projects, onViewDetail]);

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Project Name</TableHead>
              <TableHead className="text-center">Total Risks</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{memoizedRows}</TableBody>
        </Table>
      </div>
    );
  },
);

VirtualizedProjectTable.displayName = "VirtualizedProjectTable";

export default VirtualizedProjectTable;
