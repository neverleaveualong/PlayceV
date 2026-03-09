import { create } from "zustand";
import type { SelectedSports } from "@/types/staticdata";

interface SportState {
  sport: string;
  selectedLeagues: SelectedSports[];
  setSport: (sport: string) => void;
  setSelectedLeagues: (leagues: SelectedSports[]) => void;
  resetSport: () => void;
}

export const useSportStore = create<SportState>((set) => ({
  sport: "",
  selectedLeagues: [],

  setSport: (sport) =>
    set((prev) => ({ sport, selectedLeagues: prev.selectedLeagues })),

  setSelectedLeagues: (leagues) => set({ selectedLeagues: leagues }),

  resetSport: () => set({ sport: "", selectedLeagues: [] }),
}));
