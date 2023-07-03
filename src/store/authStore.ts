import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    auth_valid: false,
    auth_loading: true,
  }),
  actions: {
    validated() {
      this.auth_valid = true;
      this.auth_loading = false;
    },
    rejected() {
      this.auth_valid = false;
      this.auth_loading = false;
    },
    startLoading() {
      this.auth_loading = true;
    },
  },
});
