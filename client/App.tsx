import "./global.css";

import { createRoot, type Root } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import Layout from "./components/Layout";

// Extend HTMLElement to include our custom _reactRoot property
declare global {
  interface HTMLElement {
    _reactRoot?: Root;
  }
}

// Dashboard pages
import Dashboard from "./pages/dashboard/SafeDashboard";

// Project pages
import Projects from "./pages/project/Projects";

// Simple NotFound component
function NotFound() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/projects" element={<Layout><Projects /></Layout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
);

const container = document.getElementById("root")!;

// Only create root once and handle HMR properly
if (!container._reactRoot) {
  const root = createRoot(container);
  container._reactRoot = root;
  container._reactRoot.render(<App />);
} else {
  // In development with HMR, just re-render
  container._reactRoot.render(<App />);
}
