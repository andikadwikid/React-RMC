import { memo } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const DashboardLoadingSpinner = memo(({ 
  size = "md", 
  className = "" 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-4 border-primary/20 border-t-primary rounded-full animate-spin`} 
      />
    </div>
  );
});

DashboardLoadingSpinner.displayName = "DashboardLoadingSpinner";
