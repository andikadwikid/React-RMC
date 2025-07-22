import { Button } from "@/components/ui/button";
import { ICON_MAP } from "@/constants";
import type { PageHeaderProps } from "@/types";

export function PageHeader({
  title,
  description,
  icon,
  actionButton,
}: PageHeaderProps) {
  const IconComponent = icon ? ICON_MAP[icon as keyof typeof ICON_MAP] : null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          {IconComponent && <IconComponent className="h-8 w-8 text-blue-600" />}
          {title}
        </h1>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>
      {actionButton && (
        <Button
          onClick={actionButton.onClick}
          className="flex items-center gap-2"
        >
          {actionButton.icon &&
            (() => {
              const ActionIcon =
                ICON_MAP[actionButton.icon as keyof typeof ICON_MAP];
              return <ActionIcon className="w-4 h-4" />;
            })()}
          {actionButton.label}
        </Button>
      )}
    </div>
  );
}
