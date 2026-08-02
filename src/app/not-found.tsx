import type { Metadata } from "next";
import Link from "next/link";
import { FiCompass, FiFileText } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi2";

import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Page not found - Kruzo Document AI",
  description: "The requested Kruzo Document AI page could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

const NotFoundPage: React.FC = () => {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-28 md:pt-32">
      <div className="brand-hero-grid absolute inset-0 -z-10 opacity-70"></div>
      <Container>
        <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">404</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold text-foreground md:text-6xl">This page is not available</h1>
            <p className="mt-4 max-w-xl text-muted">
              The link may be outdated, or the workspace page may not exist yet.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/try" className="brand-button brand-button-primary button-pop gap-2 px-5 py-2.5">
                Try document extraction
                <HiArrowRight aria-hidden="true" />
              </Link>
              <Link href="/docs" className="brand-button brand-button-secondary button-pop px-5 py-2.5">
                Read API docs
              </Link>
            </div>
          </div>

          <div className="brand-card rounded-xl p-5 md:p-7">
            <div className="brand-icon mb-5 flex h-12 w-12 items-center justify-center rounded-full">
              <FiCompass size={22} aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Available areas</h2>
            <div className="mt-5 grid gap-3">
              <Link href="/" className="flex items-center justify-between rounded-xl border border-border bg-card-muted p-4 transition hover:border-[var(--accent-border)]">
                <span className="font-semibold">Homepage</span>
                <HiArrowRight aria-hidden="true" />
              </Link>
              <Link href="/try" className="flex items-center justify-between rounded-xl border border-border bg-card-muted p-4 transition hover:border-[var(--accent-border)]">
                <span className="font-semibold">Public extraction demo</span>
                <HiArrowRight aria-hidden="true" />
              </Link>
              <Link href="/docs" className="flex items-center justify-between rounded-xl border border-border bg-card-muted p-4 transition hover:border-[var(--accent-border)]">
                <span className="flex items-center gap-2 font-semibold">
                  <FiFileText aria-hidden="true" />
                  API documentation
                </span>
                <HiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default NotFoundPage;
