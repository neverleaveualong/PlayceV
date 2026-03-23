import { describe, it, expect } from "vitest";
import { formatTime, formatTimeShort } from "@/utils/formatTime";

describe("formatTime", () => {
  it("정각이면 '시'만 표시", () => {
    expect(formatTime("12:00")).toBe("12시");
    expect(formatTime("09:00")).toBe("9시");
    expect(formatTime("00:00")).toBe("0시");
  });

  it("분이 있으면 '시 분' 표시", () => {
    expect(formatTime("15:30")).toBe("15시 30분");
    expect(formatTime("23:59")).toBe("23시 59분");
    expect(formatTime("01:05")).toBe("1시 5분");
  });

  it("0시 대에 분이 있는 경우", () => {
    expect(formatTime("00:05")).toBe("0시 5분");
    expect(formatTime("00:30")).toBe("0시 30분");
  });
});

describe("formatTimeShort", () => {
  it("HH:MM만 남김", () => {
    expect(formatTimeShort("15:30")).toBe("15:30");
    expect(formatTimeShort("15:30:45")).toBe("15:30");
  });

  it("falsy 값이면 빈 문자열 반환", () => {
    expect(formatTimeShort(undefined)).toBe("");
    expect(formatTimeShort(null)).toBe("");
    expect(formatTimeShort("")).toBe("");
  });
});
