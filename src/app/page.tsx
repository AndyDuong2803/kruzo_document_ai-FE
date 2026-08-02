import Link from "next/link";
import {
  FiArrowRight,
  FiAward,
  FiClipboard,
  FiCreditCard,
  FiFileText,
  FiHome,
  FiShoppingBag,
} from "react-icons/fi";

import Container from "@/components/Container";
import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import StructuredData from "@/components/StructuredData";
import { documentPresets } from "@/config/document-presets";
import {
  createMetadata,
  faqPageJsonLd,
  organizationJsonLd,
  seoRoutes,
  softwareApplicationJsonLd,
} from "@/lib/seo";

export const metadata = createMetadata(seoRoutes.home);

const presetIcons = {
  "file-text": FiFileText,
  receipt: FiShoppingBag,
  "id-card": FiCreditCard,
  bank: FiHome,
  clipboard: FiClipboard,
  award: FiAward,
};

const HomePage: React.FC = () => (
  <>
    <StructuredData data={[organizationJsonLd, softwareApplicationJsonLd, faqPageJsonLd]} />
    <Hero />
    <Container>
      <section id="workflow" className="section-anchor py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">How it works</p>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">From document to Excel in three steps</h2>
        </div>
        <ol className="mt-7 grid overflow-hidden rounded-md border border-border bg-card md:grid-cols-3">
          {["Choose a document type", "Add your files", "Download Excel"].map((step, index) => (
            <li key={step} className="flex items-center gap-4 border-b border-border p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-primary bg-[var(--primary-subtle)] text-sm font-bold text-primary">{index + 1}</span>
              <h3 className="text-base font-semibold">{step}</h3>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Ready to process</p>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Supported document types</h2>
        </div>
        <div className="mt-7 grid overflow-hidden rounded-md border border-border bg-card sm:grid-cols-2 lg:grid-cols-3">
          {documentPresets.map((preset) => {
            const Icon = presetIcons[preset.icon as keyof typeof presetIcons] ?? FiFileText;
            return (
              <Link key={preset.id} href={`/upload?preset=${preset.id}`} className="group flex min-h-24 items-center gap-4 border-b border-border p-5 last:border-b-0 hover:bg-card-muted sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0">
                <span className="brand-icon flex h-10 w-10 shrink-0 items-center justify-center rounded">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold group-hover:text-primary">{preset.label}</span>
                  {preset.description && <span className="mt-0.5 block text-xs text-muted">{preset.description}</span>}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border py-12 md:py-16">
        <div className="grid gap-8 rounded-md border border-border bg-card p-6 md:grid-cols-[1fr_1fr_auto] md:items-start md:p-8">
          <div>
            <h2 className="text-xl font-semibold">Need another document type?</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Send us a sample document and the Excel format you need.</p>
          </div>
          <div className="md:border-l md:border-border md:pl-8">
            <h2 className="text-xl font-semibold">Want your tools to work together?</h2>
            <p className="mt-2 text-sm leading-6 text-muted">If your team copies information between email, spreadsheets, accounting tools, or other systems, we can build a clear workflow that moves it for you.</p>
          </div>
          <Link href="/contact" className="brand-button brand-button-primary px-5 py-2.5">Talk to us</Link>
        </div>
      </section>

      <section className="border-y border-border py-6">
        <Link href="/developers" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground">
          Building an integration? View developer tools.
          <FiArrowRight aria-hidden="true" />
        </Link>
      </section>

      <FAQ />
    </Container>
  </>
);

export default HomePage;
