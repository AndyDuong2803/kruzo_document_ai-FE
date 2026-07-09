import type React from "react";

import { getServerAuthSession, hasPermissions } from "../session";
import type { AuthPermission } from "../types";
import AccessRequiredPanel from "./AccessRequiredPanel";

type RequireAuthProps = React.PropsWithChildren<{
  requiredPermissions?: AuthPermission[];
  returnTo: string;
}>;

const RequireAuth: React.FC<RequireAuthProps> = ({ children, requiredPermissions = [], returnTo }) => {
  const session = getServerAuthSession();

  if (!session.isAuthenticated) {
    return <AccessRequiredPanel returnTo={returnTo} />;
  }

  if (!hasPermissions(session, requiredPermissions)) {
    return (
      <AccessRequiredPanel
        returnTo={returnTo}
        title="Permission required"
        message="Your account is signed in, but it does not have permission to open this workspace area yet."
      />
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
