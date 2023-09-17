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

export function getDayOfCurrentWeek(day: number) {
  var curr = new Date();
  return curr.getDay() === 0 ? new Date(curr.setDate(curr.getDate() - (7 - day))) : new Date(curr.setDate(curr.getDate() - (curr.getDay() - day)));
}

export function getWeekIsoDates(offset: number = 0) {
  const monday = 1 + offset * 7;
  const sunday = 7 + offset * 7;
  const weekDates = [];
  for (let i = monday; i <= sunday; i++) {
    weekDates.push(dateToIsoString(getDayOfCurrentWeek(i)));
  }
  return weekDates;
}

declare global {
  interface Date {
    getWeek(): number;
    getWeekYear(): number;
    getWeekDayName(): string;
  }
}

export function getWeekFunctions() {
  // This script is released to the public domain and may be used, modified and
  // distributed without restrictions. Attribution not necessary but appreciated.
  // Source: https://weeknumber.com/how-to/javascript

  // Returns the ISO week of the date.
  Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  };

  // Returns the four-digit year corresponding to the ISO week of the date.
  Date.prototype.getWeekYear = function () {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    return date.getFullYear();
  };

  Date.prototype.getWeekDayName = function () {
    const weekdayNames: string[] = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return weekdayNames[this.getDay()];
  };
}
