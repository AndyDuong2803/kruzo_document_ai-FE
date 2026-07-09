"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { HiArrowRight } from "react-icons/hi2";

import Container from "@/components/Container";

import DocsTopicContent from "./DocsTopicContent";
import { docsTopics, getTopicById, groupedTopics, type DocsTopic } from "./docsData";

const DocsShell: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<DocsTopic>(docsTopics[0]);
  const [copiedLabel, setCopiedLabel] = useState("");

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#", "");
      setSelectedTopic(getTopicById(hash));
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const selectedIndex = useMemo(
    () => docsTopics.findIndex((topic) => topic.id === selectedTopic.id),
    [selectedTopic.id]
  );

  const selectTopic = (topic: DocsTopic) => {
    setSelectedTopic(topic);
    window.history.replaceState(null, "", `/docs#${topic.id}`);
  };

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
    <section className="relative overflow-hidden px-5 pb-16 pt-28 md:pt-32">
      <div className="brand-hero-grid absolute inset-0 -z-10 opacity-60"></div>
      <Container>
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 grid gap-4 lg:grid-cols-[0.32fr_0.68fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Developer documentation</p>
              <h1 className="mt-2 text-3xl font-bold text-foreground md:text-5xl">API Docs</h1>
            </div>
            <div className="lg:max-w-3xl">
              <p className="text-muted">
                Extract structured fields and tables from documents with one template-based OCR endpoint.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link href="/try/api" className="brand-button brand-button-primary button-pop gap-2 px-5 py-2.5">
                  API Integration
                  <HiArrowRight aria-hidden="true" />
                </Link>
                <Link href="/api-keys" className="brand-button brand-button-secondary button-pop px-5 py-2.5">
                  API Keys
                </Link>
              </div>
            </div>
          </div>

          <div className="sticky top-[4.25rem] z-20 mb-5 rounded-2xl border border-border bg-card p-3 shadow-sm lg:hidden">
            <label htmlFor="docs-topic" className="sr-only">Choose docs topic</label>
            <select
              id="docs-topic"
              value={selectedTopic.id}
              onChange={(event) => selectTopic(getTopicById(event.target.value))}
              className="w-full rounded-xl border border-border bg-card-muted px-4 py-3 text-sm font-semibold text-foreground"
            >
              {docsTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.group}: {topic.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid min-w-0 gap-6 lg:grid-cols-[0.28fr_0.72fr]">
            <aside className="hidden h-fit rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-28 lg:block">
              {Object.entries(groupedTopics).map(([group, topics]) => (
                <div key={group} className="mb-5 last:mb-0">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-secondary">{group}</p>
                  <nav className="grid gap-1">
                    {topics.map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        className={clsx(
                          "rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors",
                          selectedTopic.id === topic.id
                            ? "bg-[var(--accent-soft)] text-secondary"
                            : "text-muted hover:bg-card-muted hover:text-foreground"
                        )}
                        onClick={() => selectTopic(topic)}
                      >
                        {topic.label}
                      </button>
                    ))}
                  </nav>
                </div>
              ))}
            </aside>

            <main className="min-w-0">
              <div className="mb-3 flex items-center justify-between gap-3 text-sm text-muted">
                <span>{selectedTopic.group}</span>
                <span>{selectedIndex + 1} / {docsTopics.length}</span>
              </div>
              <article id={selectedTopic.id} className="brand-card min-w-0 rounded-2xl p-5 md:p-7">
                <DocsTopicContent
                  topic={selectedTopic}
                  copiedLabel={copiedLabel}
                  onCopy={copyText}
                />
              </article>
            </main>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DocsShell;
