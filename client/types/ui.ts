import React, { ReactNode } from "react";
import { DialogProps } from "@radix-ui/react-dialog";
import { FieldValues } from "react-hook-form";
import { ToastProps } from "@/components/ui/toast";
import { useEmblaCarousel } from "embla-carousel-react";

// =============================================================================
// NAVIGATION & LAYOUT TYPES
// =============================================================================

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon: string;
  badge?: string;
  hasDropdown?: boolean;
  children?: MenuItem[];
}

export interface LayoutProps {
  children: ReactNode;
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  variant?: "default" | "inset";
  side?: "left" | "right";
  collapsible?: "offcanvas" | "icon" | "none";
}

export interface NavigationItemProps {
  item: MenuItem;
  isCollapsed: boolean;
}

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
}

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: "blue" | "green" | "purple" | "orange" | "red";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface SummaryCardsProps {
  cards: SummaryCardProps[];
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// =============================================================================
// UI COMPONENT TYPES (Shadcn/UI Extensions)
// =============================================================================

// Toast types
export type ToasterToast = ToastProps & {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastActionElement;
};

export type Toast = Omit<ToasterToast, "id">;

export type ToastActionElement = React.ReactElement<
  typeof import("@/components/ui/toast").ToastAction
>;

export interface ToastState {
  toasts: ToasterToast[];
}

export type ToasterProps = React.ComponentProps<typeof import("sonner").Sonner>;

// Form types
export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends string = string,
> = {
  name: TName;
};

export type FormItemContextValue = {
  id: string;
};

// Carousel types
export type CarouselApi = ReturnType<typeof useEmblaCarousel>[1];
export type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
export type CarouselOptions = UseCarouselParameters[0];
export type CarouselPlugin = UseCarouselParameters[1];

export type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

export type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

// Command types
export interface CommandDialogProps extends DialogProps {}

// Pagination types
export type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<"a">;

// Sheet types
export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<
      typeof import("@radix-ui/react-dialog").Content
    >,
    VariantProps<typeof import("class-variance-authority").cva> {
  side?: "top" | "right" | "bottom" | "left";
}

// Sidebar types
export type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

// Chart types
export type ChartContextProps = {
  config: ChartConfig;
};

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  );
};

// Import VariantProps for components that need it
export type { VariantProps } from "class-variance-authority";
