import { defineStore } from "pinia";

export const usePlannerStore = defineStore("planner", {
  state: () => ({
    weekOffset: 0,
    trainingStatus: true,
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
    start_training() {
      this.trainingStatus = true;
    },
    end_training() {
      this.trainingStatus = false;
    },
  },
  persist: true,
});
