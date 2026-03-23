import { describe, it, expect } from "vitest";
import { getUpdatedRegionSelection } from "@/utils/regionUtils";

describe("getUpdatedRegionSelection", () => {
  describe("빈 배열에서 시작", () => {
    it("특정 지역 추가", () => {
      const result = getUpdatedRegionSelection([], "서울", "강남구");
      expect(result).toEqual([{ bigRegion: "서울", smallRegion: "강남구" }]);
    });

    it("전체 선택", () => {
      const result = getUpdatedRegionSelection([], "서울", "전체");
      expect(result).toEqual([{ bigRegion: "서울", smallRegion: "전체" }]);
    });
  });

  describe("토글 동작", () => {
    it("이미 있는 지역 클릭 → 제거", () => {
      const current = [{ bigRegion: "서울", smallRegion: "강남구" }];
      const result = getUpdatedRegionSelection(current, "서울", "강남구");
      expect(result).toEqual([]);
    });

    it("없는 지역 클릭 → 추가", () => {
      const current = [{ bigRegion: "서울", smallRegion: "강남구" }];
      const result = getUpdatedRegionSelection(current, "서울", "서초구");
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ bigRegion: "서울", smallRegion: "서초구" });
    });
  });

  describe("전체 선택 동작", () => {
    it("개별 지역들 있을 때 전체 선택 → 개별 제거 + 전체 추가", () => {
      const current = [
        { bigRegion: "서울", smallRegion: "강남구" },
        { bigRegion: "서울", smallRegion: "서초구" },
      ];
      const result = getUpdatedRegionSelection(current, "서울", "전체");
      expect(result).toEqual([{ bigRegion: "서울", smallRegion: "전체" }]);
    });

    it("전체 상태에서 전체 다시 클릭 → 전체 유지 (toggle-off 없음)", () => {
      const current = [{ bigRegion: "서울", smallRegion: "전체" }];
      const result = getUpdatedRegionSelection(current, "서울", "전체");
      expect(result).toEqual([{ bigRegion: "서울", smallRegion: "전체" }]);
    });

    it("전체 상태에서 개별 선택 → 전체 제거 + 개별 추가", () => {
      const current = [{ bigRegion: "서울", smallRegion: "전체" }];
      const result = getUpdatedRegionSelection(current, "서울", "강남구");
      expect(result).toEqual([{ bigRegion: "서울", smallRegion: "강남구" }]);
    });
  });

  describe("다른 시/도에 영향 없음", () => {
    it("서울 전체 선택해도 부산은 유지", () => {
      const current = [
        { bigRegion: "서울", smallRegion: "강남구" },
        { bigRegion: "부산", smallRegion: "해운대구" },
      ];
      const result = getUpdatedRegionSelection(current, "서울", "전체");
      expect(result).toContainEqual({ bigRegion: "부산", smallRegion: "해운대구" });
      expect(result).toContainEqual({ bigRegion: "서울", smallRegion: "전체" });
      expect(result).toHaveLength(2);
    });

    it("서울 개별 추가해도 부산 유지", () => {
      const current = [{ bigRegion: "부산", smallRegion: "해운대구" }];
      const result = getUpdatedRegionSelection(current, "서울", "강남구");
      expect(result).toContainEqual({ bigRegion: "부산", smallRegion: "해운대구" });
      expect(result).toHaveLength(2);
    });
  });

  describe("원본 불변성", () => {
    it("개별 추가 시 원본 배열 미수정", () => {
      const current = [{ bigRegion: "서울", smallRegion: "강남구" }];
      const copy = [...current];
      getUpdatedRegionSelection(current, "서울", "서초구");
      expect(current).toEqual(copy);
    });

    it("전체→개별 전환 시 원본 배열 미수정", () => {
      const current = [{ bigRegion: "서울", smallRegion: "전체" }];
      const copy = [...current];
      getUpdatedRegionSelection(current, "서울", "강남구");
      expect(current).toEqual(copy);
    });
  });
});
