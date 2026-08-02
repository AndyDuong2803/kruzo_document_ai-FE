import Link from "next/link";
import { FiArrowRight, FiCheck, FiFileText } from "react-icons/fi";

import Container from "./Container";

const Hero: React.FC = () => (
  <section className="border-b border-border bg-hero-background px-5 pb-14 pt-28 md:pb-16 md:pt-32">
    <Container>
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="max-w-xl">
          <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">Turn documents into Excel.</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-muted md:text-lg">
            Choose a document type, add multiple files, and download structured results.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link href="/upload" className="brand-button brand-button-primary gap-2 px-5 py-2.5">Process documents<FiArrowRight /></Link>
            <Link href="/contact" className="brand-button brand-button-secondary px-5 py-2.5">Contact us</Link>
          </div>
          <p className="mt-4 text-sm text-muted">New accounts include 100 document credits.</p>
        </div>

        <div className="brand-card overflow-hidden rounded-md" aria-label="Document processing preview">
          <div className="border-b border-border px-4 py-3"><p className="text-sm font-semibold">Invoice processing</p></div>
          <div className="grid md:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-border p-4 md:border-b-0 md:border-r">
              <p className="text-xs font-semibold text-muted">Selected files</p>
              <div className="mt-3 grid gap-2">
                {["invoice-001.pdf", "invoice-002.pdf", "invoice-003.jpg"].map((file) => (
                  <div key={file} className="flex items-center gap-2 rounded border border-border bg-card-muted p-2.5">
                    <FiFileText className="text-primary" /><span className="min-w-0 flex-1 truncate text-xs font-semibold">{file}</span><FiCheck className="text-green-700" />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-muted">Documents</p>
              <div className="mt-3 overflow-hidden rounded border border-border">
                <div className="grid grid-cols-3 bg-card-muted px-3 py-2 text-xs font-semibold"><span>Invoice number</span><span>Issue date</span><span>Total amount</span></div>
                {[["INV-001", "Jul 18", "$1,250"], ["INV-002", "Jul 19", "$840"], ["INV-003", "Jul 21", "$2,100"]].map((row) => (
                  <div key={row[0]} className="grid grid-cols-3 border-t border-border px-3 py-2 text-xs">{row.map((cell) => <span key={cell} className="truncate">{cell}</span>)}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
