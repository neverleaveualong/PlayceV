import { create } from "zustand";
import { Dayjs } from "dayjs";

interface BroadcastFormState {
  date: Dayjs | null;
  time: Dayjs | null;
  sportId: number | null;
  leagueId: number | null;
  team1: string | null;
  team2: string | null;
  note: string;
  editingId: number | null;

  setDate: (date: Dayjs | null) => void;
  setTime: (time: Dayjs | null) => void;
  setSport: (sport: string, sportId: number) => void;
  setLeague: (league: string, leagueId: number | null) => void;
  setteam1: (team: string) => void;
  setteam2: (team: string) => void;
  setNote: (note: string) => void;
  setEditingId: (id: number | null) => void;
  resetForm: () => void;
  setInitialForm: (data: Partial<BroadcastFormState>) => void;
}

const useBroadcastFormStore = create<BroadcastFormState>((set) => ({
  date: null,
  time: null,
  sportId: null,
  leagueId: null,
  team1: null,
  team2: null,
  note: "",
  editingId: null,

  setDate: (date) => set({ date }),
  setTime: (time) => set({ time }),
  setSport: (_sport, sportId) => set({ sportId }),
  setLeague: (_league, leagueId) => set({ leagueId }),
  setteam1: (team) => set({ team1: team }),
  setteam2: (team) => set({ team2: team }),
  setNote: (note) => set({ note }),
  setEditingId: (id) => set({ editingId: id }),
  resetForm: () =>
    set({
      date: null,
      time: null,
      sportId: null,
      leagueId: null,
      team1: "",
      team2: "",
      note: "",
    }),
  setInitialForm: (data) => set({ ...data }),
}));

export const handleSportChange = (_sport: string, sportId: number) => {
  useBroadcastFormStore.setState({
    sportId,
    leagueId: null,
    team1: "",
    team2: "",
  });
};

export const handleLeagueChange = (_league: string, leagueId: number | null) => {
  useBroadcastFormStore.setState({
    leagueId,
    team1: "",
    team2: "",
  });
};

export default useBroadcastFormStore;
