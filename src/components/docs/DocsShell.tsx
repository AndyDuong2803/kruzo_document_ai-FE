"use client";

import Link from "next/link";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";

import Container from "@/components/Container";
import { CodeBlock, DataTable } from "./DocsPrimitives";
import {
  curlExample,
  docsSections,
  errorCodes,
  javascriptExample,
  publicEndpoint,
  pythonExample,
  requestParameters,
  sampleResponse,
  sampleSchema,
} from "./docsData";

const DocsShell: React.FC = () => {
  const [copiedLabel, setCopiedLabel] = useState("");

  const copyText = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLabel(label);
      window.setTimeout(() => setCopiedLabel(""), 1400);
    } catch {
      setCopiedLabel("");
    }
  };

  return (
    <section className="px-5 pb-14 pt-24 md:pt-28">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-secondary">Documentation</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Kruzo API docs</h1>
            <p className="mt-3 text-muted">One multipart endpoint for template-based document extraction.</p>
            <Link href="/try/api" className="brand-button brand-button-primary mt-5 gap-2 px-5 py-2.5">
              Open API Playground
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>

          <nav className="sticky top-16 z-20 mt-8 flex gap-1 overflow-x-auto border-y border-border bg-background py-2" aria-label="Documentation sections">
            {docsSections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="shrink-0 rounded-md px-3 py-2 text-sm font-semibold text-muted hover:bg-card hover:text-foreground">
                {section.label}
              </a>
            ))}
          </nav>

          <div className="divide-y divide-border">
            <section id="quickstart" className="section-anchor py-10">
              <h2 className="text-2xl font-semibold">Quickstart</h2>
              <ol className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-3">
                <li className="border-l-2 border-primary pl-3"><strong className="block text-foreground">1. Define fields</strong>Create or choose a JSON template.</li>
                <li className="border-l-2 border-primary pl-3"><strong className="block text-foreground">2. Send document</strong>Post the file and schema_sample.</li>
                <li className="border-l-2 border-primary pl-3"><strong className="block text-foreground">3. Read response</strong>Inspect the returned fields and tables.</li>
              </ol>
            </section>

            <section id="request" className="section-anchor py-10">
              <h2 className="text-2xl font-semibold">Request and template</h2>
              <div className="mt-4 rounded-lg border border-border p-4 text-sm">
                <p><strong>POST</strong>&nbsp;&nbsp;<code className="break-all text-muted">{publicEndpoint}</code></p>
                <p className="mt-2 text-muted">Content-Type: multipart/form-data</p>
              </div>
              <div className="mt-5"><DataTable headers={["Parameter", "Required", "Description"]} rows={requestParameters} /></div>
              <div className="mt-5"><CodeBlock label="JSON template" code={sampleSchema} copied={copiedLabel === "JSON template"} onCopy={copyText} /></div>
            </section>

            <section id="response" className="section-anchor py-10">
              <h2 className="text-2xl font-semibold">Response</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Responses use success, error_code, message, and data. The data value follows the submitted template and preserves repeated rows as arrays.
              </p>
              <div className="mt-5"><CodeBlock label="Sample response" code={sampleResponse} copied={copiedLabel === "Sample response"} onCopy={copyText} /></div>
            </section>

            <section id="errors" className="section-anchor py-10">
              <h2 className="text-2xl font-semibold">Errors and limits</h2>
              <div className="mt-5"><DataTable headers={["Status", "Code", "Meaning"]} rows={errorCodes} /></div>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div className="border-l-2 border-border pl-3"><dt className="font-semibold">Supported files</dt><dd className="mt-1 text-muted">PDF, JPG, PNG, WEBP</dd></div>
                <div className="border-l-2 border-border pl-3"><dt className="font-semibold">Document size</dt><dd className="mt-1 text-muted">10 MB backend default stated by the current API reference.</dd></div>
              </dl>
            </section>

            <section id="examples" className="section-anchor py-10">
              <h2 className="text-2xl font-semibold">Examples</h2>
              <div className="mt-5 grid gap-4">
                {[
                  ["cURL", curlExample],
                  ["JavaScript", javascriptExample],
                  ["Python", pythonExample],
                ].map(([label, code]) => (
                  <details key={label} className="overflow-hidden rounded-md border border-border bg-card">
                    <summary className="cursor-pointer px-4 py-3 font-semibold">{label}</summary>
                    <div className="border-t border-border">
                      <CodeBlock label={label} code={code} copied={copiedLabel === label} onCopy={copyText} />
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DocsShell;
