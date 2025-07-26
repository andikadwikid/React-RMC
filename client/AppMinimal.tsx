import React from "react";
import { createRoot } from "react-dom/client";

function MinimalApp() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Minimal React App Test</h1>
      <p>If you can see this, React is mounting correctly.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<MinimalApp />);
