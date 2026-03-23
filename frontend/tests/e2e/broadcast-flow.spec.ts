import { test, expect } from "@playwright/test";

const TODAY = new Date().toISOString().slice(0, 10);

const MOCK_BROADCASTS = [
  { match_date: TODAY, match_time: "16:30", sport: "축구", league: "K리그 1", team_one: "대전 시티즌", team_two: "수원 삼성", etc: "" },
  { match_date: TODAY, match_time: "19:00", sport: "야구", league: "KBO", team_one: "두산 베어스", team_two: "LG 트윈스", etc: "" },
];

const MOCK_STORE = {
  store_id: 1,
  store_name: "교촌치킨 서울시청점",
  type: "치킨",
  main_img: "/noimg.png",
  address: "서울 중구 세종대로18길 6",
  opening_hours: "매일 12:00 ~ 24:00",
  lat: 37.5665,
  lng: 126.978,
  broadcasts: MOCK_BROADCASTS,
};

async function setupMocks(page: import("@playwright/test").Page) {
  await page.route("**/search/nearby*", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true, data: [MOCK_STORE] }),
  }));

  await page.route("**/stores/1", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({
      success: true,
      data: { ...MOCK_STORE, images: [{ imgUrl: "/noimg.png", isMain: true }], menus: [], description: "" },
    }),
  }));
}

test.describe("오늘의 중계 플로우", () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
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
