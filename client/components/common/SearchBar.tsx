import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";

import type { SearchBarProps } from "@/types";

// Extended props for this implementation
interface ExtendedSearchBarProps extends SearchBarProps {
  delay?: number;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Cari...",
  delay = 300,
  className = "",
}: ExtendedSearchBarProps) {
  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
    </Card>
  );
}
