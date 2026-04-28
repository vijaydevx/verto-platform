import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@supabase")) return "supabase";
            if (id.includes("@tanstack")) return "tanstack";
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("react-router")) return "router";
            if (id.includes("lucide-react")) return "icons";
            if (id.includes("zod")) return "zod";
            if (id.includes("react-dom") || id.includes("/react/")) return "react";
          }
          return undefined;
        },
      },
    },
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});
