import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/login", destination: "/central/login", permanent: false },
      { source: "/signup", destination: "/central/signup", permanent: false },
      {
        source: "/forgot-password",
        destination: "/central/forgot-password",
        permanent: false,
      },
      {
        source: "/reset-password",
        destination: "/central/reset-password",
        permanent: false,
      },
      {
        source: "/two-factor",
        destination: "/central/two-factor",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/central/dashboard",
        permanent: false,
      },
      {
        source: "/tenants",
        destination: "/central/tenants",
        permanent: false,
      },
      { source: "/plans", destination: "/central/billing/plans", permanent: false },
      {
        source: "/central/plans",
        destination: "/central/billing/plans",
        permanent: false,
      },
      { source: "/users", destination: "/central/users", permanent: false },
      {
        source: "/tenant",
        destination: "/tenant/dashboard",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
