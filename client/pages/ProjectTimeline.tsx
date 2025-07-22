import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { TimelineCard } from "@/components/timeline/TimelineCard";
import type { TimelineMilestone, MilestoneStatus } from "@/types";

// Mock data - in real app this would come from API
const mockProject = {
  id: "PRJ-001",
  name: "Sistem ERP Perusahaan",
  client: "PT. Teknologi Maju",
  startDate: "2024-01-15",
  endDate: "2024-06-30",
  status: "running" as const,
  progress: 68,
  timeline: [
    {
      id: "1",
      title: "Project Initiation & Planning",
      description:
        "Kickoff meeting, requirement gathering, dan initial planning",
      startDate: "2024-01-15",
      endDate: "2024-01-25",
      status: "completed" as MilestoneStatus,
      assignee: "John Doe",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-25",
    },
    {
      id: "2",
      title: "System Analysis & Design",
      description:
        "Business process analysis, system architecture design, database design",
      startDate: "2024-01-26",
      endDate: "2024-02-15",
      status: "completed" as MilestoneStatus,
      assignee: "Jane Smith",
      createdAt: "2024-01-01",
      updatedAt: "2024-02-15",
    },
    {
      id: "3",
      title: "Backend Development",
      description:
        "API development, database implementation, core business logic",
      startDate: "2024-02-16",
      endDate: "2024-03-30",
      status: "in-progress" as MilestoneStatus,
      assignee: "Mike Johnson",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-20",
    },
    {
      id: "4",
      title: "Frontend Development",
      description:
        "User interface development, responsive design, user experience optimization",
      startDate: "2024-03-01",
      endDate: "2024-04-15",
      status: "in-progress" as MilestoneStatus,
      assignee: "Sarah Wilson",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-18",
    },
    {
      id: "5",
      title: "Integration & Testing",
      description:
        "System integration, unit testing, integration testing, bug fixing",
      startDate: "2024-04-16",
      endDate: "2024-05-15",
      status: "pending" as MilestoneStatus,
      assignee: "David Brown",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
    {
      id: "6",
      title: "User Acceptance Testing",
      description:
        "UAT preparation, user training, feedback collection and implementation",
      startDate: "2024-05-16",
      endDate: "2024-06-05",
      status: "blocked" as MilestoneStatus,
      assignee: "Lisa Davis",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-15",
    },
    {
      id: "7",
      title: "Deployment & Go Live",
      description: "Production deployment, data migration, go-live support",
      startDate: "2024-06-06",
      endDate: "2024-06-30",
      status: "pending" as MilestoneStatus,
      assignee: "Alex Chen",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
  ] as TimelineMilestone[],
};

export default function ProjectTimeline() {
  const { projectId } = useParams();
  const [project] = useState(mockProject);

  // Calculate timeline statistics
  const totalMilestones = project.timeline.length;
  const completedMilestones = project.timeline.filter(
    (m) => m.status === "completed",
  ).length;
  const progressPercentage = totalMilestones
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/projects">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Projects
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            Timeline Project
          </h1>
          <p className="text-gray-600 mt-1">
            {project.name} - {project.client}
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
          <p className="text-sm text-gray-600">
            Daftar milestone project dari awal hingga akhir
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.timeline.map((milestone) => (
              <TimelineCard
                key={milestone.id}
                milestone={milestone}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
