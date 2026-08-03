import Link from "next/link";
import type { ReactNode } from "react";

import Container from "@/components/Container";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  summary: string;
  updatedAt: string;
  sections: LegalSection[];
};

const LegalDocument: React.FC<LegalDocumentProps> = ({ eyebrow, title, summary, updatedAt, sections }) => (
  <section className="px-5 pb-20 pt-28">
    <Container>
      <article className="mx-auto max-w-4xl">
        <header className="border-b border-border pb-8">
          <p className="text-sm font-semibold text-primary">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{title}</h1>
          <p className="mt-4 max-w-3xl leading-7 text-muted">{summary}</p>
          <p className="mt-4 text-sm text-muted">Last updated: {updatedAt}</p>
        </header>

        <nav className="border-b border-border py-6" aria-label={`${title} contents`}>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">On this page</p>
          <ol className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="footer-link">{index + 1}. {section.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="divide-y divide-border">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="section-anchor py-8">
              <h2 className="text-xl font-semibold md:text-2xl">{index + 1}. {section.title}</h2>
              <div className="mt-4 space-y-4 leading-7 text-muted [&_a]:font-semibold [&_a]:text-primary [&_li]:pl-1 [&_strong]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <div className="border-t border-border pt-8 text-sm text-muted">
          Questions about this document? Visit our <Link href="/contact" className="font-semibold text-primary">Contact page</Link>.
        </div>
      </article>
    </Container>
  </section>
);

export default LegalDocument;
