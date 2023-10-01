import { supabase } from "@/lib/supabaseClient";
import { Row } from "@/types/supabaseHelper";
import { defineStore } from "pinia";

export const useStorageStore = defineStore("storage", {
  state: () => ({
    allExercises: [] as Row<"exercise">[],
    allSplits: [] as Row<"split">[],
    allEntrys: [] as Row<"diary">[],
    allTodos: [] as Row<"todo">[],
  }),
  actions: {
    async initEx() {
      const { data, error } = await supabase.from("exercise").select();
      if (error === null && data.length !== 0) {
        this.allExercises = data;
      }
    },
    async initSplits() {
      const { data, error } = await supabase.from("split").select();
      if (error === null && data.length !== 0) {
        this.allSplits = data;
      }
    },
    async initDiary() {
      const { data, error } = await supabase.from("diary").select();
      if (error === null && data.length !== 0) {
        this.allEntrys = data;
      }
    },
    async initTodos() {
      const { data, error } = await supabase.from("todo").select();
      if (error === null && data.length !== 0) {
        this.allTodos = data;
      }
    },
  },
});
