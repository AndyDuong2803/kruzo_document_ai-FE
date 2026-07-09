import type { AuthPermission } from "./types";

export const loginPath = "/login";
export const defaultAuthenticatedPath = "/try";

export const authSessionCookieName = process.env.KRUZO_SESSION_COOKIE ?? "kruzo_session";
export const authPermissionsCookieName = process.env.KRUZO_PERMISSIONS_COOKIE ?? "kruzo_permissions";
export const authRoleCookieName = process.env.KRUZO_ROLE_COOKIE ?? "kruzo_role";
export const authUserCookieName = process.env.KRUZO_USER_COOKIE ?? "kruzo_user";

export type ProtectedRoute = {
  path: string;
  label: string;
  requiredPermissions: AuthPermission[];
};

export const protectedRoutes: ProtectedRoute[] = [
  {
    path: "/api-keys",
    label: "API Keys",
    requiredPermissions: ["api_keys:read"],
  },
];

export const sanitizeReturnTo = (value?: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return defaultAuthenticatedPath;
  }

  return value;
};

export const getProtectedRouteForPath = (pathname: string) =>
  protectedRoutes.find((route) => pathname === route.path || pathname.startsWith(`${route.path}/`));

export const getLoginRedirectUrl = (returnTo: string) => {
  const params = new URLSearchParams({
    next: sanitizeReturnTo(returnTo),
  });

  return `${loginPath}?${params.toString()}`;
};
