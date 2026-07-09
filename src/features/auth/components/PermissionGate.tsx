import type React from "react";

import { getServerAuthSession, hasPermissions } from "../session";
import type { AuthPermission } from "../types";

type PermissionGateProps = React.PropsWithChildren<{
  requiredPermissions: AuthPermission[];
  fallback?: React.ReactNode;
}>;

const PermissionGate: React.FC<PermissionGateProps> = ({ children, fallback = null, requiredPermissions }) => {
  const session = getServerAuthSession();

  if (!hasPermissions(session, requiredPermissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGate;
