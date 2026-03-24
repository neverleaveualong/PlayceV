import { test, expect } from "@playwright/test";
import { setupMyPageMocks, loginAndOpenMypage } from "./helpers/setup-mocks";

test.use({ viewport: { width: 1280, height: 800 } });

test.describe("식당 관리", () => {
  test.beforeEach(async ({ page }) => {
    await setupMyPageMocks(page);
  });

  test("내 가게 목록에 교촌치킨 표시", async ({ page }) => {
    await loginAndOpenMypage(page);
    await page.getByText("식당 관리").first().click();
    await expect(page.getByText("교촌치킨 서울시청점").first()).toBeVisible({ timeout: 10000 });
  });

  test("식당 등록 폼 접근", async ({ page }) => {
    await loginAndOpenMypage(page);
    await page.getByText("식당 관리").first().click();
    await expect(page.getByText("교촌치킨 서울시청점").first()).toBeVisible({ timeout: 10000 });
    const registerBtn = page.getByRole("button", { name: /등록/ });
    if (await registerBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await registerBtn.click();
      await expect(page.getByText("가게명")).toBeVisible({ timeout: 5000 });
    }
  });
});
