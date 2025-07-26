import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simple test component
function TestPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Debug Test Page</h1>
      <p>This is a working React app!</p>
    </div>
  );
}

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<TestPage />} />
      <Route path="*" element={<div>404 - Page not found</div>} />
    </Routes>
  </BrowserRouter>
);

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
