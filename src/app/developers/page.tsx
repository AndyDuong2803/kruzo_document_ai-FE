import Link from "next/link";
import { FiArrowRight, FiBookOpen, FiCode } from "react-icons/fi";

import Container from "@/components/Container";
import ApiKeyManager from "@/components/developer/ApiKeyManager";

export const metadata = {
  title: "For Developers | Kruzo Document AI",
  description: "Test and integrate the Kruzo Document AI API.",
};

export default function DevelopersPage() {
  return (
    <section className="flex-1 px-5 pb-16 pt-28">
      <Container>
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold text-secondary">For Developers</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Build document processing into your product</h1>
          <p className="mt-3 max-w-2xl text-muted">Send one document with an API key and receive structured JSON that follows your template.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link href="/try/api" className="brand-card rounded-md p-6">
              <FiCode className="h-6 w-6 text-secondary" />
              <h2 className="mt-4 text-xl font-semibold">API Playground</h2>
              <p className="mt-2 text-sm text-muted">Build a request, edit the JSON template, and inspect the raw response.</p>
              <span className="nav-link mt-5 gap-2">Open playground <FiArrowRight /></span>
            </Link>
            <Link href="/docs" className="brand-card rounded-md p-6">
              <FiBookOpen className="h-6 w-6 text-secondary" />
              <h2 className="mt-4 text-xl font-semibold">Documentation</h2>
              <p className="mt-2 text-sm text-muted">Review authentication, request fields, responses, limits, and code examples.</p>
              <span className="nav-link mt-5 gap-2">Read documentation <FiArrowRight /></span>
            </Link>
          </div>
          <ApiKeyManager />

          <section className="border-t border-border py-12">
            <p className="text-sm font-semibold text-primary">Getting started</p>
            <h2 className="mt-1 text-2xl font-semibold">A practical integration</h2>
            <ol className="mt-6 grid overflow-hidden rounded-md border border-border bg-card sm:grid-cols-3">
              {[
                ["1", "Create a key", "Give it a name that matches the system using it."],
                ["2", "Send a file", "Include the file and the JSON shape you want returned."],
                ["3", "Use the response", "Save it, review it, or pass it to the next tool in your workflow."],
              ].map(([number, title, description]) => (
                <li key={number} className="border-b border-border p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                  <span className="text-sm font-bold text-primary">{number}</span>
                  <h3 className="mt-2 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="border-t border-border py-12">
            <h2 className="text-2xl font-semibold">Included by default</h2>
            <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <div><dt className="font-semibold">100 starting credits</dt><dd className="mt-1 text-sm text-muted">One successful document uses one credit. Failed processing is refunded.</dd></div>
              <div><dt className="font-semibold">Execution history</dt><dd className="mt-1 text-sm text-muted">API requests and their structured responses appear in your account history.</dd></div>
              <div><dt className="font-semibold">Custom JSON templates</dt><dd className="mt-1 text-sm text-muted">Choose the fields and repeated rows your application needs.</dd></div>
              <div><dt className="font-semibold">Provider retries</dt><dd className="mt-1 text-sm text-muted">Kruzo can retry processing without charging another credit for the same file.</dd></div>
            </dl>
          </section>
        </div>
      </Container>
    </section>
  );
}
