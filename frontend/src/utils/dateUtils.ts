export const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dateString = `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
  return { year, month, date, dateString };
};

export function getDay(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
}

export function getDayIdx(year: number, month: number, day: number) {
  return new Date(year, month - 1, day).getDay();
}

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

export default getDaysInMonth;
