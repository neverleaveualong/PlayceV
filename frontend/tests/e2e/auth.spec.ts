import { test, expect } from "@playwright/test";
import { setupAuthMocks, setupBasicMocks } from "./helpers/setup-mocks";

const TEST_USER = { email: "test@playce.com", password: "test1234", name: "테스트", nickname: "테스터", phone: "010-1234-5678" };

test.describe("인증", () => {
  test.beforeEach(async ({ page }) => {
    await setupBasicMocks(page);
    await setupAuthMocks(page);
    await page.goto("/map");
    await expect(page.getByText("오늘의 중계")).toBeVisible({ timeout: 15000 });
  });

  test("로그인 모달 열기 → 입력 → 로그인 성공", async ({ page }) => {
    await page.getByRole("button", { name: "로그인" }).click();
    await expect(page.getByText("스포츠 중계 맛집을 찾아보세요")).toBeVisible();
    await page.getByPlaceholder("example@email.com").fill(TEST_USER.email);
    await page.getByPlaceholder("비밀번호를 입력하세요").fill(TEST_USER.password);
    await page.locator("form button[type='submit']").click();
    await expect(page.getByText("로그인이 완료되었습니다")).toBeVisible({ timeout: 5000 });
  });

  test("회원가입 모달: 필드 입력 → 가입 성공", async ({ page }) => {
    await page.getByRole("button", { name: "회원가입" }).click();
    await expect(page.getByText("회원가입하고 나만의 중계 맛집을 찾아보세요")).toBeVisible({ timeout: 5000 });
    await page.getByPlaceholder("홍길동").fill(TEST_USER.name);
    await page.getByPlaceholder("example@email.com").fill(TEST_USER.email);
    await page.getByPlaceholder("6자 이상 입력하세요").fill(TEST_USER.password);
    await page.getByPlaceholder("비밀번호를 다시 입력하세요").fill(TEST_USER.password);
    await page.getByPlaceholder("010-1234-5678").fill(TEST_USER.phone);
    await page.getByPlaceholder("2~8글자").fill(TEST_USER.nickname);
    await page.locator("form button[type='submit']").click();
    await expect(page.getByText("회원가입이 완료되었습니다")).toBeVisible({ timeout: 5000 });
  });

  test("로그인 ↔ 회원가입 모달 전환", async ({ page }) => {
    await page.getByRole("button", { name: "로그인" }).click();
    await page.locator("text=아직 회원이 아니신가요?").locator("..").getByText("회원가입").click();
    await expect(page.getByText("회원가입하고 나만의 중계 맛집을 찾아보세요")).toBeVisible({ timeout: 5000 });

    await page.locator("text=이미 계정이 있으신가요?").locator("..").getByText("로그인").click();
    await expect(page.getByText("스포츠 중계 맛집을 찾아보세요")).toBeVisible({ timeout: 5000 });
  });
});
