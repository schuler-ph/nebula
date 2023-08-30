import { getDayOfCurrentWeek, dateToIsoString } from "@/helper/dateHelper";
import { Row } from "../supabaseHelper";
import { supabase } from "@/lib/supabaseClient";

export default class Weekday {
  index: number;
  name: string;
  color: string;
  icon: string;
  date: Date;
  instance?: Row<"diary">;
  contentLength: number;

  constructor(
    index: number,
    name: string,
    color: string,
    icon: string,
    date: Date
  ) {
    this.index = index;
    this.name = name;
    this.color = color;
    this.icon = icon;
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
      .eq("day", dateToIsoString(getDayOfCurrentWeek(this.index)));
    if (error === null && data.length !== 0) {
      this.contentLength = this.getFullContentLength(data[0]);
      console.log(data[0]);
      return data[0];
    }
  }

  getFullContentLength(instance: any) {
    let len = 0;
    len += instance.title.length;
    len += instance.content.length;
    len += instance.content_uni.length;
    len += instance.content_training.length;
    len += instance.content_projects.length;
    return len;
  }
}
