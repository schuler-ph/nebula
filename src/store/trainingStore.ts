import { Row } from "@/types/supabaseHelper";
import { defineStore } from "pinia";
import { useStorageStore } from "./storageStore";

export const useTrainingStore = defineStore("training", {
  state: () => ({
    trainingStatus: false,
    trainingStarted: undefined as Date | undefined,
    trainingSplit: "",
    currentExercise: 0,
    splitExercises: [] as Row<"exercise">[],
  }),
  actions: {
    start_training(split: Row<"split">) {
      if (split) {
        this.splitExercises = [];
        this.trainingStarted = new Date();
        this.trainingSplit = split.name;

        split.exercises.forEach((e) => {
          const { allExercises } = useStorageStore();
          this.splitExercises.push(allExercises.find((ae) => ae.id === e)!);
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
