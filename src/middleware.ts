import { NextRequest, NextResponse } from "next/server";

import { authSessionCookieName, getLoginRedirectUrl, getProtectedRouteForPath } from "./features/auth/config";

export function middleware(request: NextRequest) {
  const protectedRoute = getProtectedRouteForPath(request.nextUrl.pathname);

  if (!protectedRoute) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(authSessionCookieName)?.value);

  if (hasSession) {
    return NextResponse.next();
  }

  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const loginUrl = new URL(getLoginRedirectUrl(returnTo), request.url);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/api-keys/:path*"],
};
