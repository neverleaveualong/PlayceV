/**
 * 영업시간 문자열("매일 15:00 ~ 01:00" 등)을 파싱하여 현재 영업 중인지 판별
 * - "HH:MM ~ HH:MM" 패턴을 찾아 비교
 * - 종료 시간이 시작 시간보다 작으면 새벽 영업(야간 영업)으로 간주
 */
export function getOpenStatus(openingHours?: string): "open" | "closed" | "unknown" {
  if (!openingHours) return "unknown";

  const match = openingHours.match(/(\d{1,2}):(\d{2})\s*~\s*(\d{1,2}):(\d{2})/);
  if (!match) return "unknown";

  const [, startH, startM, endH, endM] = match.map(Number);
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const openMin = startH * 60 + startM;
  const closeMin = endH * 60 + endM;

  // 야간 영업 (예: 15:00 ~ 01:00)
  if (closeMin <= openMin) {
    return currentMin >= openMin || currentMin < closeMin ? "open" : "closed";
  }

  // 일반 영업 (예: 09:00 ~ 22:00)
  return currentMin >= openMin && currentMin < closeMin ? "open" : "closed";
}

export function getOpenStatusLabel(status: "open" | "closed" | "unknown") {
  switch (status) {
    case "open":
      return "영업중";
    case "closed":
      return "영업종료";
    default:
      return "";
  }
}
