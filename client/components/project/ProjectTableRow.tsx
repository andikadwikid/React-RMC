import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { ProjectStatusBadge, ReadinessBadge, RiskCaptureBadge, VerificationBadge } from "./ProjectStatusBadge";
import type { Project } from "@/types";

interface ProjectTableRowProps {
  project: Project;
}

export function ProjectTableRow({ project }: ProjectTableRowProps) {
  return (
    <TableRow key={project.id} className="hover:bg-gray-50">
      <TableCell>
        <div>
          <p className="font-medium text-sm lg:text-base text-gray-900 break-words">
            {project.name}
          </p>
          {/* Show client on mobile when client column is hidden */}
          <p className="text-xs text-gray-600 mt-1 sm:hidden">
            Client: {project.client}
          </p>
        </div>
      </TableCell>
      
      <TableCell className="hidden sm:table-cell">
        <p className="text-xs lg:text-sm text-gray-900 break-words">
          {project.client}
        </p>
      </TableCell>
      
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 sm:w-12 lg:w-16 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <span className="text-xs lg:text-sm text-gray-600 whitespace-nowrap">
              {project.progress}%
            </span>
          </div>
          <ProjectStatusBadge progress={project.progress} />
        </div>
      </TableCell>
      
      <TableCell>
        <div className="text-xs lg:text-sm">
          <p className="font-medium break-words">
            {formatCurrency(project.budget)}
          </p>
          <p className="text-gray-500 break-words">
            Spent: {formatCurrency(project.spent)}
          </p>
        </div>
      </TableCell>
      
      <TableCell className="hidden sm:table-cell">
        <div className="text-xs lg:text-sm">
          <p className="whitespace-nowrap">
            {new Date(project.startDate).toLocaleDateString("id-ID")}
          </p>
          <p className="text-gray-500 whitespace-nowrap">
            → {new Date(project.endDate).toLocaleDateString("id-ID")}
          </p>
        </div>
      </TableCell>
      
      <TableCell className="hidden md:table-cell">
        <ReadinessBadge
          status={project.readinessStatus}
          score={project.readinessScore}
        />
      </TableCell>
      
      <TableCell className="hidden md:table-cell">
        <RiskCaptureBadge
          status={project.riskCaptureStatus}
          score={project.riskCaptureScore}
        />
      </TableCell>
      
      <TableCell className="hidden lg:table-cell">
        <VerificationBadge projectId={project.id} />
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-1 lg:gap-2">
          <Link to={`/projects/${project.id}`}>
            <Button
              variant="ghost"
              size="sm"
              title="View Details"
              className="h-8 w-8 p-0 lg:h-9 lg:w-9"
            >
              <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
