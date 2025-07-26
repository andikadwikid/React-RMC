import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Shield } from "lucide-react";
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
    <div
      key={submission.id}
      className="border rounded-lg p-3 sm:p-4 lg:p-6 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h3 className="font-semibold text-gray-900 text-lg">
              {submission.projectName}
            </h3>
            <StatusBadge status={submission.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">Submitter:</span>
              <span className="text-gray-900">{submission.submittedBy}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">Tanggal Submit:</span>
              <span className="text-gray-900">
                {formatDateTime(submission.submittedAt)}
              </span>
            </div>
            {submission.verifierName && (
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">Verifier:</span>
                <span className="text-gray-900">{submission.verifierName}</span>
              </div>
            )}
          </div>

          {submission.items && submission.items.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Total Items:</span>
              <Badge variant="outline" className="font-semibold">
                {submission.items.length}
              </Badge>
            </div>
          )}

          {submission.overallComment && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <span className="font-medium text-blue-900">Komentar:</span>
              <p className="mt-1 text-blue-800">{submission.overallComment}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end lg:ml-4 mt-2 lg:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenModal(submission)}
            className="w-full sm:w-auto hover:bg-blue-50 hover:border-blue-300 min-h-[44px] px-4 text-sm font-medium"
          >
            <Eye className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="sm:hidden">Lihat Detail</span>
            <span className="hidden sm:inline">Review</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
