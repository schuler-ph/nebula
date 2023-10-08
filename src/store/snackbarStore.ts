import { defineStore } from "pinia";

export const useSnackbarStore = defineStore("snackbar", {
  state: () => ({
    snackbarOpen: false,
    snackbarText: "",
    snackbarColor: "",
  }),
  actions: {
    newSnackbarMessage(text: string, color: string) {
      this.snackbarText = text;
      switch (color) {
        case "error":
          this.snackbarColor = "red-darken-4";
          break;
        case "info":
          this.snackbarColor = "blue";
          break;
        default:
          this.snackbarColor = "white";
      }
      this.snackbarOpen = true;
    },
  },
});
