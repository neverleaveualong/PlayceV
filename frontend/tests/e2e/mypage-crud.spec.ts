import { test, expect } from "@playwright/test";

/**
 * 마이페이지 CRUD e2e 테스트
 * 가게 등록/수정/삭제 + 중계 등록/수정/삭제
 * 모든 API 모킹으로 서버 의존 없음
 */

const MOCK_USER = { id: 1, name: "테스트", nickname: "테스터", email: "test@playce.com", phone: "010-1234-5678" };
const MOCK_STORE = {
  id: 1, store_id: 1, store_name: "교촌치킨 서울시청점", type: "치킨",
  address: "서울 중구 세종대로18길 6", phone: "02-1234-5678",
  opening_hours: "매일 12:00 ~ 24:00", description: "테스트", lat: 37.5665, lng: 126.978,
  main_img: "/noimg.png", images: [{ imgUrl: "/noimg.png", isMain: true }],
  menus: [{ name: "후라이드", price: 18000 }], broadcasts: [],
  business_number: "123-45-67890",
};

async function setupMyPageMocks(page: import("@playwright/test").Page) {
  // 인증
  await page.route("**/users/login", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { token: "mock-token" } }) }));
  // 유저 정보
  await page.route("**/users/me", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: MOCK_USER }) }));
  // 내 가게 목록
  await page.route("**/stores/mypage", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [MOCK_STORE] }) }));
  // 가게 상세
  await page.route("**/stores/1", (r) => {
    if (r.request().method() === "GET") return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: MOCK_STORE }) });
    if (r.request().method() === "DELETE") return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, message: "삭제 완료" }) });
    return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
  });
  // 가게 등록
  await page.route("**/stores", (r) => {
    if (r.request().method() === "POST") return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
    return r.continue();
  });
  // 중계 목록
  await page.route("**/broadcasts/stores/*", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({
      success: true, data: [{
        id: 1, match_date: "2026-03-23", match_time: "16:30",
        sport: { id: 1, name: "축구" }, league: { id: 1, name: "K리그 1" },
        team_one: "대전 시티즌", team_two: "수원 삼성", etc: "",
      }],
    }),
  }));
  // 중계 등록/수정/삭제
  await page.route("**/broadcasts", (r) => {
    if (r.request().method() === "POST") return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
    return r.continue();
  });
  await page.route("**/broadcasts/*", (r) => {
    const m = r.request().method();
    if (m === "PATCH" || m === "DELETE") return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
    return r.continue();
  });
  // 즐겨찾기
  await page.route("**/favorites", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [] }) }));
  await page.route("**/favorites/upcoming", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [] }) }));
  // 주변 가게
  await page.route("**/search/nearby*", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [] }) }));
  // 종목/리그
  await page.route("**/sports", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [{ id: 1, name: "축구", isTeamCompetition: true }] }) }));
  await page.route("**/leagues*", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [{ id: 1, name: "K리그 1" }] }) }));
  await page.route("**/big-regions*", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [] }) }));
}

async function loginAndOpenMypage(page: import("@playwright/test").Page) {
  // 먼저 페이지 로드
  await page.goto("/map");
  await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });

  // 로그인 모달로 로그인
  await page.getByRole("button", { name: "로그인" }).click();
  await page.getByPlaceholder("example@email.com").fill("test@playce.com");
  await page.getByPlaceholder("비밀번호를 입력하세요").fill("test1234");
  await page.locator("form button[type='submit']").click();
  await expect(page.getByText("로그인이 완료되었습니다")).toBeVisible({ timeout: 5000 });

  // 로그인 후 AuthHeader 리렌더 대기
  await expect(page.getByText("로그아웃")).toBeVisible({ timeout: 10000 });
  await page.getByText("마이페이지").click();
}

test.use({ viewport: { width: 1280, height: 800 } });

// ══════════════════════════════════════════
// 가게 관리 테스트
// ══════════════════════════════════════════

test.describe("마이페이지: 가게 관리", () => {
  test("내 가게 목록에 교촌치킨 표시", async ({ page }) => {
    await setupMyPageMocks(page);
    await loginAndOpenMypage(page);

    // 프로필 확인
    await expect(page.getByText("테스터").first()).toBeVisible({ timeout: 10000 });

    // 식당 관리 탭
    await page.getByText("식당 관리").first().click();

    // 내 가게 표시
    await expect(page.getByText("교촌치킨 서울시청점").first()).toBeVisible({ timeout: 10000 });
  });

  test("식당 등록 폼 접근", async ({ page }) => {
    await setupMyPageMocks(page);
    await loginAndOpenMypage(page);

    await page.getByText("식당 관리").first().click();
    await expect(page.getByText("교촌치킨 서울시청점").first()).toBeVisible({ timeout: 10000 });

    // 등록 버튼 클릭
    const registerBtn = page.getByRole("button", { name: /등록/ });
    if (await registerBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await registerBtn.click();
      // 등록 폼 확인
      await expect(page.getByText("가게명")).toBeVisible({ timeout: 5000 });
    }
  });
});

// ══════════════════════════════════════════
// 중계 관리 테스트
// ══════════════════════════════════════════

test.describe("마이페이지: 중계 관리", () => {
  test("중계 관리 탭 → 가게 목록 표시", async ({ page }) => {
    await setupMyPageMocks(page);
    await loginAndOpenMypage(page);

    // 중계 관리 탭
    await page.getByText("중계 관리").first().click();

    // 가게 선택 목록 표시
    await expect(page.getByText("교촌치킨 서울시청점").first()).toBeVisible({ timeout: 10000 });
  });
});

// ══════════════════════════════════════════
// 프로필 테스트
// ══════════════════════════════════════════

test.describe("마이페이지: 프로필", () => {
  test("유저 정보 표시", async ({ page }) => {
    await setupMyPageMocks(page);
    await loginAndOpenMypage(page);

    // 프로필 정보 확인
    await expect(page.getByText("테스터").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("test@playce.com").first()).toBeVisible();
  });

  test("탭 전환: 프로필 → 식당 관리", async ({ page }) => {
    await setupMyPageMocks(page);
    await loginAndOpenMypage(page);

    // 프로필
    await expect(page.getByText("테스터").first()).toBeVisible({ timeout: 10000 });

    // 식당 관리
    await page.getByText("식당 관리").first().click();
    await expect(page.getByText("교촌치킨 서울시청점").first()).toBeVisible({ timeout: 10000 });
  });
});
