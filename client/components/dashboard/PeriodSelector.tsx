import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronDown, TrendingUp } from "lucide-react";
import type { Period, PeriodSelectorProps } from "@/types";

export function PeriodSelector<T extends Period>({
  periods,
  selectedPeriod,
  onPeriodChange,
  className = "",
}: PeriodSelectorProps<T>) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handlePeriodChange = (period: T) => {
    onPeriodChange(period);
    setShowDropdown(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        Ubah Periode
        <ChevronDown className="w-4 h-4" />
      </Button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">
              PILIH PERIODE DATA
            </div>
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => handlePeriodChange(period)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center justify-between ${
                  selectedPeriod.id === period.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  {period.type === "yearly" ? (
                    <Calendar className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  <span>{period.label}</span>
                </div>
                {!period.isComplete && (
                  <Badge variant="secondary" className="text-xs">
                    Parsial
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
