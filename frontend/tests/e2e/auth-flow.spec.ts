import { test, expect } from "@playwright/test";

const TEST_USER = {
  email: "test@playce.com",
  password: "test1234",
  name: "테스트",
  nickname: "테스터",
  phone: "010-1234-5678",
};

test.describe("인증 플로우", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 API 모킹 — res.data.token 구조
    await page.route("**/users/login", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: { token: "mock-jwt-token" } }),
      })
    );

    // 회원가입 API 모킹
    await page.route("**/users/join", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      })
    );

    // 즐겨찾기 API 모킹
    await page.route("**/favorites", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      })
    );
    await page.route("**/favorites/upcoming", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      })
    );

    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });
  });

  test("로그인 모달 열기 → 입력 → 로그인 성공", async ({ page }) => {
    await page.getByRole("button", { name: "로그인" }).click();
    await expect(page.getByText("스포츠 중계 맛집을 찾아보세요")).toBeVisible();

    // 입력
    await page.getByPlaceholder("example@email.com").fill(TEST_USER.email);
    await page.getByPlaceholder("비밀번호를 입력하세요").fill(TEST_USER.password);

    // 제출 (폼 내 로그인 버튼)
    await page.locator("form button[type='submit']").click();

    // 성공 토스트 확인
    await expect(page.getByText("로그인이 완료되었습니다")).toBeVisible({ timeout: 5000 });
  });

  test("로그인 모달 → 회원가입 전환", async ({ page }) => {
    await page.getByRole("button", { name: "로그인" }).click();
    await expect(page.getByText("스포츠 중계 맛집을 찾아보세요")).toBeVisible();

    // "회원가입" 버튼 (로그인 모달 하단)
    await page.locator("text=아직 회원이 아니신가요?").locator("..").getByText("회원가입").click();

    // 회원가입 모달로 전환
    await expect(page.getByText("회원가입하고 나만의 중계 맛집을 찾아보세요")).toBeVisible({ timeout: 5000 });
  });

  test("회원가입 모달: 필드 입력 → 가입 성공", async ({ page }) => {
    await page.getByRole("button", { name: "회원가입" }).click();
    await expect(page.getByText("회원가입하고 나만의 중계 맛집을 찾아보세요")).toBeVisible({ timeout: 5000 });

    // 폼 입력
    await page.getByPlaceholder("홍길동").fill(TEST_USER.name);
    await page.getByPlaceholder("example@email.com").fill(TEST_USER.email);
    await page.getByPlaceholder("6자 이상 입력하세요").fill(TEST_USER.password);
    await page.getByPlaceholder("비밀번호를 다시 입력하세요").fill(TEST_USER.password);
    await page.getByPlaceholder("010-1234-5678").fill(TEST_USER.phone);
    await page.getByPlaceholder("2~8글자").fill(TEST_USER.nickname);

    // 제출
    await page.locator("form button[type='submit']").click();

    // 성공 토스트
    await expect(page.getByText("회원가입이 완료되었습니다")).toBeVisible({ timeout: 5000 });
  });

  test("회원가입 모달 → 로그인 전환", async ({ page }) => {
    await page.getByRole("button", { name: "회원가입" }).click();
    await expect(page.getByText("회원가입하고 나만의 중계 맛집을 찾아보세요")).toBeVisible({ timeout: 5000 });

    // "로그인" 링크 클릭
    await page.locator("text=이미 계정이 있으신가요?").locator("..").getByText("로그인").click();

    // 로그인 모달로 전환
    await expect(page.getByText("스포츠 중계 맛집을 찾아보세요")).toBeVisible({ timeout: 5000 });
  });

  test("로그인 후 즐겨찾기 탭 접근", async ({ page }) => {
    // 로그인
    await page.getByRole("button", { name: "로그인" }).click();
    await page.getByPlaceholder("example@email.com").fill(TEST_USER.email);
    await page.getByPlaceholder("비밀번호를 입력하세요").fill(TEST_USER.password);
    await page.locator("form button[type='submit']").click();
    await expect(page.getByText("로그인이 완료되었습니다")).toBeVisible({ timeout: 5000 });

    // 즐겨찾기 탭
    await page.getByRole("button", { name: "즐겨찾기" }).first().click();
    await expect(page.getByText("즐겨찾기한 식당이 없습니다")).toBeVisible({ timeout: 5000 });
  });

  test("비로그인 즐겨찾기 → 로그인 유도", async ({ page }) => {
    await page.getByRole("button", { name: "즐겨찾기" }).first().click();
    await expect(page.getByText("자주 찾는 식당을 저장해보세요")).toBeVisible();
    await expect(page.getByRole("button", { name: "로그인하고 시작하기" })).toBeVisible();
  });
});
