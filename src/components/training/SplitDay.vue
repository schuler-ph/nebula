<template>
  <v-sheet
    rounded="lg"
    class="d-flex flex-column ma-1 align-center"
    height="100"
    :color="color"
  >
    <v-btn
      :prepend-icon="icon"
      :color="
        dateToIsoString(date) === dateToIsoString(new Date())
          ? 'deep-purple-darken-4'
          : 'transparent'
      "
      class="text-white text-h6 font-weight-black"
      >{{ title + " - " + dateToIsoString(date) }}</v-btn
    >
  </v-sheet>
</template>

<script setup lang="ts">
import { dateToIsoString } from "@/helper/dateHelper";
defineProps(["title", "color", "icon", "date"]);
</script>
