import { test, expect } from "@playwright/test";

const TODAY = new Date().toISOString().slice(0, 10);

const MOCK_STORE = {
  store_id: 1,
  store_name: "교촌치킨 서울시청점",
  type: "치킨",
  main_img: "/noimg.png",
  address: "서울 중구 세종대로18길 6",
  opening_hours: "매일 12:00 ~ 24:00",
  lat: 37.5665,
  lng: 126.978,
  broadcasts: [
    { match_date: TODAY, match_time: "16:30", sport: "축구", league: "K리그 1", team_one: "대전 시티즌", team_two: "수원 삼성", etc: "" },
  ],
};

const MOCK_BIG_REGIONS = [
  { id: 1, name: "서울" },
  { id: 2, name: "경기" },
  { id: 3, name: "강원" },
  { id: 4, name: "인천" },
  { id: 5, name: "부산" },
];

const MOCK_SMALL_REGIONS = [
  { id: 1, name: "전체", big_region_id: 3 },
  { id: 2, name: "원주시", big_region_id: 3 },
  { id: 3, name: "춘천시", big_region_id: 3 },
  { id: 4, name: "강릉시", big_region_id: 3 },
];

const MOCK_SPORTS = [
  { id: 1, name: "축구", isTeamCompetition: true },
  { id: 2, name: "야구", isTeamCompetition: true },
  { id: 3, name: "농구", isTeamCompetition: true },
];

const MOCK_LEAGUES = [
  { id: 1, name: "K리그 1", sport_id: 1 },
  { id: 2, name: "프리미어리그", sport_id: 1 },
];

async function setupMocks(page: import("@playwright/test").Page) {
  await page.route("**/search/nearby*", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true, data: [MOCK_STORE] }),
  }));

  await page.route("**/staticdata/bigRegions", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true, data: MOCK_BIG_REGIONS }),
  }));

  await page.route("**/staticdata/smallRegions/*", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true, data: MOCK_SMALL_REGIONS }),
  }));

  await page.route("**/staticdata/sports", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true, data: MOCK_SPORTS }),
  }));

  await page.route("**/staticdata/leagues/*", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true, data: MOCK_LEAGUES }),
  }));
}

test.describe("모달 플로우", () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });
  });

  test("지역 모달: 열기 → 선택 → 적용", async ({ page }) => {
    await page.getByRole("button", { name: "지역" }).click();
    await expect(page.getByRole("heading", { name: "지역" })).toBeVisible();

    // 강원 → 원주시 선택
    await page.getByRole("button", { name: "강원" }).click();
    await expect(page.locator("label", { hasText: "원주시" })).toBeVisible({ timeout: 5000 });
    await page.locator("label", { hasText: "원주시" }).click();

    // 태그 + 적용 버튼 확인
    await expect(page.getByText("강원 원주시").nth(1)).toBeVisible();
    await page.getByRole("button", { name: "적용" }).click();

    // 모달 닫힘
    await expect(page.getByRole("heading", { name: "지역" })).not.toBeVisible();
  });

  test("지역 모달: 백드롭 클릭 → 선택 복원", async ({ page }) => {
    await expect(page.getByRole("button", { name: "지역", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "지역" }).click();
    await expect(page.getByRole("heading", { name: "지역" })).toBeVisible();

    // 강원 → 원주시 선택
    await page.getByRole("button", { name: "강원" }).click();
    await expect(page.locator("label", { hasText: "원주시" })).toBeVisible({ timeout: 5000 });
    await page.locator("label", { hasText: "원주시" }).click();

    // 백드롭 클릭 (모달 외부)
    await page.locator("[class*='z-[9999]']").click({ position: { x: 5, y: 5 } });

    // 모달 닫힘 + 선택 복원
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
    await expect(modal.getByRole("button", { name: "축구", exact: true })).toBeVisible({ timeout: 5000 });
    await modal.getByRole("button", { name: "축구", exact: true }).click();

    // 백드롭 클릭 → 복원
    await page.locator("[class*='z-[9999]']").click({ position: { x: 5, y: 5 } });

    // 경기 버튼이 정확히 "경기"로 돌아감
    await expect(page.getByRole("button", { name: "경기", exact: true })).toBeVisible();
  });
});
