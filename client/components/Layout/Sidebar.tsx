import { memo, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";
import { NAVIGATION_ITEMS, ICON_MAP } from "@/constants";
import type { MenuItem } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onToggleMinimized: () => void;
  currentPath: string;
}

interface NavigationItemProps {
  item: MenuItem;
  isMinimized: boolean;
  currentPath: string;
  onNavigate: () => void;
  dropdownStates: Record<string, boolean>;
  onToggleDropdown: (itemId: string) => void;
}

const NavigationItem = memo(function NavigationItem({
  item,
  isMinimized,
  currentPath,
  onNavigate,
  dropdownStates,
  onToggleDropdown,
}: NavigationItemProps) {
  const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];
  const isActive = item.href ? isActiveRoute(currentPath, item.href) : false;
  const isParentActiveState = item.children
    ? isParentActive(item.children, currentPath)
    : false;
  const isDropdownOpen = dropdownStates[item.id] || false;

  if (item.hasDropdown && item.children) {
    return (
      <div className="space-y-1">
        {/* Parent dropdown item */}
        <button
          onClick={() => onToggleDropdown(item.id)}
          title={isMinimized ? item.label : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isParentActiveState
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          } ${isMinimized ? "justify-center" : ""}`}
        >
          <IconComponent className="w-5 h-5 flex-shrink-0" />
          {!isMinimized && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {isDropdownOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </>
          )}
        </button>

        {/* Dropdown children */}
        {!isMinimized && isDropdownOpen && (
          <div className="pl-8 space-y-1">
            {item.children.map((child) => {
              const ChildIconComponent =
                ICON_MAP[child.icon as keyof typeof ICON_MAP];
              const isChildActive = child.href
                ? isActiveRoute(currentPath, child.href)
                : false;

              return (
                <Link
                  key={child.id}
                  to={child.href || "#"}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isChildActive
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <ChildIconComponent className="w-4 h-4 flex-shrink-0" />
                  <span>{child.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Regular menu item (non-dropdown)
  return (
    <Link
      to={item.href || "#"}
      onClick={onNavigate}
      title={isMinimized ? item.label : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      } ${isMinimized ? "justify-center" : ""}`}
    >
      <IconComponent className="w-5 h-5 flex-shrink-0" />
      {!isMinimized && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <Badge
              variant={isActive ? "default" : "secondary"}
              className="text-xs"
            >
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );
});

export const Sidebar = memo(function Sidebar({
  isOpen,
  isMinimized,
  onClose,
  onToggleMinimized,
  currentPath,
}: SidebarProps) {
  const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>(
    {},
  );

  const toggleDropdown = (itemId: string) => {
    if (isMinimized) return; // Don't allow dropdown in minimized mode

    setDropdownStates((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const navigationItems = useMemo(() => NAVIGATION_ITEMS, []);

  return (
    <div
      className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 ${isMinimized ? "w-16" : "w-64"} lg:h-screen`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div
            className={`flex items-center gap-3 ${
              isMinimized ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!isMinimized && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">RiskMgmt</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Desktop minimize toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex"
              onClick={onToggleMinimized}
            >
              {isMinimized ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto min-h-0">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isMinimized={isMinimized}
              currentPath={currentPath}
              onNavigate={onClose}
              dropdownStates={dropdownStates}
              onToggleDropdown={toggleDropdown}
            />
          ))}
        </nav>

        {/* Footer - Sticky at bottom */}
        <div className="p-4 border-t mt-auto">
          <div
            className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${
              isMinimized ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            {!isMinimized && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 truncate">
                  admin@company.com
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// Helper functions
function isActiveRoute(currentPath: string, href: string): boolean {
  if (href === "/") {
    return currentPath === "/";
  }
  return currentPath.startsWith(href);
}

function isParentActive(children: MenuItem[], currentPath: string): boolean {
  return children.some(
    (child) => child.href && isActiveRoute(currentPath, child.href),
  );
}
