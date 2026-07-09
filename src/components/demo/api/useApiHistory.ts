"use client";

import { useMemo, useState } from "react";

import type { ApiHistoryItem } from "./types";

const HISTORY_PAGE_SIZE = 10;

const timeLabel = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export const useApiHistory = () => {
  const [history, setHistory] = useState<ApiHistoryItem[]>([]);
  const [historyPage, setHistoryPage] = useState(0);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  const activeHistoryItem = useMemo(
    () => history.find((item) => item.id === activeHistoryId) ?? null,
    [activeHistoryId, history]
  );
  const historyTotalPages = Math.max(1, Math.ceil(history.length / HISTORY_PAGE_SIZE));
  const boundedHistoryPage = Math.min(historyPage, historyTotalPages - 1);
  const historyPageItems = history.slice(
    boundedHistoryPage * HISTORY_PAGE_SIZE,
    boundedHistoryPage * HISTORY_PAGE_SIZE + HISTORY_PAGE_SIZE
  );

  const pushHistory = (item: Omit<ApiHistoryItem, "id" | "timeLabel">) => {
    setHistory((current) => [
      {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timeLabel: timeLabel(),
      },
      ...current,
    ]);
    setHistoryPage(0);
  };

  return {
    activeHistoryItem,
    boundedHistoryPage,
    history,
    historyPageItems,
    historyTotalPages,
    pushHistory,
    setActiveHistoryId,
    setHistoryPage,
  };
};
