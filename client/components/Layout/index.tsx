import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Calendar } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/constants";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useLocalStorage(
    STORAGE_KEYS.SIDEBAR_MINIMIZED,
    false,
  );
  const location = useLocation();

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebarMinimized = () => setSidebarMinimized(!sidebarMinimized);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isMinimized={sidebarMinimized}
        onClose={closeSidebar}
        onToggleMinimized={toggleSidebarMinimized}
        currentPath={location.pathname}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar - Mobile only */}
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
