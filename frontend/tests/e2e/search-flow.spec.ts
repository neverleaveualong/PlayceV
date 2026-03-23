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

async function setupMocks(page: import("@playwright/test").Page) {
  await page.route("**/search?*", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({
      success: true, message: "ok",
      data: [{
        id: 1, store_name: MOCK_STORE.store_name, img_url: "", address: MOCK_STORE.address,
        lat: MOCK_STORE.lat, lng: MOCK_STORE.lng, distance: 1.2,
        broadcast: MOCK_STORE.broadcasts[0],
      }],
    }),
  }));

  await page.route("**/search/nearby*", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true, data: [MOCK_STORE] }),
  }));

  await page.route("**/favorites", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true, data: [] }),
  }));

  await page.route("**/favorites/upcoming", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true, data: [] }),
  }));
}

test.describe("검색 플로우", () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
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

  test("검색 패널 접기/펼치기", async ({ page }) => {
    const resetBtn = page.getByRole("button", { name: "초기화" });
    await expect(resetBtn).toBeVisible();

    await page.getByText("보고 싶은 경기를 선택하면").click();
    await expect(resetBtn).not.toBeVisible();

    await page.getByText("검색 조건 열기").click();
    await expect(resetBtn).toBeVisible();
  });

  test("즐겨찾기 탭 전환", async ({ page }) => {
    await page.getByRole("button", { name: "즐겨찾기" }).first().click();
    await expect(page.locator("aside")).toContainText(/즐겨찾기/);
  });
});
