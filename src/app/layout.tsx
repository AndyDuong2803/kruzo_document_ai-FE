import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Plus_Jakarta_Sans } from "next/font/google";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { siteDetails } from '@/data/siteDetails';
import { canonicalDomain, createMetadata, seoRoutes } from "@/lib/seo";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });

const themeInitScript = `
  (function() {
    try {
      var storedTheme = localStorage.getItem('kruzo-theme');
      var shouldUseDark = storedTheme === 'dark';
      document.documentElement.classList.toggle('dark', shouldUseDark);
      document.documentElement.dataset.theme = shouldUseDark ? 'dark' : 'light';
    } catch (error) {
      document.documentElement.dataset.theme = 'light';
    }
  })();
`;

export const metadata: Metadata = {
  metadataBase: new URL(canonicalDomain),
  applicationName: siteDetails.siteName,
  ...createMetadata(seoRoutes.home),
  icons: {
    icon: siteDetails.siteLogo,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${plusJakartaSans.className} antialiased`}>
        <ToastProvider>
          <AuthProvider>
            {siteDetails.googleAnalyticsId && <GoogleAnalytics gaId={siteDetails.googleAnalyticsId} />}
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
