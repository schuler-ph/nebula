import { useStorageStore } from "../storageStore";

export const getSplitByDayOfWeekNumber = (day: number) => {
  const { allSplits } = useStorageStore();
  return allSplits.filter((as) => as.weekdaySelection.includes(day));
};
