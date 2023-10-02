import { supabase } from "@/lib/supabaseClient";
import { Row } from "@/types/supabaseHelper";
import { defineStore } from "pinia";

export const useStorageStore = defineStore("storage", {
  state: () => ({
    loadingData: true,
    allExercises: [] as Row<"exercise">[],
    allSplits: [] as Row<"split">[],
    allEntrys: [] as Row<"diary">[],
    allTodos: [] as Row<"todo">[],
    initWeekdays: null as any,
  }),
  actions: {
    async initEx() {
      const { data, error } = await supabase
        .from("exercise")
        .select()
        .order("category")
        .order("isSkill", { ascending: false })
        .order("subCategory")
        .order("name");
      if (error === null && data.length !== 0) {
        this.allExercises = data;
      }
    },
    async initExSingle() {
      this.loadingData = true;
      await this.initEx();
      this.loadingData = false;
    },
    async initSplits() {
      const { data, error } = await supabase
        .from("split")
        .select()
        .order("index", { ascending: true });
      if (error === null && data.length !== 0) {
        this.allSplits = data;
      }
    },
    async initSplitsSingle() {
      this.loadingData = true;
      await this.initSplits();
      this.loadingData = false;
    },
    async initDiary() {
      const { data, error } = await supabase
        .from("diary")
        .select()
        .order("day", { ascending: false });
      if (error === null && data.length !== 0) {
        this.allEntrys = data;
      }
    },
    async initDiarySingle() {
      this.loadingData = true;
      await this.initDiary();
      this.loadingData = false;
    },
    async initTodos() {
      const { data, error } = await supabase.from("todo").select();
      if (error === null && data.length !== 0) {
        this.allTodos = data;
      }
    },
    async initTodosSingle() {
      this.loadingData = true;
      await this.initTodos();
      this.loadingData = false;
    },
    async initAll() {
      this.loadingData = true;
      await this.initEx();
      await this.initDiary();
      await this.initSplits();
      await this.initTodos();
      this.loadingData = false;
    },
  },
});
