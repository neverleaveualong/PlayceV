import { test, expect } from "@playwright/test";
import { setupMyPageMocks, loginAndOpenMypage } from "./helpers/setup-mocks";

test.use({ viewport: { width: 1280, height: 800 } });

test.describe("중계 관리", () => {
  test.beforeEach(async ({ page }) => {
    await setupMyPageMocks(page);
  });

  test("중계 관리 탭 → 가게 목록 표시", async ({ page }) => {
    await loginAndOpenMypage(page);
    await page.getByText("중계 관리").first().click();
    await expect(page.getByText("교촌치킨 서울시청점").first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("프로필", () => {
  test.beforeEach(async ({ page }) => {
    await setupMyPageMocks(page);
  });

  test("유저 정보 표시", async ({ page }) => {
    await loginAndOpenMypage(page);
    await expect(page.getByText("테스터").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("test@playce.com").first()).toBeVisible();
  });

  test("탭 전환: 프로필 → 식당 관리", async ({ page }) => {
    await loginAndOpenMypage(page);
    await expect(page.getByText("테스터").first()).toBeVisible({ timeout: 10000 });
    await page.getByText("식당 관리").first().click();
    await expect(page.getByText("교촌치킨 서울시청점").first()).toBeVisible({ timeout: 10000 });
  });
});
