import { defineStore } from "pinia";

export const usePlannerStore = defineStore("planner", {
  state: () => ({
    weekOffset: 0,
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
  },
});
