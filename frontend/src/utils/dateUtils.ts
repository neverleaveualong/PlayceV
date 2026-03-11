export const getToday = () => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    date: today.getDate(),
    dateString: today.toISOString().slice(0, 10),
  };
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
