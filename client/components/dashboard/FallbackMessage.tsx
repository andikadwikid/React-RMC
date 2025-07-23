import { Info } from "lucide-react";

interface FallbackMessageProps {
  title: string;
  description: string;
  show: boolean;
}

export function FallbackMessage({
  title,
  description,
  show,
}: FallbackMessageProps) {
  if (!show) return null;

  return (
    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
      <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-amber-800">{title}</p>
        <p className="text-xs text-amber-700 mt-1">{description}</p>
      </div>
    </div>
  );
}
