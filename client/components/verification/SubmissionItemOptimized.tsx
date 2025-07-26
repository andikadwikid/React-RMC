import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Shield, User, Calendar, MessageSquare } from "lucide-react";
import type { ProjectReadiness } from "@/types";
import { formatDateTime } from "@/utils/formatters";
import { StatusBadge } from "@/components/common/StatusBadge";

interface SubmissionItemProps {
  submission: ProjectReadiness;
  onOpenModal: (submission: ProjectReadiness) => void;
}

export function SubmissionItem({
  submission,
  onOpenModal,
}: SubmissionItemProps) {
  return (
    <div className="border rounded-lg p-3 sm:p-4 lg:p-6 hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col gap-4">
        {/* Header Section - Mobile First */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg break-words">
                {submission.projectName}
              </h3>
              <StatusBadge status={submission.status} />
            </div>

            {/* Project ID - Mobile */}
            <div className="sm:hidden">
              <span className="text-xs text-gray-500 font-mono break-all">
                ID: {submission.projectId}
              </span>
            </div>
          </div>

          {/* Action Button - Mobile Full Width */}
          <div className="w-full sm:w-auto sm:ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenModal(submission)}
              className="w-full sm:w-auto hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              <span className="sm:hidden">Review Submission</span>
              <span className="hidden sm:inline">Review</span>
            </Button>
          </div>
        </div>

        {/* Info Grid - Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 text-sm">
          {/* Submitter Info */}
          <div className="flex items-start gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
            <User className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-blue-700 mb-1">
                Submitter
              </span>
              <span className="text-blue-900 font-medium break-words">
                {submission.submittedBy}
              </span>
            </div>
          </div>

          {/* Submit Date */}
          <div className="flex items-start gap-2 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-100">
            <Calendar className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-green-700 mb-1">
                Submit Date
              </span>
              <span className="text-green-900 font-medium break-words">
                {formatDateTime(submission.submittedAt)}
              </span>
            </div>
          </div>

          {/* Verifier Info - Only if available */}
          {submission.verifierName && (
            <div className="flex items-start gap-2 p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-100">
              <Shield className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-purple-700 mb-1">
                  Verifier
                </span>
                <span className="text-purple-900 font-medium break-words">
                  {submission.verifierName}
                </span>
              </div>
            </div>
          )}

          {/* Project ID - Desktop Only */}
          <div className="hidden sm:flex items-start gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100">
            <Shield className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-gray-700 mb-1">
                Project ID
              </span>
              <span className="text-gray-900 font-mono text-xs break-all">
                {submission.projectId}
              </span>
            </div>
          </div>
        </div>

        {/* Items Count - If available */}
        {submission.items && submission.items.length > 0 && (
          <div className="flex items-center gap-2 p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <Shield className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <span className="text-sm font-medium text-yellow-700">
              Total Items:
            </span>
            <Badge
              variant="outline"
              className="font-semibold text-yellow-800 border-yellow-300"
            >
              {submission.items.length}
            </Badge>

            {/* Progress indicator */}
            {submission.items.some((item) => item.verifierStatus) && (
              <div className="ml-auto text-xs text-yellow-700">
                Verified:{" "}
                {
                  submission.items.filter(
                    (item) => item.verifierStatus === "lengkap",
                  ).length
                }
                /{submission.items.length}
              </div>
            )}
          </div>
        )}

        {/* Overall Comment - If available */}
        {submission.overallComment && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-900">
                Comment:
              </span>
            </div>
            <p className="text-sm text-blue-800 break-words leading-relaxed pl-6">
              {submission.overallComment}
            </p>
          </div>
        )}

        {/* Status Summary - Mobile Enhancement */}
        <div className="sm:hidden border-t pt-3 mt-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Status: {submission.status.replace("_", " ").toUpperCase()}
            </span>
            {submission.items && (
              <span>{submission.items.length} items to review</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
