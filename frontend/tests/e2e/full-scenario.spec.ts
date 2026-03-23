import { test, expect } from "@playwright/test";

/**
 * 풀 시나리오 e2e 테스트
 * API 모킹으로 서버 의존 없이 전체 유저 여정 검증
 */

const TODAY = new Date().toISOString().slice(0, 10);

const MOCK_STORE = {
  store_id: 1,
  store_name: "교촌치킨 서울시청점",
  type: "치킨",
  address: "서울 중구 세종대로18길 6",
  opening_hours: "매일 12:00 ~ 24:00",
  phone: "02-1234-5678",
  lat: 37.5665,
  lng: 126.978,
  main_img: "/noimg.png",
  broadcasts: [
    { match_date: TODAY, match_time: "16:30", sport: "축구", league: "K리그 1", team_one: "대전 시티즌", team_two: "수원 삼성", etc: "" },
  ],
};

async function setupMocks(page: import("@playwright/test").Page) {
  // 검색 API
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

  // 주변 가게
  await page.route("**/search/nearby*", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({
      success: true,
      data: [{
        store_id: 1, store_name: MOCK_STORE.store_name, type: MOCK_STORE.type,
        main_img: MOCK_STORE.main_img, address: MOCK_STORE.address,
        opening_hours: MOCK_STORE.opening_hours, lat: MOCK_STORE.lat, lng: MOCK_STORE.lng,
        broadcasts: MOCK_STORE.broadcasts,
      }],
    }),
  }));

  // 가게 상세
  await page.route("**/stores/1", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({
      success: true,
      data: { ...MOCK_STORE, images: [{ imgUrl: "/noimg.png", isMain: true }], menus: [{ name: "후라이드", price: 18000 }], description: "" },
    }),
  }));

  // 인증 모킹
  await page.route("**/users/login", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ data: { token: "mock-token" } }),
  }));

  // 즐겨찾기
  await page.route("**/favorites", (r) => {
    if (r.request().method() === "GET") {
      return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [MOCK_STORE] }) });
    }
    return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
  });
  await page.route("**/favorites/upcoming", (r) => r.fulfill({
    status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [] }),
  }));
}

test.use({ viewport: { width: 1280, height: 800 } });

// ══════════════════════════════════════════
// 시나리오 1: 교촌치킨 검색 → 결과 확인 → 상세 열기
// ══════════════════════════════════════════

test.describe("시나리오 1: 검색 → 상세", () => {
  test("교촌치킨 검색 → 결과에 표시 → 클릭 → 상세 정보 확인", async ({ page }) => {
    await setupMocks(page);
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });

    // 검색
    await page.getByPlaceholder("가게 이름으로 검색").fill("교촌치킨");
    await page.getByRole("button", { name: "오늘" }).click();
    await page.locator("button:has(.anticon-search)").first().click();

    // 결과 확인
    await expect(page.getByText("교촌치킨 서울시청점").first()).toBeVisible({ timeout: 15000 });

    // 상세 클릭
    await page.getByText("교촌치킨 서울시청점").first().click();

    // 상세 페이지 탭 확인
    await expect(page.getByText("홈")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("매일 12:00 ~ 24:00").first()).toBeVisible();
  });
});

// ══════════════════════════════════════════
// 시나리오 2: 도시 이동 → 마커 → 팝업 → 상세보기
// ══════════════════════════════════════════

test.describe("시나리오 2: 맵 마커 → 상세보기", () => {
  test("마커 클릭 → 팝업 → 상세보기 → 가게 정보 확인", async ({ page }) => {
    test.skip(!!process.env.CI, "카카오맵 마커는 CI에서 렌더링 불가");
    await setupMocks(page);
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });

    // 사이드바 닫기
    const close = page.locator('button[aria-label="사이드바 닫기"]');
    if (await close.isVisible({ timeout: 2000 }).catch(() => false)) await close.click();

    // 마커 클릭 → 팝업
    const marker = page.locator('button[aria-label*="상세보기"]').first();
    await expect(marker).toBeVisible({ timeout: 10000 });
    await marker.click();
    await expect(page.locator('button:text-is("상세보기")')).toBeVisible({ timeout: 5000 });

    // 상세보기 클릭
    await page.locator('button:text-is("상세보기")').click();
    await expect(page.getByText("교촌치킨 서울시청점").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("홈")).toBeVisible();
  });
});

