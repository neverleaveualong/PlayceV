export const TODAY = new Date().toISOString().slice(0, 10);

export const MOCK_STORE = {
  store_id: 1, id: 1, store_name: "교촌치킨 서울시청점", type: "치킨",
  address: "서울 중구 세종대로18길 6", opening_hours: "매일 12:00 ~ 24:00",
  phone: "02-1234-5678", lat: 37.5665, lng: 126.978,
  main_img: "/noimg.png", description: "",
  images: [{ imgUrl: "/noimg.png", isMain: true }],
  menus: [{ name: "후라이드", price: 18000 }],
  broadcasts: [
    { match_date: TODAY, match_time: "16:30", sport: "축구", league: "K리그 1", team_one: "대전 시티즌", team_two: "수원 삼성", etc: "" },
    { match_date: TODAY, match_time: "19:00", sport: "야구", league: "KBO", team_one: "두산 베어스", team_two: "LG 트윈스", etc: "" },
  ],
};

export const MOCK_USER = {
  id: 1, name: "테스트", nickname: "테스터",
  email: "test@playce.com", phone: "010-1234-5678",
};

export const MOCK_BIG_REGIONS = [
  { id: 1, name: "서울" }, { id: 2, name: "경기" },
  { id: 3, name: "강원" }, { id: 4, name: "인천" }, { id: 5, name: "부산" },
];

export const MOCK_SMALL_REGIONS = [
  { id: 1, name: "전체", big_region_id: 3 }, { id: 2, name: "원주시", big_region_id: 3 },
  { id: 3, name: "춘천시", big_region_id: 3 }, { id: 4, name: "강릉시", big_region_id: 3 },
];

export const MOCK_SPORTS = [
  { id: 1, name: "축구", isTeamCompetition: true },
  { id: 2, name: "야구", isTeamCompetition: true },
  { id: 3, name: "농구", isTeamCompetition: true },
];

export const MOCK_LEAGUES = [
  { id: 1, name: "K리그 1", sport_id: 1 },
  { id: 2, name: "프리미어리그", sport_id: 1 },
];
