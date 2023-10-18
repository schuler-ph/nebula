import { supabase } from "@/lib/supabaseClient";
import { Row } from "@/types/supabaseHelper";
import { defineStore } from "pinia";
import { useStorageStore } from "./storageStore";
import { dateToIsoString, getWeekIsoDates } from "@/helper/dateHelper";
import { add, sub } from "date-fns";
import { getDailyTodos } from "./storage/todos";

const weekdayNames: string[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const colors: string[] = [
  "#673ab7",
  "#603eb6",
  "#5a42b6",
  "#5346b6",
  "#4c4ab6",
  "#454eb5",
  "#3f51b5",
];
export interface Weekday {
  index: number;
  name: string;
  color: string;
  date: Date;
  instance?: Row<"diary">;
  contentLength: number;
  doneSubTodos: number;
  linkedTodos: string[];
}

export const usePlannerStore = defineStore("planner", {
  state: () => ({
    totalSubTodos: 0,
    weekdays: [] as Array<Weekday>,
    weekOffset: 0,
  }),
  actions: {
    nextWeek() {
      this.weekOffset++;
      this.weekdays.forEach((wd) => {
        wd.date = add(wd.date, { days: 7 }) as Date;
      });
      this.initiateWeekdays();
    },
    prevWeek() {
      this.weekOffset--;
      this.weekdays.forEach((wd) => {
        wd.date = sub(wd.date, { days: 7 });
      });
      this.initiateWeekdays();
    },
    currentWeek() {
      this.weekOffset = 0;
      const weekDates = getWeekIsoDates(0);
      this.weekdays.forEach((wd, index) => {
        wd.date = new Date(weekDates[index]) as Date;
      });
      this.initiateWeekdays();
    },
    create_weekday(index: number, name: string, color: string, date: Date) {
      const { allEntries, allTodos } = useStorageStore();
      const wdEntry = allEntries.find((ae) => ae.day === dateToIsoString(date));

      const wdTemp: Weekday = {
        index: index,
        name: name,
        color: color,
        date: date,
        contentLength: 0,
        doneSubTodos: 0,
        linkedTodos: [],
      };

      if (wdEntry && wdEntry.content) {
        wdTemp.contentLength = wdEntry.content.length;
        wdTemp.instance = wdEntry;
        let num = 0;
        const adt = getDailyTodos(true);
        adt.forEach((todo) => {
          if (wdTemp.instance) {
            num += wdTemp.instance.todoDailyDone.filter((i1) =>
              todo.subtodos?.some((i2) => i2.id === i1)
            ).length;
          }
        });
        wdTemp.doneSubTodos = num;
      } else {
        wdTemp.contentLength = 0;
        wdTemp.instance = undefined;
      }

      allTodos.forEach((at) => {
        if (at.linked_date?.split(" ")[0] === dateToIsoString(date) && !at.done)
          wdTemp.linkedTodos.push(at.id);
      });

      return wdTemp;
    },
    initiateWeekdays() {
      this.weekdays = [];

      const weekDates = getWeekIsoDates(this.weekOffset);

      let num = 0;
      const adt = getDailyTodos(true);
      adt.forEach((a) => {
        if (a.subtodos) num += a.subtodos.length;
      });
      this.totalSubTodos = num;

      for (let i = 1; i <= 7; i++) {
        this.weekdays.push(
          this.create_weekday(
            i,
            weekdayNames[i - 1],
            colors[i - 1],
            new Date(weekDates[i - 1])
          )
        );
      }
    },
  },
});
