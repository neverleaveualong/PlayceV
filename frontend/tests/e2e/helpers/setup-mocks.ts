import type { Page } from "@playwright/test";
import { MOCK_STORE, MOCK_USER, MOCK_BIG_REGIONS, MOCK_SMALL_REGIONS, MOCK_SPORTS, MOCK_LEAGUES } from "./mock-data";

export async function setupBasicMocks(page: Page) {
  await page.route("**/search/nearby*", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true, data: [MOCK_STORE] }),
  }));
  await page.route("**/stores/1", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true, data: MOCK_STORE }),
  }));
}

export async function setupSearchMocks(page: Page) {
  await setupBasicMocks(page);
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
}

export async function setupAuthMocks(page: Page) {
  await page.route("**/users/login", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ data: { token: "mock-jwt-token" } }),
  }));
  await page.route("**/users/join", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true }),
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

export async function setupFilterModalMocks(page: Page) {
  await setupBasicMocks(page);
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

export async function setupMyPageMocks(page: Page) {
  await setupAuthMocks(page);
  await page.route("**/users/me", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true, data: MOCK_USER }),
  }));
  await page.route("**/stores/mypage", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ success: true, data: [{ ...MOCK_STORE, business_number: "123-45-67890" }] }),
  }));
  await page.route("**/stores/1", (r) => {
    if (r.request().method() === "GET") return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: MOCK_STORE }) });
    return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
  });
  await page.route("**/stores", (r) => {
    if (r.request().method() === "POST") return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
    return r.continue();
  });
  await page.route("**/broadcasts/stores/*", (r) => r.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({
      success: true, data: [{
        id: 1, match_date: MOCK_STORE.broadcasts[0].match_date, match_time: "16:30",
        sport: { id: 1, name: "축구" }, league: { id: 1, name: "K리그 1" },
        team_one: "대전 시티즌", team_two: "수원 삼성", etc: "",
      }],
    }),
  }));
  await page.route("**/broadcasts", (r) => {
    if (r.request().method() === "POST") return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
    return r.continue();
  });
  await page.route("**/broadcasts/*", (r) => {
    const m = r.request().method();
    if (m === "PATCH" || m === "DELETE") return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
    return r.continue();
  });
  await page.route("**/search/nearby*", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [] }) }));
  await page.route("**/sports", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: MOCK_SPORTS }) }));
  await page.route("**/leagues*", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: MOCK_LEAGUES }) }));
  await page.route("**/big-regions*", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [] }) }));
}

export async function loginAndOpenMypage(page: Page) {
  await page.goto("/map");
  await page.getByRole("button", { name: "로그인" }).click();
  await page.getByPlaceholder("example@email.com").fill("test@playce.com");
  await page.getByPlaceholder("비밀번호를 입력하세요").fill("test1234");
  await page.locator("form button[type='submit']").click();
  await page.getByText("로그아웃").waitFor({ timeout: 10000 });
  await page.getByText("마이페이지").click();
}
