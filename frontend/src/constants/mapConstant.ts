export const CITY_STATION = {
  lat: 37.56368,
  lng: 126.97558,
};

// 초기 bounds: 시청역 기준 약 5km 범위
export const INITIAL_BOUNDS = {
  swLat: 37.51868,
  swLng: 126.93058,
  neLat: 37.60868,
  neLng: 127.02058,
};

// 퀵 이동 도시 목록
const BOUNDS_OFFSET = 0.045;

const makeBounds = (lat: number, lng: number) => ({
  swLat: lat - BOUNDS_OFFSET,
  swLng: lng - BOUNDS_OFFSET,
  neLat: lat + BOUNDS_OFFSET,
  neLng: lng + BOUNDS_OFFSET,
});

export const QUICK_CITIES = [
  { name: "서울", lat: 37.5665, lng: 126.978 },
  { name: "부산", lat: 35.1796, lng: 129.0756 },
  { name: "대구", lat: 35.8714, lng: 128.6014 },
  { name: "인천", lat: 37.4563, lng: 126.7052 },
  { name: "광주", lat: 35.1595, lng: 126.8526 },
  { name: "대전", lat: 36.3504, lng: 127.3845 },
  { name: "수원", lat: 37.2636, lng: 127.0286 },
  { name: "전주", lat: 35.8242, lng: 127.148 },
  { name: "청주", lat: 36.6424, lng: 127.489 },
  { name: "창원", lat: 35.2281, lng: 128.6812 },
  { name: "천안", lat: 36.8151, lng: 127.1139 },
  { name: "제주", lat: 33.4996, lng: 126.5312 },
] as const;

export const getCityBounds = (city: (typeof QUICK_CITIES)[number]) =>
  makeBounds(city.lat, city.lng);
