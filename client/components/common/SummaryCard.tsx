import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  borderColor?: string;
  valueColor?: string;
  descriptionColor?: string;
  className?: string;
}

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-gray-600",
  borderColor,
  valueColor = "text-gray-900",
  descriptionColor = "text-gray-500",
  className = "",
}: SummaryCardProps) {
  return (
    <Card className={`hover:shadow-md transition-shadow duration-200 ${borderColor || ""} ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm font-medium flex items-center gap-2 ${iconColor.includes("text-") ? iconColor : `text-${iconColor}`}`}>
          <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor}`}>
          {value}
        </div>
        {description && (
          <p className={`text-xs mt-1 ${descriptionColor}`}>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
