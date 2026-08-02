"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { FiCheck, FiCopy, FiKey, FiTrash2 } from "react-icons/fi";

import { useAuth } from "@/features/auth/AuthProvider";
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
  type ApiKeyRecord,
} from "@/features/auth/api";

const formatDate = (value: string | null) => {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};

const ApiKeyManager: React.FC = () => {
  const { token, credits } = useAuth();
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [name, setName] = useState("My integration");
  const [newKey, setNewKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadKeys = useCallback(async () => {
    if (!token) return;
    try {
      setKeys((await listApiKeys(token)).items);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not load API keys.");
    }
  }, [token]);

  useEffect(() => {
    void loadKeys();
  }, [loadKeys]);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const created = await createApiKey(token, name);
      setNewKey(created.key);
      setKeys((current) => [created, ...current]);
      setMessage("API key created. Copy it now; the full key will not be shown again.");
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not create the API key.");
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (id: string) => {
    if (!token || busy) return;
    setBusy(true);
    setMessage("");
    try {
      await revokeApiKey(token, id);
      setKeys((current) => current.filter((item) => item.id !== id));
      setMessage("API key revoked.");
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not revoke the API key.");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="api-keys" className="section-anchor border-t border-border py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Access</p>
          <h2 className="mt-1 text-2xl font-semibold">API keys</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Use a key in the <code>X-API-Key</code> header. Keep it on your server, never in public browser code.</p>
        </div>
        {credits && <p className="text-sm font-semibold">{credits.balance} credits remaining</p>}
      </div>

      {!token ? (
        <div className="mt-6 rounded-md border border-border bg-card p-5">
          <p className="font-semibold">Sign in to create an API key.</p>
          <Link href="/login?next=/developers" className="brand-button brand-button-primary mt-4 px-5 py-2.5">Sign in</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <form onSubmit={create} className="rounded-md border border-border bg-card p-5">
            <label className="grid gap-2 text-sm font-semibold">
              Key name
              <input className="form-control" value={name} maxLength={80} onChange={(event) => setName(event.target.value)} />
            </label>
            <button type="submit" disabled={busy || !name.trim()} className="brand-button brand-button-primary mt-4 w-full gap-2 px-4 py-2.5">
              <FiKey aria-hidden="true" />
              Create API key
            </button>
            {newKey && (
              <div className="mt-4 rounded border border-primary bg-[var(--primary-subtle)] p-3">
                <p className="text-xs font-semibold">Copy this key now</p>
                <code className="mt-2 block break-all text-xs">{newKey}</code>
                <button type="button" onClick={() => void copy()} className="brand-button brand-button-secondary mt-3 gap-2 px-3 py-1.5 text-xs">
                  {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
                  {copied ? "Copied" : "Copy key"}
                </button>
              </div>
            )}
            {message && <p className="mt-3 text-sm text-muted" aria-live="polite">{message}</p>}
          </form>

          <div className="overflow-hidden rounded-md border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h3 className="font-semibold">Active keys</h3>
            </div>
            {keys.length === 0 ? (
              <p className="p-5 text-sm text-muted">No API keys yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {keys.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{item.name}</p>
                      <p className="mt-1 text-xs text-muted">
                        {item.key_prefix || "kda_live_"}…{item.last_four || "••••"} · Last used {formatDate(item.last_used_at)}
                      </p>
                    </div>
                    <button type="button" disabled={busy} onClick={() => void revoke(item.id)} className="brand-button brand-button-secondary h-9 shrink-0 gap-2 px-3 text-xs">
                      <FiTrash2 aria-hidden="true" />
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ApiKeyManager;
