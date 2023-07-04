export function dateToIsoString(date1: Date) {
  let str = "";
  str += date1.getFullYear();
  str += "-";
  if ((date1.getMonth() as number) + 1 < 10) {
    str += 0;
  }
  str += date1.getMonth() + 1;
  str += "-";
  if ((date1.getDate() as number) < 10) {
    str += 0;
  }
  str += date1.getDate();
  return str;
}
