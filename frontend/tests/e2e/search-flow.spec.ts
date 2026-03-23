import { test, expect } from "@playwright/test";

test.describe("검색 플로우", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });
  });

  test("초기 상태: 검색 탭 + 오늘의 중계 표시", async ({ page }) => {
    await expect(page.getByText("오늘의 중계")).toBeVisible();
    await expect(page.getByRole("button", { name: /전체/ })).toBeVisible({ timeout: 10000 });
  });

  test("날짜 선택 → 검색 실행", async ({ page }) => {
    // 날짜 프리셋 "오늘" 선택
    await page.getByRole("button", { name: "오늘" }).click();

    // 검색 버튼 (초기화 옆의 검색 버튼)
    await page.locator("button:has(.anticon-search)").click();

    // 검색 후: 결과가 나오거나 토스트가 뜨거나 (조건에 따라 다름)
    // "검색 조건 수정하기" 또는 "검색 결과"가 보이면 검색이 실행된 것
    const searched = page.getByText("검색 조건 수정하기").or(page.getByText("검색 결과"));
    await expect(searched.first()).toBeVisible({ timeout: 15000 });
  });

  test("검색 패널 접기/펼치기", async ({ page }) => {
    // 초기화 버튼이 보이면 검색 패널이 펼쳐진 상태
    const resetBtn = page.getByRole("button", { name: "초기화" });
    await expect(resetBtn).toBeVisible();

    // 접기: 안내 텍스트 클릭
    await page.getByText("보고 싶은 경기를 선택하면").click();

    // 초기화 버튼이 안 보이면 접힌 상태
    await expect(resetBtn).not.toBeVisible();

    // "검색 조건 열기" 클릭으로 펼치기
    await page.getByText("검색 조건 열기").click();
    await expect(resetBtn).toBeVisible();
  });

  test("즐겨찾기 탭 전환", async ({ page }) => {
    await page.getByRole("button", { name: "즐겨찾기" }).first().click();
    await expect(page.locator("aside")).toContainText(/즐겨찾기/);
  });
});
