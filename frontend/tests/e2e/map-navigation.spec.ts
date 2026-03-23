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

test.describe("지도 네비게이션", () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });
    const closeBtn = page.locator('button[aria-label="사이드바 닫기"]');
    if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await closeBtn.click();
    }
  });

  test("도시 퀵네비: 접힌 상태에서 5개 도시 표시", async ({ page }) => {
    for (const city of ["서울", "부산", "대구", "인천", "광주"]) {
      await expect(page.getByRole("button", { name: city, exact: true })).toBeVisible();
    }
  });

  test("도시 퀵네비: 펼치기 → 전체 12개 도시", async ({ page }) => {
    await page.locator('button[aria-label="도시 더보기"]').click();
    await expect(page.getByRole("button", { name: "제주", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "전주", exact: true })).toBeVisible();
  });

  test("도시 클릭 → 지도 이동", async ({ page }) => {
    const busanBtn = page.getByRole("button", { name: "부산", exact: true });
    await busanBtn.click();
    await expect(busanBtn).toHaveClass(/bg-primary5/);
  });

  test("마커 클릭 → 팝업 모달 표시", async ({ page }) => {
    test.skip(!!process.env.CI, "카카오맵 마커는 headless CI에서 렌더링 타이밍 보장 불가");
    const marker = page.locator('button[aria-label*="상세보기"]').first();
    await expect(marker).toBeVisible({ timeout: 10000 });
    await marker.click();
    await expect(page.locator('button:text-is("상세보기")')).toBeVisible({ timeout: 5000 });
  });

  test("내 위치 버튼 표시", async ({ page }) => {
    await expect(page.getByText("내 위치")).toBeVisible();
  });
});
