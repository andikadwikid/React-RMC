import { Card, CardContent } from "@/components/ui/card";
import { ICON_MAP } from "@/constants";
import type { SummaryCardProps } from "@/types";
import { formatNumber } from "@/utils/formatters";

const colorClasses = {
  blue: "text-blue-500",
  green: "text-green-500",
  purple: "text-purple-500",
  orange: "text-orange-500",
  red: "text-red-500",
};

export function SummaryCard({
  title,
  value,
  icon,
  color,
  trend,
}: SummaryCardProps) {
  const IconComponent = ICON_MAP[icon as keyof typeof ICON_MAP];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {typeof value === "number" ? formatNumber(value) : value}
            </p>
            {trend && (
              <div className="flex items-center mt-1">
                <span
                  className={`text-xs font-medium ${
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  vs last month
                </span>
              </div>
            )}
          </div>
          <IconComponent className={`h-8 w-8 ${colorClasses[color]}`} />
        </div>
      </CardContent>
    </Card>
  );
}

interface SummaryCardsProps {
  cards: SummaryCardProps[];
}

export function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <SummaryCard key={`${card.title}-${index}`} {...card} />
      ))}
    </div>
  );
}
