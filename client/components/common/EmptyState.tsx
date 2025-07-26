import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  message,
  description,
  className = "",
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="py-12">
        <div className="text-center">
          <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">{message}</p>
          {description && (
            <p className="text-gray-400 text-sm mt-2">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
