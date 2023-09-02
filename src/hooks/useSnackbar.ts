import { ref } from "vue";

export function useSnackbar() {
  const snackbarOpen = ref(false);
  const snackbarText = ref("");
  const snackbarColor = ref("");

  function newSnackbarMessage(text: string, color: string) {
    snackbarText.value = text;
    switch (color) {
      case "error":
        snackbarColor.value = "red-darken-4";
        break;
      case "info":
        snackbarColor.value = "blue";
        break;
    }
    snackbarOpen.value = true;
  }

  return { snackbarOpen, snackbarText, snackbarColor, newSnackbarMessage };
}
