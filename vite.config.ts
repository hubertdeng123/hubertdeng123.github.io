import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const isServerBuild = process.env.BUILD_TARGET === "server";

export default defineConfig({
  plugins: [react()],
  appType: "mpa",
  build: {
    outDir: isServerBuild ? "dist/server" : "dist",
    emptyOutDir: !isServerBuild,
    ssr: isServerBuild ? "src/entry-server.tsx" : undefined,
    rollupOptions: isServerBuild
      ? {
          input: "src/entry-server.tsx"
        }
      : undefined
  }
});
