import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@dark/ui", "@dark/profile", "@dark/progress", "@dark/storage", "@dark/supabase-client", "@dark/types"],
};

export default nextConfig;
