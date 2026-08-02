import GoogleLoginPanel from "@/features/auth/components/GoogleLoginPanel";
import { sanitizeReturnTo } from "@/features/auth/config";
import { createMetadata, seoRoutes } from "@/lib/seo";

export const metadata = createMetadata(seoRoutes.login);

type LoginPageProps = {
  searchParams?: {
    next?: string | string[];
  };
};

const LoginPage: React.FC<LoginPageProps> = ({ searchParams }) => {
  const rawNext = Array.isArray(searchParams?.next) ? searchParams?.next[0] : searchParams?.next;

  return <GoogleLoginPanel returnTo={sanitizeReturnTo(rawNext || "/upload")} />;
};

export default LoginPage;
