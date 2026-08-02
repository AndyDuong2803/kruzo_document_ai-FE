"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  getCurrentCredits,
  getCurrentUser,
  type AuthUser,
  type Credits,
} from "./api";

const TOKEN_KEY = "kda-access-token";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  credits: Credits | null;
  loading: boolean;
  setSession: (token: string) => Promise<void>;
  refreshCredits: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setCredits(null);
  }, []);

  const hydrate = useCallback(async (nextToken: string) => {
    const [nextUser, nextCredits] = await Promise.all([
      getCurrentUser(nextToken),
      getCurrentCredits(nextToken),
    ]);
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setCredits(nextCredits);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }
    hydrate(stored)
      .catch(clearSession)
      .finally(() => setLoading(false));
  }, [clearSession, hydrate]);

  const setSession = useCallback(async (nextToken: string) => {
    setLoading(true);
    try {
      await hydrate(nextToken);
    } finally {
      setLoading(false);
    }
  }, [hydrate]);

  const refreshCredits = useCallback(async () => {
    if (!token) return;
    setCredits(await getCurrentCredits(token));
  }, [token]);

  const value = useMemo(
    () => ({ token, user, credits, loading, setSession, refreshCredits, logout: clearSession }),
    [clearSession, credits, loading, refreshCredits, setSession, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
};
