export type AuthPermission = "account:read" | "api_keys:read" | "api_keys:write";

export type AuthRole = "user" | "admin";

export type AuthUser = {
  name?: string;
  email?: string;
};

export type AuthSession = {
  isAuthenticated: boolean;
  role?: AuthRole;
  user?: AuthUser;
  permissions: AuthPermission[];
};
