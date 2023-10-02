<template>
  <v-sheet
    rounded="lg"
    class="d-flex flex-column ma-1 align-center"
    :color="wd.color"
  >
    <v-row class="my-1">
      <v-btn
        @click="$router.push('/edit/' + dateToIsoString(wd.date))"
        :color="
          dateToIsoString(wd.date) === dateToIsoString(new Date())
            ? 'white'
            : 'transparent'
        "
        :class="
          dateToIsoString(wd.date) === dateToIsoString(new Date())
            ? ''
            : 'text-white'
        "
        class="text-h6 font-weight-black"
      >
        {{
          !xs ? wd.name + " - " : wd.name.charAt(0) + wd.name.charAt(1) + " - "
        }}
        {{ dateToIsoString(wd.date) }}</v-btn
      ></v-row
    >
    <v-row v-if="wd.contentLength !== 0" class="my-2">
      <v-btn
        prepend-icon="mdi-book-open-variant"
        class="mr-2"
        color="deep-purple-lighten-1"
        >{{ wd.contentLength }}</v-btn
      >
      <v-btn
        prepend-icon="mdi-checkbox-marked-circle-outline"
        color="deep-purple-lighten-1"
      >
        {{ wd.doneSubTodos }} /
        {{ totalSubTodos }}
      </v-btn>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import { dateToIsoString } from "@/helper/dateHelper";
import { Weekday, usePlannerStore } from "@/store/plannerStore";
import { useDisplay } from "vuetify";
const { xs } = useDisplay();

const { totalSubTodos } = usePlannerStore();

const { wd } = defineProps<{
  wd: Weekday;
}>();
</script>
