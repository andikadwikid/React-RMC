import { Card, CardContent } from "@/components/ui/card";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = "Memuat data...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <Card className={className}>
      <CardContent className="py-12">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
        <p className="text-center text-gray-500 mt-4">{message}</p>
      </CardContent>
    </Card>
  );
}
