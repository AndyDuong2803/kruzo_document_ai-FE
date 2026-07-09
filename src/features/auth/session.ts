import { cookies } from "next/headers";

import {
  authPermissionsCookieName,
  authRoleCookieName,
  authSessionCookieName,
  authUserCookieName,
} from "./config";
import type { AuthPermission, AuthRole, AuthSession, AuthUser } from "./types";

const knownPermissions = new Set<AuthPermission>(["account:read", "api_keys:read", "api_keys:write"]);
const knownRoles = new Set<AuthRole>(["user", "admin"]);

const parsePermissions = (value?: string): AuthPermission[] => {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((permission) => permission.trim())
    .filter((permission): permission is AuthPermission => knownPermissions.has(permission as AuthPermission));
};

const parseRole = (value?: string): AuthRole | undefined => {
  if (!value || !knownRoles.has(value as AuthRole)) {
    return undefined;
  }

  return value as AuthRole;
};

const parseUser = (value?: string): AuthUser | undefined => {
  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as AuthUser;

    return {
      email: typeof parsed.email === "string" ? parsed.email : undefined,
      name: typeof parsed.name === "string" ? parsed.name : undefined,
    };
  } catch {
    return undefined;
  }
};

const getDefaultPermissions = (role?: AuthRole): AuthPermission[] => {
  if (role === "admin") {
    return ["account:read", "api_keys:read", "api_keys:write"];
  }

  return ["account:read", "api_keys:read"];
};

export const getServerAuthSession = (): AuthSession => {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(authSessionCookieName)?.value;

  if (!sessionToken) {
    return {
      isAuthenticated: false,
      permissions: [],
    };
  }

  const role = parseRole(cookieStore.get(authRoleCookieName)?.value) ?? "user";
  const cookiePermissions = parsePermissions(cookieStore.get(authPermissionsCookieName)?.value);
  const permissions = cookiePermissions.length > 0 ? cookiePermissions : getDefaultPermissions(role);

  return {
    isAuthenticated: true,
    role,
    permissions,
    user: parseUser(cookieStore.get(authUserCookieName)?.value),
  };
};

export const hasPermissions = (session: AuthSession, requiredPermissions: AuthPermission[] = []) => {
  if (!session.isAuthenticated) {
    return false;
  }

  return requiredPermissions.every((permission) => session.permissions.includes(permission));
};
