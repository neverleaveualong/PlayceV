export const getToday = () => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    date: today.getDate(),
    dateString: today.toISOString().slice(0, 10),
  };
};
