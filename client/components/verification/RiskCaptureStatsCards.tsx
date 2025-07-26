import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface Statistics {
  totalProjects: number;
  totalRisks: number;
  projectsWithRisks: number;
  highRiskProjects: number;
}

interface RiskCaptureStatsCardsProps {
  statistics: Statistics;
}

const RiskCaptureStatsCards = memo(
  ({ statistics }: RiskCaptureStatsCardsProps) => {
    const cards = [
      {
        title: "Total Projects",
        value: statistics.totalProjects,
        icon: Shield,
        color: "border-gray-200",
        iconColor: "text-gray-600",
        valueColor: "text-gray-900",
        subtitle: "Projects dengan data",
        subtitleColor: "text-gray-500",
      },
      {
        title: "Total Risks",
        value: statistics.totalRisks,
        icon: AlertTriangle,
        color: "border-blue-200",
        iconColor: "text-blue-700",
        valueColor: "text-blue-600",
        subtitle: "Semua risk items",
        subtitleColor: "text-blue-600",
      },
      {
        title: "Projects dengan Risks",
        value: statistics.projectsWithRisks,
        icon: CheckCircle,
        color: "border-green-200",
        iconColor: "text-green-700",
        valueColor: "text-green-600",
        subtitle: "Ada risk capture data",
        subtitleColor: "text-green-600",
      },
      {
        title: "High Risk Projects",
        value: statistics.highRiskProjects,
        icon: XCircle,
        color: "border-red-200",
        iconColor: "text-red-700",
        valueColor: "text-red-600",
        subtitle: "Tinggi/Sangat Tinggi",
        subtitleColor: "text-red-600",
      },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card
            key={card.title}
            className={`hover:shadow-md transition-shadow duration-200 ${card.color}`}
          >
            <CardHeader className="pb-2">
              <CardTitle
                className={`text-sm font-medium ${card.iconColor} flex items-center gap-2`}
              >
                <card.icon className="w-4 h-4" />
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.valueColor}`}>
                {card.value}
              </div>
              <p className={`text-xs mt-1 ${card.subtitleColor}`}>
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  },
);

RiskCaptureStatsCards.displayName = "RiskCaptureStatsCards";

export default RiskCaptureStatsCards;
