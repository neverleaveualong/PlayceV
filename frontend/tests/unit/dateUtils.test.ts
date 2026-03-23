import { describe, it, expect, vi, afterEach } from "vitest";
import { getToday, getDay, getDayIdx } from "@/utils/dateUtils";
import getDaysInMonth from "@/utils/dateUtils";

afterEach(() => {
  vi.useRealTimers();
});

describe("getToday", () => {
  it("현재 날짜를 정확히 반환", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 23)); // 2026-03-23

    const result = getToday();
    expect(result.year).toBe(2026);
    expect(result.month).toBe(3);
    expect(result.date).toBe(23);
    expect(result.dateString).toBe("2026-03-23");
  });

  it("월/일 한 자리수는 zero-padding", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 5)); // 2026-01-05

    const result = getToday();
    expect(result.dateString).toBe("2026-01-05");
  });

  it("12월 31일", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 11, 31));

    const result = getToday();
    expect(result.month).toBe(12);
    expect(result.date).toBe(31);
    expect(result.dateString).toBe("2026-12-31");
  });
});

describe("getDay", () => {
  it("요일 한글 반환", () => {
    // 2026-03-23은 월요일
    expect(getDay(2026, 3, 23)).toBe("월");
  });

  it("일요일", () => {
    // 2026-03-22는 일요일
    expect(getDay(2026, 3, 22)).toBe("일");
  });

  it("토요일", () => {
    // 2026-03-28은 토요일
    expect(getDay(2026, 3, 28)).toBe("토");
  });
});

describe("getDayIdx", () => {
  it("일요일 = 0", () => {
    expect(getDayIdx(2026, 3, 22)).toBe(0);
  });

  it("월요일 = 1", () => {
    expect(getDayIdx(2026, 3, 23)).toBe(1);
  });

  it("토요일 = 6", () => {
    expect(getDayIdx(2026, 3, 28)).toBe(6);
  });
});

describe("getDaysInMonth", () => {
  it("1월은 31일", () => {
    expect(getDaysInMonth(2026, 1)).toBe(31);
  });

  it("2월 평년은 28일", () => {
    expect(getDaysInMonth(2026, 2)).toBe(28);
  });

  it("2월 윤년은 29일", () => {
    expect(getDaysInMonth(2024, 2)).toBe(29);
  });

  it("4월은 30일", () => {
    expect(getDaysInMonth(2026, 4)).toBe(30);
  });

  it("12월은 31일", () => {
    expect(getDaysInMonth(2026, 12)).toBe(31);
  });
});
