import { describe, it, expect, vi, afterEach } from "vitest";
import { getOpenStatus, getOpenStatusLabel } from "@/utils/openStatus";

// 시간을 고정해서 테스트하기 위한 헬퍼
const mockTime = (hours: number, minutes: number) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 2, 23, hours, minutes, 0));
};

afterEach(() => {
  vi.useRealTimers();
});

describe("getOpenStatus", () => {
  describe("입력 검증", () => {
    it("undefined이면 unknown", () => {
      expect(getOpenStatus(undefined)).toBe("unknown");
    });

    it("빈 문자열이면 unknown", () => {
      expect(getOpenStatus("")).toBe("unknown");
    });

    it("시간 패턴이 없으면 unknown", () => {
      expect(getOpenStatus("연중무휴")).toBe("unknown");
      expect(getOpenStatus("매일 영업")).toBe("unknown");
    });
  });

  describe("일반 영업 (09:00 ~ 22:00)", () => {
    const hours = "매일 09:00 ~ 22:00";

    it("영업시간 내면 open", () => {
      mockTime(12, 0);
      expect(getOpenStatus(hours)).toBe("open");
    });

    it("오픈 시간 정각이면 open", () => {
      mockTime(9, 0);
      expect(getOpenStatus(hours)).toBe("open");
    });

    it("마감 시간 정각이면 closed", () => {
      mockTime(22, 0);
      expect(getOpenStatus(hours)).toBe("closed");
    });

    it("마감 1분 전이면 open", () => {
      mockTime(21, 59);
      expect(getOpenStatus(hours)).toBe("open");
    });

    it("오픈 전이면 closed", () => {
      mockTime(8, 59);
      expect(getOpenStatus(hours)).toBe("closed");
    });
  });

  describe("야간 영업 (15:00 ~ 01:00)", () => {
    const hours = "매일 15:00 ~ 01:00";

    it("오후에 open", () => {
      mockTime(20, 0);
      expect(getOpenStatus(hours)).toBe("open");
    });

    it("자정 이후, 마감 전이면 open", () => {
      mockTime(0, 30);
      expect(getOpenStatus(hours)).toBe("open");
    });

    it("오픈 시간 정각이면 open", () => {
      mockTime(15, 0);
      expect(getOpenStatus(hours)).toBe("open");
    });

    it("마감 시간 정각(01:00)이면 closed", () => {
      mockTime(1, 0);
      expect(getOpenStatus(hours)).toBe("closed");
    });

    it("낮 시간이면 closed", () => {
      mockTime(10, 0);
      expect(getOpenStatus(hours)).toBe("closed");
    });

    it("자정(00:00)에 open", () => {
      mockTime(0, 0);
      expect(getOpenStatus(hours)).toBe("open");
    });
  });

  describe("심야 영업 (23:00 ~ 05:00)", () => {
    const hours = "금토 23:00 ~ 05:00";

    it("23:30이면 open", () => {
      mockTime(23, 30);
      expect(getOpenStatus(hours)).toBe("open");
    });

    it("03:00이면 open", () => {
      mockTime(3, 0);
      expect(getOpenStatus(hours)).toBe("open");
    });

    it("05:00 정각이면 closed", () => {
      mockTime(5, 0);
      expect(getOpenStatus(hours)).toBe("closed");
    });

    it("12:00이면 closed", () => {
      mockTime(12, 0);
      expect(getOpenStatus(hours)).toBe("closed");
    });
  });

  describe("공백 변형", () => {
    it("공백 없이도 파싱", () => {
      mockTime(12, 0);
      expect(getOpenStatus("09:00~22:00")).toBe("open");
    });

    it("공백 많아도 파싱", () => {
      mockTime(12, 0);
      expect(getOpenStatus("매일  09:00  ~  22:00")).toBe("open");
    });
  });
});

describe("getOpenStatusLabel", () => {
  it("open → 영업중", () => {
    expect(getOpenStatusLabel("open")).toBe("영업중");
  });

  it("closed → 영업종료", () => {
    expect(getOpenStatusLabel("closed")).toBe("영업종료");
  });

  it("unknown → 빈 문자열", () => {
    expect(getOpenStatusLabel("unknown")).toBe("");
  });
});
