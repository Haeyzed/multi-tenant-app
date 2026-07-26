import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { getTenantSubdomainFromHost } from "@/lib/tenant-host"

/**
 * Host-based public URL mapping.
 * Internal routes stay under /tenant/* and /central/*; this only remaps
 * entry paths so tenant hosts never land on central auth.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get("host") ?? ""
  const tenantSubdomain = getTenantSubdomainFromHost(host)

  if (!tenantSubdomain) {
    return NextResponse.next()
  }

  if (pathname === "/" || pathname === "/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/tenant/login"
    return NextResponse.redirect(url)
  }

  if (pathname === "/setup-password") {
    const url = request.nextUrl.clone()
    url.pathname = "/tenant/setup-password"
    return NextResponse.redirect(url)
  }

  if (pathname === "/impersonate") {
    const url = request.nextUrl.clone()
    url.pathname = "/tenant/impersonate"
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith("/central")) {
    const url = request.nextUrl.clone()
    url.pathname = "/tenant/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/setup-password",
    "/impersonate",
    "/central/:path*",
  ],
}
