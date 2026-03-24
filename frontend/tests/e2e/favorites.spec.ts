import { test, expect } from "@playwright/test";
import { setupBasicMocks, setupAuthMocks } from "./helpers/setup-mocks";

test.describe("즐겨찾기", () => {
  test.beforeEach(async ({ page }) => {
    await setupBasicMocks(page);
    await setupAuthMocks(page);
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });
  });

  test("비로그인 → 즐겨찾기 클릭 → 로그인 유도", async ({ page }) => {
    await page.getByRole("button", { name: "즐겨찾기" }).first().click();
    await expect(page.getByText("자주 찾는 식당을 저장해보세요")).toBeVisible();
    await expect(page.getByRole("button", { name: "로그인하고 시작하기" })).toBeVisible();
  });

  test("로그인 유도 버튼 → 로그인 모달 열림", async ({ page }) => {
    await page.getByRole("button", { name: "즐겨찾기" }).first().click();
    await page.getByRole("button", { name: "로그인하고 시작하기" }).click();
    await expect(page.getByText("스포츠 중계 맛집을 찾아보세요")).toBeVisible({ timeout: 5000 });
  });

  test("로그인 후 즐겨찾기 탭 접근", async ({ page }) => {
    await page.getByRole("button", { name: "로그인" }).click();
    await page.getByPlaceholder("example@email.com").fill("test@playce.com");
    await page.getByPlaceholder("비밀번호를 입력하세요").fill("test1234");
    await page.locator("form button[type='submit']").click();
    await expect(page.getByText("로그인이 완료되었습니다")).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "즐겨찾기" }).first().click();
    await expect(page.getByText("즐겨찾기한 식당이 없습니다")).toBeVisible({ timeout: 5000 });
  });
});
