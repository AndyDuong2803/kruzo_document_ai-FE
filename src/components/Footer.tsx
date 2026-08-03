"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { telegramContactUrl, telegramCreditsUrl } from "@/data/product";

const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname === "/login") {
    return (
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-muted">
          <span>© {new Date().getFullYear()} Kruzo Service</span>
          <nav className="flex gap-4" aria-label="Legal">
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <Link href="/terms" className="footer-link">Terms of Use</Link>
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border bg-card">
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-7 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.2fr]">
      <div>
        <Link href="/" className="font-semibold">Kruzo Document AI</Link>
        <p className="mt-2 max-w-xs text-sm leading-6 text-muted">New accounts include 100 credits. One successfully processed file uses one credit.</p>
      </div>
      <nav className="grid content-start gap-2 text-sm" aria-label="Footer resources">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Resources</p>
        <Link href="/upload" className="footer-link">Process documents</Link>
        <Link href="/docs" className="footer-link">API documentation</Link>
        <Link href="/developers#api-keys" className="footer-link">Manage API keys</Link>
      </nav>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Business help</p>
        <p className="mt-2 text-sm leading-6 text-muted">Need a new document type, more credits, or a smoother workflow between the tools your business already uses?</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/contact" className="footer-link">Contact</Link>
          <a href={telegramContactUrl} target="_blank" rel="noreferrer" className="footer-link">Chat on Telegram</a>
          <a href={telegramCreditsUrl} target="_blank" rel="noreferrer" className="footer-link">Buy credits</a>
        </div>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <span className="text-xs text-muted">© {new Date().getFullYear()} Kruzo Service</span>
        <nav className="flex gap-4 text-xs" aria-label="Legal">
          <Link href="/privacy" className="footer-link">Privacy Policy</Link>
          <Link href="/terms" className="footer-link">Terms of Use</Link>
        </nav>
      </div>
    </div>
    </footer>
  );
};

export default Footer;
