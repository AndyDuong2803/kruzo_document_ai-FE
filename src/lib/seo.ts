import type { Metadata } from "next";

import { faqs } from "@/data/faq";
import { siteDetails } from "@/data/siteDetails";

export const canonicalDomain = "https://document-ai.kruzo.tech";
export const productionApiDomain = "https://api.smartocr.kruzo.tech";

export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  priority: number;
  index?: boolean;
};

export const seoRoutes = {
  home: {
    path: "/",
    title: "Kruzo Document AI - Documents to Excel",
    description:
      "Upload PDFs or images, choose the information you need, and download a clean Excel file.",
    keywords: [
      "AI document extraction",
      "document to Excel automation",
      "business document processing",
      "scanned forms to Excel",
    ],
    priority: 1,
  },
  try: {
    path: "/upload",
    title: "Process Documents - Kruzo Document AI",
    description:
      "Choose a document type, process files together, and download organized Excel results.",
    keywords: ["document to Excel demo", "AI document extraction demo", "invoice OCR demo"],
    priority: 0.9,
  },
  apiPlayground: {
    path: "/try/api",
    title: "API Playground - Kruzo Document AI",
    description:
      "Test the Kruzo Document AI API with a document file and editable JSON template.",
    keywords: ["document data extraction API", "OCR API playground", "custom schema extraction"],
    priority: 0.8,
  },
  docs: {
    path: "/docs",
    title: "API Documentation - Kruzo Document AI",
    description:
      "Developer documentation for processing documents with Kruzo Document AI.",
    keywords: ["document data extraction API docs", "OCR API documentation", "document extraction developer API"],
    priority: 0.8,
  },
  developers: {
    path: "/developers",
    title: "Developers - Kruzo Document AI",
    description: "Developer tools and documentation for Kruzo Document AI.",
    priority: 0.6,
  },
  contact: {
    path: "/contact",
    title: "Contact - Kruzo Document AI",
    description: "Tell us which documents and Excel output your business needs.",
    priority: 0.7,
  },
  login: {
    path: "/login",
    title: "Sign in to Kruzo Document AI",
    description:
      "Sign in to Kruzo Document AI with email, password, or Google.",
    keywords: ["Kruzo login", "Google login", "document extraction account"],
    priority: 0.6,
    index: false,
  },
} satisfies Record<string, SeoRoute>;

export const absoluteUrl = (path: string) => {
  if (path.startsWith("http")) {
    return path;
  }

  return `${canonicalDomain}${path.startsWith("/") ? path : `/${path}`}`;
};

const sharedImage = {
  url: absoluteUrl("/images/hero-mockup.webp"),
  alt: `${siteDetails.siteName} document extraction interface`,
};

export const createMetadata = (route: SeoRoute): Metadata => ({
  title: route.title,
  description: route.description,
  keywords: route.keywords,
  robots: route.index === false
    ? {
        index: false,
        follow: false,
      }
    : undefined,
  alternates: {
    canonical: absoluteUrl(route.path),
  },
  openGraph: {
    title: route.title,
    description: route.description,
    url: absoluteUrl(route.path),
    siteName: siteDetails.siteName,
    type: "website",
    locale: siteDetails.locale,
    images: [sharedImage],
  },
  twitter: {
    card: "summary_large_image",
    title: route.title,
    description: route.description,
    images: [sharedImage.url],
  },
});

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteDetails.siteName,
  url: canonicalDomain,
  logo: absoluteUrl("/kruzo-mark.svg"),
};

export const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteDetails.siteName,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: canonicalDomain,
  description: seoRoutes.home.description,
};

export const tryWebApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kruzo Document AI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: absoluteUrl(seoRoutes.try.path),
  description: seoRoutes.try.description,
};

export const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};
