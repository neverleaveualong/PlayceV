import { create } from "zustand";

interface SearchState {
  //텍스트 검색
  searchText: string;
  setSearchText: (value: string) => void;

  // 지역
  bigRegions: string[];
  smallRegions: string[];
  setBigRegions: (value: string[]) => void;
  setSmallRegions: (value: string[]) => void;

  // 종목/리그
  sports: string[];
  leagues: string[];
  setSports: (value: string[]) => void;
  setLeagues: (value: string[]) => void;

  // 날짜 필터
  dateFrom: string;
  dateTo: string;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;

  // 정렬 기준
  sort: "distance" | "datetime";
  setSort: (value: "distance" | "datetime") => void;

  // 검색 실행된 파라미터 (React Query queryKey로 사용)
  submittedParams: SubmittedSearchParams | null;
  setSubmittedParams: (params: SubmittedSearchParams | null) => void;

  // 전체 초기화
  reset: () => void;
}

export interface SubmittedSearchParams {
  searchText: string;
  sports: string[];
  leagues: string[];
  bigRegions: string[];
  smallRegions: string[];
  dateFrom: string;
  dateTo: string;
  sort: string;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchText: "",
  bigRegions: [],
  smallRegions: [],
  sports: [],
  leagues: [],
  dateFrom: "",
  dateTo: "",
  sort: "datetime",
  submittedParams: null,

  setSearchText: (value) => set({ searchText: value }),
  setBigRegions: (value) => set({ bigRegions: value }),
  setSmallRegions: (value) => set({ smallRegions: value }),
  setSports: (value) => set({ sports: value }),
  setLeagues: (value) => set({ leagues: value }),
  setDateFrom: (value) => set({ dateFrom: value }),
  setDateTo: (value) => set({ dateTo: value }),
  setSort: (value) => set({ sort: value }),
  setSubmittedParams: (params) => set({ submittedParams: params }),

  reset: () =>
    set({
      searchText: "",
      bigRegions: [],
      smallRegions: [],
      sports: [],
      leagues: [],
      dateFrom: "",
      dateTo: "",
      sort: "datetime",
      submittedParams: null,
    }),
}));
