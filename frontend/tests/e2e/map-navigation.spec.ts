import { test, expect } from "@playwright/test";

test.describe("지도 네비게이션", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });
    // 사이드바 닫기 → 맵 노출
    const closeBtn = page.locator('button[aria-label="사이드바 닫기"]');
    if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await closeBtn.click();
    }
  });

  test("도시 퀵네비: 접힌 상태에서 5개 도시 표시", async ({ page }) => {
    for (const city of ["서울", "부산", "대구", "인천", "광주"]) {
      await expect(page.getByRole("button", { name: city, exact: true })).toBeVisible();
    }
  });

  test("도시 퀵네비: 펼치기 → 전체 12개 도시", async ({ page }) => {
    await page.locator('button[aria-label="도시 더보기"]').click();
    await expect(page.getByRole("button", { name: "제주", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "전주", exact: true })).toBeVisible();
  });

  test("도시 클릭 → 지도 이동", async ({ page }) => {
    const busanBtn = page.getByRole("button", { name: "부산", exact: true });
    await busanBtn.click();
    // 부산 버튼이 활성 상태 (primary5 배경)
    await expect(busanBtn).toHaveClass(/bg-primary5/);
  });

  test("마커 클릭 → 팝업 모달 표시", async ({ page }) => {
    const marker = page.locator('button[aria-label*="상세보기"]').first();
    await expect(marker).toBeVisible({ timeout: 10000 });
    await marker.click();
    await expect(page.locator('button:text-is("상세보기")')).toBeVisible({ timeout: 5000 });
  });

  test("내 위치 버튼 표시", async ({ page }) => {
    await expect(page.getByText("내 위치")).toBeVisible();
  });
});
