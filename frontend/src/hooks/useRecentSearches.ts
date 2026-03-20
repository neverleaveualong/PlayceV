import { useState, useCallback } from "react";

const STORAGE_KEY = "playce_recent_searches";
const MAX_ITEMS = 10;

const loadSearches = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const useRecentSearches = () => {
  const [searches, setSearches] = useState<string[]>(loadSearches);

  const addSearch = useCallback((keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setSearches((prev) => {
      const filtered = prev.filter((s) => s !== trimmed);
      const next = [trimmed, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeSearch = useCallback((keyword: string) => {
    setSearches((prev) => {
      const next = prev.filter((s) => s !== keyword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSearches([]);
  }, []);

  return { searches, addSearch, removeSearch, clearAll };
};

export default useRecentSearches;
