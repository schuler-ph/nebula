<template>
  <v-sheet
    rounded="lg"
    class="d-flex flex-column ma-1 align-center"
    :class="
      dateToIsoString(new Date()) === dateToIsoString(wd.date)
        ? 'nebulaBgGradient splitDayBorder'
        : 'splitDayBorder'
    "
    :style="'border-color: ' + wd.color + ';'"
    elevation="5"
  >
    <v-row class="my-1">
      <v-btn
        @click="$router.push('/edit/' + dateToIsoString(wd.date))"
        :color="
          dateToIsoString(new Date()) === dateToIsoString(wd.date)
            ? 'white'
            : 'transparent'
        "
        :class="
          dateToIsoString(new Date()) === dateToIsoString(wd.date)
            ? 'font-weight-black splitDayBorder text-h6'
            : 'splitDayBorder'
        "
        :style="'border-color: ' + wd.color + ';'"
      >
        <span
          :class="
            dateToIsoString(new Date()) === dateToIsoString(wd.date)
              ? 'nebulaTextGradient'
              : ''
          "
        >
          {{
            !xs
              ? wd.name + " - "
              : wd.name.charAt(0) + wd.name.charAt(1) + " - "
          }}
          {{ dateToIsoString(wd.date) }}</span
        ></v-btn
      ></v-row
    >
    <v-row class="my-2">
      <v-btn
        v-if="wd.contentLength !== 0"
        prepend-icon="mdi-book-open-variant"
        class="mr-2 splitDayBorder"
        color="transparent"
        :style="'border-color: ' + wd.color + ';'"
        >{{ wd.contentLength }}</v-btn
      >
      <v-btn
        v-if="wd.doneSubTodos !== 0"
        class="mr-2 splitDayBorder"
        :style="'border-color: ' + wd.color + ';'"
        prepend-icon="mdi-checkbox-marked-circle-outline"
        color="transparent"
      >
        {{ wd.doneSubTodos }} /
        {{ totalSubTodos }}
      </v-btn>
      <v-btn
        color="transparent"
        class="mr-2 splitDayBorder"
        :style="'border-color: ' + wd.color + ';'"
        v-for="sp in splits"
      >
        {{ sp.name }}
      </v-btn>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import { dateToIsoString } from "@/helper/dateHelper";
import { Weekday, usePlannerStore } from "@/store/plannerStore";
import { getSplitByDayOfWeekNumber } from "@/store/storage/splits";
import { useDisplay } from "vuetify";
const { xs } = useDisplay();
const { totalSubTodos } = usePlannerStore();

const { wd } = defineProps<{
  wd: Weekday;
}>();

const splits = getSplitByDayOfWeekNumber(wd.date.getDay());
</script>

<style scoped>
.nebulaBgGradient {
  background-image: linear-gradient(90deg, #c782f1, #5270dc);
  -webkit-text-fill-color: transparent;
  -webkit-text-fill-color: white;
}

.splitDayBorder {
  border: 2px solid;
}

.nebulaTextGradient {
  background-image: linear-gradient(90deg, #c782f1, #5270dc);
  background-clip: border-box;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
