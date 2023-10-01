import { supabase } from "@/lib/supabaseClient";
import { Row } from "@/types/supabaseHelper";
import { defineStore } from "pinia";

export const usePlannerStore = defineStore("planner", {
  state: () => ({
    weekOffset: 0,
    trainingStatus: false,
    trainingStarted: undefined as Date | undefined,
    trainingSplit: "",
    currentExercise: 0,
    splitExercises: [] as Row<"exercise">[],
  }),
  actions: {
    increment() {
      this.weekOffset++;
    },
    decrement() {
      this.weekOffset--;
    },
    reset() {
      this.weekOffset = 0;
    },
    start_training(split: Row<"split">) {
      if (split) {
        this.trainingStarted = new Date();
        this.trainingSplit = split.name;

        split.exercises.forEach(async (e) => {
          const { data, error } = await supabase
            .from("exercise")
            .select()
            .eq("id", e);
          if (error === null && data.length !== 0) {
            this.splitExercises.push(data[0]);
          }
        });

        this.currentExercise = 0;
        this.trainingStatus = true;
      }
    },
    end_training() {
      this.trainingSplit = "";
      this.splitExercises = [];
      this.trainingStatus = false;
    },
    next_exercise() {
      if (this.currentExercise + 1 < this.splitExercises.length) {
        this.currentExercise++;
      }
    },
    prev_exercise() {
      if (this.currentExercise - 1 >= 0) {
        this.currentExercise--;
      }
    },
  },
  persist: true,
});
