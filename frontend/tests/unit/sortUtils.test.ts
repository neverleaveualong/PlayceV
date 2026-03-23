import { describe, it, expect } from "vitest";
import { sortSearchResults } from "@/utils/sortUtils";
import type { SearchResultItem } from "@/types/search";

const makeBroadcast = (date: string, time: string) => ({
  match_date: date,
  match_time: time,
  sport: "",
  league: "",
  team_one: "",
  team_two: "",
  etc: "",
});

const makeItem = (
  overrides: Partial<SearchResultItem> = {}
): SearchResultItem => ({
  id: 1,
  store_name: "테스트",
  img_url: "",
  address: "",
  lat: 0,
  lng: 0,
  broadcast: makeBroadcast("2026-03-23", "15:00"),
  ...overrides,
});

describe("sortSearchResults", () => {
  describe("거리순 정렬", () => {
    const items = [
      makeItem({ id: 1, distance: 3.5 }),
      makeItem({ id: 2, distance: 1.2 }),
      makeItem({ id: 3, distance: 5.0 }),
    ];

    it("asc — 가까운 순", () => {
      const result = sortSearchResults(items, "distance", "asc");
      expect(result.map((i) => i.distance)).toEqual([1.2, 3.5, 5.0]);
    });

    it("desc — 먼 순", () => {
      const result = sortSearchResults(items, "distance", "desc");
      expect(result.map((i) => i.distance)).toEqual([5.0, 3.5, 1.2]);
    });

    it("기본 order는 asc", () => {
      const result = sortSearchResults(items, "distance");
      expect(result[0].distance).toBe(1.2);
    });
  });

  describe("거리 undefined 처리", () => {
    it("undefined distance는 뒤로 밀림", () => {
      const items = [
        makeItem({ id: 1, distance: undefined }),
        makeItem({ id: 2, distance: 2.0 }),
      ];
      const result = sortSearchResults(items, "distance", "asc");
      expect(result[0].distance).toBe(2.0);
    });

    it("전부 undefined면 순서 유지", () => {
      const items = [makeItem({ id: 1 }), makeItem({ id: 2 })];
      const result = sortSearchResults(items, "distance");
      expect(result.map((i) => i.id)).toEqual([1, 2]);
    });
  });

  describe("날짜순 정렬", () => {
    it("asc — 이른 경기 먼저", () => {
      const items = [
        makeItem({ id: 1, broadcast: makeBroadcast("2026-03-24", "15:00") }),
        makeItem({ id: 2, broadcast: makeBroadcast("2026-03-23", "18:00") }),
      ];
      const result = sortSearchResults(items, "datetime", "asc");
      expect(result[0].id).toBe(2);
    });

    it("desc — 늦은 경기 먼저", () => {
      const items = [
        makeItem({ id: 1, broadcast: makeBroadcast("2026-03-23", "15:00") }),
        makeItem({ id: 2, broadcast: makeBroadcast("2026-03-24", "20:00") }),
      ];
      const result = sortSearchResults(items, "datetime", "desc");
      expect(result[0].id).toBe(2);
    });

    it("같은 날짜면 시간순", () => {
      const items = [
        makeItem({ id: 1, broadcast: makeBroadcast("2026-03-23", "20:00") }),
        makeItem({ id: 2, broadcast: makeBroadcast("2026-03-23", "15:00") }),
      ];
      const result = sortSearchResults(items, "datetime", "asc");
      expect(result[0].id).toBe(2);
    });

    it("broadcast 없으면 뒤로 밀림", () => {
      const items = [
        makeItem({ id: 1, broadcast: null as unknown as SearchResultItem["broadcast"] }),
        makeItem({ id: 2, broadcast: makeBroadcast("2026-03-23", "15:00") }),
      ];
      const result = sortSearchResults(items, "datetime", "asc");
      expect(result[0].id).toBe(2);
    });
  });

  describe("원본 불변성", () => {
    it("원본 배열을 수정하지 않음", () => {
      const items = [
        makeItem({ id: 1, distance: 5.0 }),
        makeItem({ id: 2, distance: 1.0 }),
      ];
      const original = [...items];
      sortSearchResults(items, "distance");
      expect(items.map((i) => i.id)).toEqual(original.map((i) => i.id));
    });
  });

  describe("빈 배열", () => {
    it("빈 배열이면 빈 배열 반환", () => {
      expect(sortSearchResults([], "distance")).toEqual([]);
      expect(sortSearchResults([], "datetime")).toEqual([]);
    });
  });
});