// ══════════════════════════════════════════
// 시나리오 3: 오늘의 중계 → 카드 클릭 → 상세
// ══════════════════════════════════════════

test.describe("시나리오 3: 검색 결과 → 상세 → 중계 탭", () => {
  test("검색 → 상세 → 중계 탭에서 K리그 확인", async ({ page }) => {
    await setupMocks(page);
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });

    // 검색
    await page.getByPlaceholder("가게 이름으로 검색").fill("교촌치킨");
    await page.getByRole("button", { name: "오늘" }).click();
    await page.locator("button:has(.anticon-search)").first().click();

    // 결과 클릭
    await expect(page.getByText("교촌치킨 서울시청점").first()).toBeVisible({ timeout: 15000 });
    await page.getByText("교촌치킨 서울시청점").first().click();

    // 중계 탭
    await page.getByRole("button", { name: "중계", exact: true }).click();
    await expect(page.getByText("K리그").first()).toBeVisible({ timeout: 10000 });
  });
});

// ══════════════════════════════════════════
// 시나리오 4: 비로그인 즐겨찾기 → 로그인 유도 → 로그인
// ══════════════════════════════════════════

test.describe("시나리오 4: 비로그인 → 로그인 유도 → 즐겨찾기", () => {
  test("즐겨찾기 차단 → 로그인 → 즐겨찾기 접근", async ({ page }) => {
    await setupMocks(page);
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });

    // 비로그인 즐겨찾기 → 로그인 유도
    await page.getByRole("button", { name: "즐겨찾기" }).first().click();
    await expect(page.getByText("자주 찾는 식당을 저장해보세요")).toBeVisible();
    await expect(page.getByRole("button", { name: "로그인하고 시작하기" })).toBeVisible();

    // 로그인 유도 버튼 → 로그인 모달
    await page.getByRole("button", { name: "로그인하고 시작하기" }).click();
    await expect(page.getByText("스포츠 중계 맛집을 찾아보세요")).toBeVisible({ timeout: 5000 });

    // 로그인
    await page.getByPlaceholder("example@email.com").fill("test@playce.com");
    await page.getByPlaceholder("비밀번호를 입력하세요").fill("test1234");
    await page.locator("form button[type='submit']").click();
    await expect(page.getByText("로그인이 완료되었습니다")).toBeVisible({ timeout: 5000 });
  });
});

// ══════════════════════════════════════════
// 시나리오 5: 검색 → 결과 닫기 → 오늘의 중계 복귀
// ══════════════════════════════════════════

test.describe("시나리오 5: 검색 결과 닫기 → 복귀", () => {
  test("검색 후 X 닫기 → 오늘의 중계로 돌아옴", async ({ page }) => {
    await setupMocks(page);
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });

    // 검색
    await page.getByRole("button", { name: "오늘" }).click();
    await page.locator("button:has(.anticon-search)").first().click();

    // 결과 닫기
    const closeBtn = page.locator('button[aria-label="검색 결과 닫기"]');
    await expect(closeBtn).toBeVisible({ timeout: 15000 });
    await closeBtn.click();

    // 오늘의 중계 복귀
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 5000 });
  });
});

// ══════════════════════════════════════════
// 시나리오 6: 도시 퀵네비 전체 동작
// ══════════════════════════════════════════

test.describe("시나리오 6: 도시 퀵네비 전체", () => {
  test("접힌 5개 → 펼치기 → 도시 이동 → 접기", async ({ page }) => {
    await setupMocks(page);
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });

    // 사이드바 닫기
    const close = page.locator('button[aria-label="사이드바 닫기"]');
    if (await close.isVisible({ timeout: 2000 }).catch(() => false)) await close.click();

    // 접힌 상태 5개
    for (const city of ["서울", "부산", "대구", "인천", "광주"]) {
      await expect(page.getByRole("button", { name: city, exact: true })).toBeVisible();
    }

    // 펼치기
    await page.locator('button[aria-label="도시 더보기"]').click();
    await expect(page.getByRole("button", { name: "제주", exact: true })).toBeVisible();

    // 부산 이동 (클릭 시 자동 접힘)
    await page.getByRole("button", { name: "부산", exact: true }).click();
    await expect(page.getByRole("button", { name: "부산", exact: true })).toHaveClass(/bg-primary5/);

    // 자동 접힘 → 제주 안 보임
    await expect(page.getByRole("button", { name: "제주", exact: true })).not.toBeVisible();
  });
});
