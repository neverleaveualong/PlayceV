import { test, expect } from "@playwright/test";
import { setupSearchMocks, setupFilterModalMocks } from "./helpers/setup-mocks";

test.describe("검색", () => {
  test.beforeEach(async ({ page }) => {
    await setupSearchMocks(page);
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });
  });

  test("초기 상태: 검색 탭 + 오늘의 중계 표시", async ({ page }) => {
    await expect(page.getByText("오늘의 중계")).toBeVisible();
    await expect(page.getByRole("button", { name: /전체/ })).toBeVisible({ timeout: 10000 });
  });

  test("날짜 선택 → 검색 실행", async ({ page }) => {
    await page.getByRole("button", { name: "오늘" }).click();
    await page.locator("button:has(.anticon-search)").click();
    const searched = page.getByText("검색 조건 수정하기").or(page.getByText("검색 결과"));
    await expect(searched.first()).toBeVisible({ timeout: 15000 });
  });

  test("검색 → 결과 클릭 → 상세보기 열림", async ({ page }) => {
    await page.getByPlaceholder("가게 이름으로 검색").fill("교촌치킨");
    await page.getByRole("button", { name: "오늘" }).click();
    await page.locator("button:has(.anticon-search)").first().click();
    await expect(page.getByText("교촌치킨 서울시청점").first()).toBeVisible({ timeout: 15000 });
    await page.getByText("교촌치킨 서울시청점").first().click();
    await expect(page.getByText("홈")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("매일 12:00 ~ 24:00").first()).toBeVisible();
  });

  test("검색 → 상세 → 중계 탭에서 K리그 확인", async ({ page }) => {
    await page.getByPlaceholder("가게 이름으로 검색").fill("교촌치킨");
    await page.getByRole("button", { name: "오늘" }).click();
    await page.locator("button:has(.anticon-search)").first().click();
    await page.getByText("교촌치킨 서울시청점").first().click();
    await page.getByRole("button", { name: "중계", exact: true }).click();
    await expect(page.getByText("K리그").first()).toBeVisible({ timeout: 10000 });
  });

  test("검색 패널 접기/펼치기", async ({ page }) => {
    const resetBtn = page.getByRole("button", { name: "초기화" });
    await expect(resetBtn).toBeVisible();
    await page.getByText("보고 싶은 경기를 선택하면").click();
    await expect(resetBtn).not.toBeVisible();
    await page.getByText("검색 조건 열기").click();
    await expect(resetBtn).toBeVisible();
  });

  test("검색 결과 닫기 → 오늘의 중계 복귀", async ({ page }) => {
    await page.getByRole("button", { name: "오늘" }).click();
    await page.locator("button:has(.anticon-search)").first().click();
    const closeBtn = page.locator('button[aria-label="검색 결과 닫기"]');
    await expect(closeBtn).toBeVisible({ timeout: 15000 });
    await closeBtn.click();
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("검색 필터 모달", () => {
  test.beforeEach(async ({ page }) => {
    await setupFilterModalMocks(page);
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });
  });

  test("지역 모달: 열기 → 선택 → 적용", async ({ page }) => {
    await page.getByRole("button", { name: "지역" }).click();
    await expect(page.getByRole("heading", { name: "지역" })).toBeVisible();
    await page.getByRole("button", { name: "강원" }).click();
    await expect(page.locator("label", { hasText: "원주시" })).toBeVisible({ timeout: 5000 });
    await page.locator("label", { hasText: "원주시" }).click();
    await expect(page.getByText("강원 원주시").nth(1)).toBeVisible();
    await page.getByRole("button", { name: "적용" }).click();
    await expect(page.getByRole("heading", { name: "지역" })).not.toBeVisible();
  });

  test("지역 모달: 백드롭 클릭 → 선택 복원", async ({ page }) => {
    await page.getByRole("button", { name: "지역" }).click();
    await page.getByRole("button", { name: "강원" }).click();
    await expect(page.locator("label", { hasText: "원주시" })).toBeVisible({ timeout: 5000 });
    await page.locator("label", { hasText: "원주시" }).click();
    await page.locator("[class*='z-[9999]']").click({ position: { x: 5, y: 5 } });
    await expect(page.getByRole("button", { name: "지역", exact: true })).toBeVisible();
  });

  test("경기 모달: 열기 → 종목 선택 → 백드롭 닫기 → 복원", async ({ page }) => {
    await page.getByRole("button", { name: "경기", exact: true }).click();
    await expect(page.getByRole("heading", { name: "경기" })).toBeVisible();
    const modal = page.locator('[class*="shadow-2xl"]').filter({ has: page.getByRole("heading", { name: "경기" }) });
    await expect(modal.getByRole("button", { name: "축구", exact: true })).toBeVisible({ timeout: 5000 });
    await modal.getByRole("button", { name: "축구", exact: true }).click();
    await page.locator("[class*='z-[9999]']").click({ position: { x: 5, y: 5 } });
    await expect(page.getByRole("button", { name: "경기", exact: true })).toBeVisible();
  });
});
