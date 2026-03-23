import { describe, it, expect } from "vitest";
import { getUpdatedLeagueSelection } from "@/utils/sportUtils";

describe("getUpdatedLeagueSelection", () => {
  describe("빈 배열에서 시작", () => {
    it("특정 리그 추가", () => {
      const result = getUpdatedLeagueSelection([], "축구", "K리그");
      expect(result).toEqual([{ sport: "축구", league: "K리그" }]);
    });

    it("전체 선택", () => {
      const result = getUpdatedLeagueSelection([], "축구", "전체");
      expect(result).toEqual([{ sport: "축구", league: "전체" }]);
    });
  });

  describe("토글 동작", () => {
    it("이미 있는 리그 클릭 → 제거", () => {
      const current = [{ sport: "축구", league: "K리그" }];
      const result = getUpdatedLeagueSelection(current, "축구", "K리그");
      expect(result).toEqual([]);
    });

    it("없는 리그 클릭 → 추가", () => {
      const current = [{ sport: "축구", league: "K리그" }];
      const result = getUpdatedLeagueSelection(current, "축구", "프리미어리그");
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ sport: "축구", league: "프리미어리그" });
    });
  });

  describe("전체 선택 동작", () => {
    it("개별 리그 있을 때 전체 선택 → 개별 제거 + 전체 추가", () => {
      const current = [
        { sport: "축구", league: "K리그" },
        { sport: "축구", league: "프리미어리그" },
      ];
      const result = getUpdatedLeagueSelection(current, "축구", "전체");
      expect(result).toEqual([{ sport: "축구", league: "전체" }]);
    });

    it("전체 상태에서 전체 다시 클릭 → 전체 해제 (토글 off)", () => {
      const current = [{ sport: "축구", league: "전체" }];
      const result = getUpdatedLeagueSelection(current, "축구", "전체");
      expect(result).toEqual([]);
    });

    it("전체 상태에서 개별 선택 → 전체 제거 + 개별 추가", () => {
      const current = [{ sport: "축구", league: "전체" }];
      const result = getUpdatedLeagueSelection(current, "축구", "K리그");
      expect(result).toEqual([{ sport: "축구", league: "K리그" }]);
    });
  });

  describe("다른 종목에 영향 없음", () => {
    it("축구 전체 선택해도 야구는 유지", () => {
      const current = [
        { sport: "축구", league: "K리그" },
        { sport: "야구", league: "KBO" },
      ];
      const result = getUpdatedLeagueSelection(current, "축구", "전체");
      expect(result).toContainEqual({ sport: "야구", league: "KBO" });
      expect(result).toContainEqual({ sport: "축구", league: "전체" });
      expect(result).toHaveLength(2);
    });
  });

  describe("원본 불변성", () => {
    it("원본 배열을 수정하지 않음", () => {
      const current = [{ sport: "축구", league: "K리그" }];
      const copy = [...current];
      getUpdatedLeagueSelection(current, "축구", "프리미어리그");
      expect(current).toEqual(copy);
    });
  });
});
