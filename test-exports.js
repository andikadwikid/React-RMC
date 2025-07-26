// Quick test to verify exports are working
console.log("Testing hook exports...");

// Test the common hooks exports
try {
  const { useMobile, useDebounce, useToast } = require('./client/hooks/common/index.ts');
  console.log("✓ Common hooks exports work:", { useMobile, useDebounce, useToast });
} catch (error) {
  console.log("✗ Common hooks exports error:", error.message);
}

console.log("Export test complete");
