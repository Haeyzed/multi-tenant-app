import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "date-fns",
      "@tanstack/react-table",
      "@tanstack/react-query",
      "@base-ui/react",
    ],
  },
}

export default nextConfig
