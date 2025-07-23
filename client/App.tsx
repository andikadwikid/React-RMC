import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectTimeline from "./pages/ProjectTimeline";
import Verification from "./pages/Verification";
import RiskCaptureVerification from "./pages/RiskCaptureVerification";
import VerifierDashboard from "./pages/VerifierDashboard";
import MasterProvinces from "./pages/MasterProvinces";
import MasterCategories from "./pages/MasterCategories";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Index />
                </Layout>
              }
            />
            <Route
              path="/projects"
              element={
                <Layout>
                  <Projects />
                </Layout>
              }
            />
            <Route
              path="/projects/create"
              element={
                <Layout>
                  <CreateProject />
                </Layout>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <Layout>
                  <ProjectDetail />
                </Layout>
              }
            />
            <Route
              path="/projects/:projectId/timeline"
              element={
                <Layout>
                  <ProjectTimeline />
                </Layout>
              }
            />
            <Route
              path="/master-data/provinces"
              element={
                <Layout>
                  <MasterProvinces />
                </Layout>
              }
            />
            <Route
              path="/master-data/categories"
              element={
                <Layout>
                  <MasterCategories />
                </Layout>
              }
            />
            <Route
              path="/master-data/clients"
              element={
                <Layout>
                  <PlaceholderPage
                    title="Master Data Client"
                    description="Kelola data client dan perusahaan partner. Fitur ini akan segera tersedia."
                  />
                </Layout>
              }
            />
            <Route
              path="/master-data/user-roles"
              element={
                <Layout>
                  <PlaceholderPage
                    title="Master Data User Role"
                    description="Kelola role dan permission user sistem. Fitur ini akan segera tersedia."
                  />
                </Layout>
              }
            />
            <Route
              path="/master-data/project-status"
              element={
                <Layout>
                  <PlaceholderPage
                    title="Master Data Status Project"
                    description="Kelola status dan tahapan project. Fitur ini akan segera tersedia."
                  />
                </Layout>
              }
            />
            <Route
              path="/risk-management"
              element={
                <Layout>
                  <PlaceholderPage
                    title="Risk Management"
                    description="Kelola dan monitor risiko proyek secara detail. Fitur ini akan segera tersedia."
                  />
                </Layout>
              }
            />
            <Route
              path="/financial"
              element={
                <Layout>
                  <PlaceholderPage
                    title="Financial"
                    description="Monitor keuangan dan invoice proyek. Fitur ini akan segera tersedia."
                  />
                </Layout>
              }
            />
            <Route
              path="/reports"
              element={
                <Layout>
                  <PlaceholderPage
                    title="Reports"
                    description="Generate berbagai laporan proyek dan risiko. Fitur ini akan segera tersedia."
                  />
                </Layout>
              }
            />
            <Route
              path="/analytics"
              element={
                <Layout>
                  <PlaceholderPage
                    title="Analytics"
                    description="Analisis mendalam performa proyek dan trends. Fitur ini akan segera tersedia."
                  />
                </Layout>
              }
            />
            <Route
              path="/users"
              element={
                <Layout>
                  <PlaceholderPage
                    title="User Management"
                    description="Kelola user dan permissions sistem. Fitur ini akan segera tersedia."
                  />
                </Layout>
              }
            />
            <Route
              path="/verification"
              element={
                <Layout>
                  <Verification />
                </Layout>
              }
            />
            <Route
              path="/verifier-dashboard"
              element={
                <Layout>
                  <VerifierDashboard />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <PlaceholderPage
                    title="Settings"
                    description="Konfigurasi sistem dan preferences. Fitur ini akan segera tersedia."
                  />
                </Layout>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFound />
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);
