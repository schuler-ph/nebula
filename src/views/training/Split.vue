<template>
  <v-sheet rounded="lg">
    <v-select
      v-model="selectedEntry"
      :items="splitNames"
      @update:model-value="console.log(selectedEntry)"
    >
    </v-select>
  </v-sheet>
  <CustomSnackbar
    v-model="snackbarOpen"
    :text="snackbarText"
    :color="snackbarColor"
  />
</template>

<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { onMounted, ref } from "vue";
import { Row } from "@/types/supabaseHelper";
import { useSnackbar } from "@/hooks/useSnackbar";
import CustomSnackbar from "@/components/generic/CustomSnackbar.vue";

const { snackbarOpen, snackbarText, snackbarColor, newSnackbarMessage } =
  useSnackbar();
const splits = ref<Row<"split">[]>([]);
const splitNames = ref<string[]>([]);
const selectedEntry = ref();

onMounted(async () => {
  const { data, error } = await supabase
    .from("split")
    .select()
    .order("index", { ascending: true });
  if (error === null) {
    data.forEach((d) => {
      splitNames.value.push(d.name);
    });
  } else {
    console.log("SELECT ERROR", error);
    newSnackbarMessage(error.message, "error");
  }
});
</script>
