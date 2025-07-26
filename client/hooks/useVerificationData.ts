import { useState, useEffect, useMemo, useCallback } from "react";
import type { ProjectReadiness } from "@/types";
import { loadSubmissionTracking } from "@/utils/dataLoader";

export interface UseVerificationDataReturn {
  submissions: ProjectReadiness[];
  filteredSubmissions: ProjectReadiness[];
  isLoading: boolean;
  searchTerm: string;
  activeTab: string;
  setSearchTerm: (term: string) => void;
  setActiveTab: (tab: string) => void;
  updateSubmission: (submissionId: string, verificationData: any) => void;
  getCounts: () => {
    total: number;
    pending: number;
    verified: number;
    revision: number;
    underReview: number;
  };
}

export const useVerificationData = (): UseVerificationDataReturn => {
  const [submissions, setSubmissions] = useState<ProjectReadiness[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const timer = setTimeout(() => {
      const submissionData = loadSubmissionTracking();
      setSubmissions(submissionData.readiness_submissions || []);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Filter submissions based on search term and active tab
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesSearch =
        submission.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = activeTab === "all" || submission.status === activeTab;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, activeTab]);

  // Update submission callback
  const updateSubmission = useCallback((submissionId: string, verificationData: any) => {
    setSubmissions((prev) =>
      prev.map((submission) => {
        if (submission.id === submissionId) {
          return {
            ...submission,
            status: verificationData.status,
            verifierName: verificationData.verifierName,
            verifiedAt: verificationData.verifiedAt,
            overallComment: verificationData.overallComment,
            items: verificationData.items,
          };
        }
        return submission;
      })
    );
  }, []);

  // Memoized counts
  const getCounts = useCallback(() => ({
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "submitted").length,
    verified: submissions.filter((s) => s.status === "verified").length,
    revision: submissions.filter((s) => s.status === "needs_revision").length,
    underReview: submissions.filter((s) => s.status === "under_review").length,
  }), [submissions]);

  return {
    submissions,
    filteredSubmissions,
    isLoading,
    searchTerm,
    activeTab,
    setSearchTerm,
    setActiveTab,
    updateSubmission,
    getCounts,
  };
};
