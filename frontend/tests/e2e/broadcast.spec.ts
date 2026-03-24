import { test, expect } from "@playwright/test";
import { setupBasicMocks } from "./helpers/setup-mocks";

test.describe("오늘의 중계", () => {
  test.beforeEach(async ({ page }) => {
    await setupBasicMocks(page);
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });
  });

  test("전체 탭이 기본 선택, 종목별 탭 전환", async ({ page }) => {
    const allTab = page.getByRole("button", { name: /전체/ });
    await expect(allTab).toBeVisible({ timeout: 10000 });
    const sportTab = page.getByRole("button", { name: /축구 \d+/ });
    await expect(sportTab).toBeVisible({ timeout: 10000 });
    await sportTab.click();
    await allTab.click();
  });

  test("가게 지역 정보가 표시됨", async ({ page }) => {
    const sidebar = page.locator("aside");
    await expect(
      sidebar.locator("text=/서울|부산|대구|인천|광주|대전|강원/").first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("중계 카드 클릭 → 가게 상세 열림", async ({ page }) => {
    const card = page.locator("aside ul li").first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await card.click();
    await expect(page.getByText("홈")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "중계", exact: true })).toBeVisible();
  });
});
