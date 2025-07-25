import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  FileText,
  Users,
  Settings,
  Shield,
  DollarSign,
  Calendar,
  Menu,
  X,
  Home,
  Building2,
  AlertTriangle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Database,
  MapPin,
  Folder,
  Tag,
  Globe,
} from "lucide-react";

import type { LayoutProps } from "@/types";

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ComponentType<any>;
  badge?: string;
  hasDropdown?: boolean;
  children?: MenuItem[];
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>(
    {},
  );
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      id: "projects",
      label: "List Project",
      href: "/projects",
      icon: Building2,
      badge: "28",
    },
    {
      id: "risk-officer",
      label: "Risk Officer",
      icon: AlertTriangle,
      hasDropdown: true,
      children: [
        {
          id: "verify-dashboard",
          label: "Dashbaord Risk Officer",
          href: "/verify-dashboard",
          icon: TrendingUp,
        },
        {
          id: "verify-readiness",
          label: "Verifikasi Readiness",
          href: "/verify-readiness",
          icon: TrendingUp,
        },
        {
          id: "verify-riskcapture",
          label: "Verifikasi Risk Capture",
          href: "/verify-riskcapture",
          icon: TrendingUp,
        },
      ],
    },
    {
      id: "master-data",
      label: "Master Data",
      icon: Database,
      hasDropdown: true,
      children: [
        {
          id: "master-provinces",
          label: "Master Provinsi",
          href: "/master-data/provinces",
          icon: MapPin,
        },
        {
          id: "master-categories",
          label: "Master Kategori Project",
          href: "/master-data/categories",
          icon: Folder,
        },
        {
          id: "master-clients",
          label: "Master Client",
          href: "/master-data/clients",
          icon: Building2,
        },
        {
          id: "master-users",
          label: "Master User Role",
          href: "/master-data/user-roles",
          icon: Users,
        },
        {
          id: "master-status",
          label: "Master Status Project",
          href: "/master-data/project-status",
          icon: Tag,
        },
      ],
    },
    {
      id: "risk-management",
      label: "Risk Management",
      href: "/risk-management",
      icon: Shield,
    },
    {
      id: "financial",
      label: "Financial",
      href: "/financial",
      icon: DollarSign,
    },
    {
      id: "reports",
      label: "Reports",
      href: "/reports",
      icon: BarChart3,
    },
    {
      id: "analytics",
      label: "Analytics",
      href: "/analytics",
      icon: TrendingUp,
    },
    {
      id: "users",
      label: "User Management",
      href: "/users",
      icon: Users,
    },
    {
      id: "settings",
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const isParentActive = (children: MenuItem[]) => {
    return children.some((child) => child.href && isActiveRoute(child.href));
  };

  const toggleDropdown = (itemId: string) => {
    if (sidebarMinimized) return; // Don't allow dropdown in minimized mode

    setDropdownStates((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${sidebarMinimized ? "w-16" : "w-64"} lg:h-screen`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div
              className={`flex items-center gap-3 ${sidebarMinimized ? "justify-center" : ""}`}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {!sidebarMinimized && (
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
                onClick={() => setSidebarMinimized(!sidebarMinimized)}
              >
                {sidebarMinimized ? (
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
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto min-h-0">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = item.href ? isActiveRoute(item.href) : false;
              const isParentActiveState = item.children
                ? isParentActive(item.children)
                : false;
              const isDropdownOpen = dropdownStates[item.id] || false;

              if (item.hasDropdown && item.children) {
                return (
                  <div key={item.id} className="space-y-1">
                    {/* Parent dropdown item */}
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      title={sidebarMinimized ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isParentActiveState
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      } ${sidebarMinimized ? "justify-center" : ""}`}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      {!sidebarMinimized && (
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
                    {!sidebarMinimized && isDropdownOpen && (
                      <div className="pl-8 space-y-1">
                        {item.children.map((child) => {
                          const ChildIconComponent = child.icon;
                          const isChildActive = child.href
                            ? isActiveRoute(child.href)
                            : false;

                          return (
                            <Link
                              key={child.id}
                              to={child.href || "#"}
                              onClick={() => setSidebarOpen(false)}
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
                  key={item.id}
                  to={item.href || "#"}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarMinimized ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  } ${sidebarMinimized ? "justify-center" : ""}`}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!sidebarMinimized && (
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
            })}
          </nav>

          {/* Footer - Sticky at bottom */}
          <div className="p-4 border-t mt-auto">
            <div
              className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${
                sidebarMinimized ? "justify-center" : ""
              }`}
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
              {!sidebarMinimized && (
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b lg:hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-1">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}
              </Badge>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
