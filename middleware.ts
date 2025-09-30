import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value
  const isLoginPage = request.nextUrl.pathname === "/login"
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard")

  // Redirect to dashboard if logged in and trying to access login
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect to login if not logged in and trying to access dashboard
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
}
