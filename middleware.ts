import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // NextAuth v5 sätter session-cookie med dessa namn (http / https)
  const token =
    req.cookies.get("authjs.session-token") ??
    req.cookies.get("__Secure-authjs.session-token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
