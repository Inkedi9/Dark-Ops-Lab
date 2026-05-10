import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@dark/ui": path.resolve(__dirname, "../../packages/ui"),
      "@dark/profile": path.resolve(__dirname, "../../packages/profile/src"),
      "@dark/routes": path.resolve(__dirname, "../../packages/routes/src"),
      "@dark/storage": path.resolve(__dirname, "../../packages/storage/src"),
      "@dark/supabase-client": path.resolve(__dirname, "../../packages/supabase-client/src"),
      "@dark/progress": path.resolve(__dirname, "../../packages/progress/src"),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, "../..")],
    },
  },
});
