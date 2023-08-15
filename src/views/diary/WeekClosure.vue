<template>
  <v-sheet class="d-flex flex-column">
    <div class="d-flex justify-center align-center ma-3">
      <v-btn
        size="x-small"
        icon="mdi-minus"
        :onclick="
          () => {
            selectedWeek -= 1;
            updateWeekValues();
          }
        "
      ></v-btn>
      <v-btn
        :onclick="
          () => {
            selectedWeek = 0;
            updateWeekValues();
          }
        "
        class="mx-3"
        variant="tonal"
        >{{ selectedWeek }}</v-btn
      >
      <v-btn
        size="x-small"
        icon="mdi-plus"
        :onclick="
          () => {
            selectedWeek += 1;
            updateWeekValues();
          }
        "
      ></v-btn>
    </div>
    <div class="d-flex justify-center">
      <div>
        {{ weekIsoDates.at(0) }} - {{ weekIsoDates.at(-1) }} (ISO week
        {{
          new Date(weekIsoDates[0]).getWeekYear() +
          "-" +
          new Date(weekIsoDates[0]).getWeek()
        }})
      </div>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { onMounted } from "vue";
import { getWeekIsoDates } from "@/helper/dateHelper";
import { ref } from "vue";

const selectedWeek = ref(0);
const weekIsoDates = ref(getWeekIsoDates());
function updateWeekValues() {
  weekIsoDates.value = getWeekIsoDates(selectedWeek.value);
}
</script>

<style scoped></style>
