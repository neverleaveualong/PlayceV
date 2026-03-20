import { create } from "zustand";

const STORAGE_KEY = "playce_recent_searches";
const MAX_ITEMS = 10;

const loadSearches = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

interface RecentSearchState {
  searches: string[];
  addSearch: (keyword: string) => void;
  removeSearch: (keyword: string) => void;
  clearAll: () => void;
}

const useRecentSearchStore = create<RecentSearchState>((set) => ({
  searches: loadSearches(),

  addSearch: (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    set((state) => {
      const filtered = state.searches.filter((s) => s !== trimmed);
      const next = [trimmed, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { searches: next };
    });
  },

  removeSearch: (keyword: string) => {
    set((state) => {
      const next = state.searches.filter((s) => s !== keyword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { searches: next };
    });
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ searches: [] });
  },
}));

export default useRecentSearchStore;
