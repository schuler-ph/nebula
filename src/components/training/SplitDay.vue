<template>
  <v-sheet
    rounded="lg"
    class="d-flex flex-column ma-1 align-center"
    height="100"
    :color="color"
  >
    <v-btn
      @click="$router.push('/edit/' + dateToIsoString(date))"
      :prepend-icon="icon"
      :color="
        dateToIsoString(date) === dateToIsoString(new Date())
          ? 'white'
          : 'transparent'
      "
      :class="
        dateToIsoString(date) === dateToIsoString(new Date())
          ? ''
          : 'text-white'
      "
      class="text-h6 font-weight-black"
      >{{
        weekdayName + " - " + dateToIsoString(date) + " - " + contentLength
      }}</v-btn
    >
  </v-sheet>
</template>

<script setup lang="ts">
import { dateToIsoString } from "@/helper/dateHelper";
defineProps(["weekdayName", "color", "icon", "date", "contentLength"]);
</script>
