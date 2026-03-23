import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import useToastStore, { resetToastCounter } from "@/stores/toastStore";

beforeEach(() => {
  vi.useFakeTimers();
  useToastStore.setState({ toasts: [] });
  resetToastCounter();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("toastStore", () => {
  describe("addToast", () => {
    it("토스트 추가", () => {
      useToastStore.getState().addToast("성공!", "success");
      const toasts = useToastStore.getState().toasts;
      expect(toasts).toHaveLength(1);
      expect(toasts[0].message).toBe("성공!");
      expect(toasts[0].type).toBe("success");
      expect(toasts[0].isExiting).toBe(false);
    });

    it("기본 타입은 info", () => {
      useToastStore.getState().addToast("알림");
      expect(useToastStore.getState().toasts[0].type).toBe("info");
    });

    it("고유 ID 생성", () => {
      useToastStore.getState().addToast("첫 번째");
      useToastStore.getState().addToast("두 번째");
      const toasts = useToastStore.getState().toasts;
      expect(toasts[0].id).not.toBe(toasts[1].id);
    });

    it("여러 토스트 동시 존재", () => {
      useToastStore.getState().addToast("A", "success");
      useToastStore.getState().addToast("B", "error");
      useToastStore.getState().addToast("C", "info");
      expect(useToastStore.getState().toasts).toHaveLength(3);
    });
  });

  describe("자동 dismiss 타이밍", () => {
    it("3초 후 isExiting=true", () => {
      useToastStore.getState().addToast("테스트");
      expect(useToastStore.getState().toasts[0].isExiting).toBe(false);

      vi.advanceTimersByTime(3000);
      expect(useToastStore.getState().toasts[0].isExiting).toBe(true);
    });

    it("3초 + 300ms: isExiting → 완전 제거 (2단계 검증)", () => {
      useToastStore.getState().addToast("테스트");

      vi.advanceTimersByTime(3000);
      expect(useToastStore.getState().toasts[0].isExiting).toBe(true);

      vi.advanceTimersByTime(300);
      expect(useToastStore.getState().toasts).toHaveLength(0);
    });
  });

  describe("dismissToast", () => {
    it("수동 dismiss → isExiting=true → 제거", () => {
      useToastStore.getState().addToast("테스트");
      const id = useToastStore.getState().toasts[0].id;

      useToastStore.getState().dismissToast(id);
      expect(useToastStore.getState().toasts[0].isExiting).toBe(true);

      vi.advanceTimersByTime(300);
      expect(useToastStore.getState().toasts).toHaveLength(0);
    });

    it("이미 exiting인 토스트에 다시 dismiss해도 1번만 제거됨", () => {
      useToastStore.getState().addToast("테스트");
      const id = useToastStore.getState().toasts[0].id;

      useToastStore.getState().dismissToast(id);
      useToastStore.getState().dismissToast(id);
      expect(useToastStore.getState().toasts[0].isExiting).toBe(true);

      vi.advanceTimersByTime(300);
      expect(useToastStore.getState().toasts).toHaveLength(0);
    });

    it("없는 ID로 dismiss해도 에러 안 남", () => {
      expect(() => {
        useToastStore.getState().dismissToast("nonexistent");
      }).not.toThrow();
    });
  });

  describe("removeToast", () => {
    it("특정 토스트만 제거", () => {
      useToastStore.getState().addToast("A");
      useToastStore.getState().addToast("B");
      const idA = useToastStore.getState().toasts[0].id;

      useToastStore.getState().removeToast(idA);
      expect(useToastStore.getState().toasts).toHaveLength(1);
      expect(useToastStore.getState().toasts[0].message).toBe("B");
    });
  });
});
