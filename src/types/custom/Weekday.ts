import { getDayOfCurrentWeek, dateToIsoString } from "@/helper/dateHelper";
import { Row } from "../supabaseHelper";
import { useStorageStore } from "@/store/storageStore";

export default class Weekday {
  index: number;
  name: string;
  color: string;
  date: Date;
  instance?: Row<"diary">;
  contentLength: number;

  constructor(index: number, name: string, color: string, date: Date) {
    this.index = index;
    this.name = name;
    this.color = color;
    this.date = date;
    this.contentLength = 0;
  }

  setup() {
    this.instance = this.getWeekdayEntry();
  }

  getWeekdayEntry() {
    const { allEntrys } = useStorageStore();
    const wdEntry = allEntrys.find(
      (ae) => ae.day === dateToIsoString(this.date)
    );

    if (wdEntry) {
      this.contentLength = this.getFullContentLength(wdEntry);
      return wdEntry;
    } else {
      this.contentLength = 0;
      return undefined;
    }
  }

  getFullContentLength(instance: any) {
    let len = 0;
    len += instance.content.length;
    return len;
  }
}
