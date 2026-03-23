import { test, expect } from "@playwright/test";

test.describe("오늘의 중계 플로우", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });
  });

  test("전체 탭이 기본 선택, 종목별 탭 전환", async ({ page }) => {
    // 전체 탭 보임
    const allTab = page.getByRole("button", { name: /전체/ });
    await expect(allTab).toBeVisible({ timeout: 10000 });

    // 종목 탭 클릭 → 전체로 돌아오기
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
    // 사이드바 내 첫 번째 카드
    const card = page.locator("aside ul li").first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await card.click();

    // 상세 페이지 탭 메뉴 확인
    await expect(page.getByText("홈")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "중계", exact: true })).toBeVisible();
  });
});
