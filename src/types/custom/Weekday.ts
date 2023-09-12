import { getDayOfCurrentWeek, dateToIsoString } from "@/helper/dateHelper";
import { Row } from "../supabaseHelper";
import { supabase } from "@/lib/supabaseClient";

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

  async setup() {
    this.instance = await this.getWeekdayEntry();
  }

  async getWeekdayEntry() {
    const { data, error } = await supabase
      .from("diary")
      .select()
      .eq("day", dateToIsoString(this.date));
    if (error === null && data.length !== 0) {
      this.contentLength = this.getFullContentLength(data[0]);
      return data[0];
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
