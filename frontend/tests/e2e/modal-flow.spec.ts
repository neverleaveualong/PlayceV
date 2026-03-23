import { test, expect } from "@playwright/test";

test.describe("모달 플로우", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });
  });

  test("지역 모달: 열기 → 선택 → 적용", async ({ page }) => {
    await page.getByRole("button", { name: "지역" }).click();
    await expect(page.getByRole("heading", { name: "지역" })).toBeVisible();

    // 강원 → 원주시 선택
    await page.getByRole("button", { name: "강원" }).click();
    await page.locator("label", { hasText: "원주시" }).click();

    // 태그 + 적용 버튼 확인
    await expect(page.getByText("강원 원주시").nth(1)).toBeVisible();
    await page.getByRole("button", { name: "적용" }).click();

    // 모달 닫힘 + 지역 버튼에 선택 반영
    await expect(page.getByRole("heading", { name: "지역" })).not.toBeVisible();
  });

  test("지역 모달: 백드롭 클릭 → 선택 복원", async ({ page }) => {
    // 초기 지역 버튼 텍스트 확인
    await expect(page.getByRole("button", { name: "지역", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "지역" }).click();
    await expect(page.getByRole("heading", { name: "지역" })).toBeVisible();

    // 강원 → 원주시 선택
    await page.getByRole("button", { name: "강원" }).click();
    await page.locator("label", { hasText: "원주시" }).click();

    // 백드롭 클릭 (모달 외부)
    await page.locator("[class*='z-[9999]']").click({ position: { x: 5, y: 5 } });

    // 모달 닫힘 + 선택 복원 (지역 버튼이 정확히 "지역"으로 돌아감)
    await expect(page.getByRole("button", { name: "지역", exact: true })).toBeVisible();
  });

  test("경기 모달: 열기 → 종목 선택 → 백드롭 닫기 → 복원", async ({ page }) => {
    await expect(page.getByRole("button", { name: "경기", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "경기", exact: true }).click();
    await expect(page.getByRole("heading", { name: "경기" })).toBeVisible();

    // 모달 내부에서 종목 선택
    const modal = page.locator('[class*="shadow-2xl"]').filter({
      has: page.getByRole("heading", { name: "경기" }),
    });
    await modal.getByRole("button", { name: "축구", exact: true }).click();

    // 백드롭 클릭 → 복원
    await page.locator("[class*='z-[9999]']").click({ position: { x: 5, y: 5 } });

    // 경기 버튼이 정확히 "경기"로 돌아감
    await expect(page.getByRole("button", { name: "경기", exact: true })).toBeVisible();
  });
});
