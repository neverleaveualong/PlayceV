export const formatTime = (time: string) => {
  const [hour, minute] = time.split(":");
  const h = parseInt(hour, 10);
  const m = parseInt(minute, 10);

  if (m === 0) {
    return `${h}시`;
  }
  return `${h}시 ${m}분`;
};

export const formatTimeShort = (timeStr: string | undefined | null): string => {
  if (!timeStr) return "";
  return timeStr.split(":").slice(0, 2).join(":");
};
