import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    showLtDoneTodos: true,
  }),
  actions: {},
  persist: true,
});
