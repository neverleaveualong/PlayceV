import { describe, it, expect, beforeEach } from "vitest";
import { useSearchStore } from "@/stores/searchStore";

beforeEach(() => {
  useSearchStore.getState().reset();
});

describe("searchStore", () => {
  describe("초기 상태", () => {
    it("모든 필드가 초기값", () => {
      const state = useSearchStore.getState();
      expect(state.searchText).toBe("");
      expect(state.bigRegions).toEqual([]);
      expect(state.smallRegions).toEqual([]);
      expect(state.sports).toEqual([]);
      expect(state.leagues).toEqual([]);
      expect(state.dateFrom).toBe("");
      expect(state.dateTo).toBe("");
      expect(state.sort).toBe("distance");
      expect(state.submittedParams).toBe(null);
    });
  });

  describe("개별 setter", () => {
    it("setSearchText", () => {
      useSearchStore.getState().setSearchText("치킨");
      expect(useSearchStore.getState().searchText).toBe("치킨");
    });

    it("setBigRegions", () => {
      useSearchStore.getState().setBigRegions(["서울", "부산"]);
      expect(useSearchStore.getState().bigRegions).toEqual(["서울", "부산"]);
    });

    it("setSmallRegions", () => {
      useSearchStore.getState().setSmallRegions(["강남구"]);
      expect(useSearchStore.getState().smallRegions).toEqual(["강남구"]);
    });

    it("setSports", () => {
      useSearchStore.getState().setSports(["축구"]);
      expect(useSearchStore.getState().sports).toEqual(["축구"]);
    });

    it("setLeagues", () => {
      useSearchStore.getState().setLeagues(["K리그", "프리미어리그"]);
      expect(useSearchStore.getState().leagues).toEqual(["K리그", "프리미어리그"]);
    });

    it("setDateFrom / setDateTo", () => {
      useSearchStore.getState().setDateFrom("2026-03-23");
      useSearchStore.getState().setDateTo("2026-03-30");
      expect(useSearchStore.getState().dateFrom).toBe("2026-03-23");
      expect(useSearchStore.getState().dateTo).toBe("2026-03-30");
    });

    it("setSort", () => {
      useSearchStore.getState().setSort("datetime");
      expect(useSearchStore.getState().sort).toBe("datetime");
    });
  });

  describe("submittedParams", () => {
    it("null → 객체 → null", () => {
      expect(useSearchStore.getState().submittedParams).toBe(null);

      const params = {
        searchText: "치킨",
        sports: ["축구"],
        leagues: ["K리그"],
        bigRegions: ["서울"],
        smallRegions: ["강남구"],
        dateFrom: "2026-03-23",
        dateTo: "2026-03-30",
        sort: "distance",
      };
      useSearchStore.getState().setSubmittedParams(params);
      expect(useSearchStore.getState().submittedParams).toEqual(params);

      useSearchStore.getState().setSubmittedParams(null);
      expect(useSearchStore.getState().submittedParams).toBe(null);
    });
  });

  describe("reset", () => {
    it("모든 상태를 초기값으로 (전체 필드 검증)", () => {
      // 모든 필드 변경
      useSearchStore.getState().setSearchText("치킨");
      useSearchStore.getState().setBigRegions(["서울"]);
      useSearchStore.getState().setSmallRegions(["강남구"]);
      useSearchStore.getState().setSports(["축구"]);
      useSearchStore.getState().setLeagues(["K리그"]);
      useSearchStore.getState().setDateFrom("2026-03-23");
      useSearchStore.getState().setDateTo("2026-03-30");
      useSearchStore.getState().setSort("datetime");
      useSearchStore.getState().setSubmittedParams({
        searchText: "치킨", sports: ["축구"], leagues: ["K리그"],
        bigRegions: ["서울"], smallRegions: ["강남구"],
        dateFrom: "2026-03-23", dateTo: "2026-03-30", sort: "distance",
      });

      // 리셋
      useSearchStore.getState().reset();

      // 전체 필드 검증
      const state = useSearchStore.getState();
      expect(state.searchText).toBe("");
      expect(state.bigRegions).toEqual([]);
      expect(state.smallRegions).toEqual([]);
      expect(state.sports).toEqual([]);
      expect(state.leagues).toEqual([]);
      expect(state.dateFrom).toBe("");
      expect(state.dateTo).toBe("");
      expect(state.sort).toBe("distance");
      expect(state.submittedParams).toBe(null);
    });
  });
});
