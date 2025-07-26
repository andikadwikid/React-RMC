import "./global.css";

import { createRoot, type Root } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simple test components
function TestDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>This would be the dashboard page</p>
    </div>
  );
}

function TestNotFound() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>404 - Page Not Found</h1>
    </div>
  );
}

// Extend HTMLElement to include our custom _reactRoot property
declare global {
  interface HTMLElement {
    _reactRoot?: Root;
  }
}

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<TestDashboard />} />
      <Route path="*" element={<TestNotFound />} />
    </Routes>
  </BrowserRouter>
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
