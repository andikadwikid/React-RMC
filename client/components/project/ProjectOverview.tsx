import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Calendar,
  Target,
  MapPin,
  User,
  Building2,
  Mail,
  Phone,
} from "lucide-react";
import type { Project } from "@/types";

interface ProjectOverviewProps {
  project: Project;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const startDate = project.startDate;
  const endDate = project.endDate;
  const totalDays = Math.floor(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
      {/* Project Info - Takes 2/3 width on large screens */}
      <div className="xl:col-span-2 space-y-4 sm:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {project.description}
            </p>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium">
                  {new Date(startDate).toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">End Date:</span>
                <span className="font-medium">
                  {new Date(endDate).toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{project.province}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">PM:</span>
                <span className="font-medium truncate">
                  {project.projectManager}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-4 sm:space-y-6">
        {/* Client Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-5 w-5 text-gray-600" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium text-gray-900">
                {project.client}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <a
                href={`mailto:${project.client_email || project.clientEmail}`}
                className="text-blue-600 hover:underline truncate"
              >
                {project.client_email || project.clientEmail}
              </a>
            </div>
            {(project.client_phone || project.clientPhone) && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a
                  href={`tel:${project.client_phone || project.clientPhone}`}
                  className="text-blue-600 hover:underline"
                >
                  {project.client_phone || project.clientPhone}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-indigo-600" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Category</span>
              <span className="text-sm font-medium">{project.category}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">
                Project Manager
              </span>
              <span className="text-sm font-medium text-right max-w-[60%]">
                {project.project_manager || project.projectManager}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Province</span>
              <span className="text-sm">{project.province}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Duration</span>
              <span className="text-sm">{totalDays} days</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Update</span>
              <span className="text-sm">
                {new Date(
                  project.last_update || project.lastUpdate,
                ).toLocaleDateString("id-ID")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
