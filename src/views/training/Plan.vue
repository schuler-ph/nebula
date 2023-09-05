<template>
  <v-sheet class="d-flex flex-column" rounded="lg">
    <v-sheet class="d-flex flex-column ma-3 align-center" color="transparent">
      <!-- <v-sheet class="text-h5 mb-3">{{
        "Week starting Mon " + weekdays[0].date.toISOString()
      }}</v-sheet> -->
      <v-sheet class="d-flex align-center">
        <v-btn
          v-if="smAndUp"
          prepend-icon="mdi-calendar-arrow-left"
          @click="prevWeek"
          >previous</v-btn
        >
        <v-btn
          v-else
          icon="mdi-calendar-arrow-left"
          @click="prevWeek"
          size="small"
        ></v-btn>
        <v-btn
          v-if="weekdays[0] !== undefined"
          class="mx-3 text-h6 font-weight-black"
        >
          Week No°
          {{ weekdays[0].date.getWeek() }}
        </v-btn>
        <v-btn
          v-if="smAndUp"
          append-icon="mdi-calendar-arrow-right"
          @click="nextWeek"
          >next</v-btn
        >
        <v-btn
          v-else
          icon="mdi-calendar-arrow-right"
          @click="nextWeek"
          size="small"
        ></v-btn>
      </v-sheet>
    </v-sheet>
    <SplitDay
      v-for="wd in weekdays"
      :color="wd.color"
      :weekdayName="wd.name"
      :icon="wd.icon"
      :date="wd.date"
      :contentLength="wd.contentLength"
      :title="wd.instance?.title"
    />
  </v-sheet>
</template>

<script setup lang="ts">
import SplitDay from "@/components/training/SplitDay.vue";
import { ref } from "vue";
import { getDayOfCurrentWeek } from "@/helper/dateHelper";
import { onMounted } from "vue";
import Weekday from "@/types/custom/Weekday";
import { useDisplay } from "vuetify";
const { smAndUp } = useDisplay();

const weekdays = ref<Weekday[]>([]);

function prevWeek() {
  weekdays.value.forEach(async (wd, index) => {
    wd.date = new Date(wd.date.setDate(wd.date.getDate() - 7));
    await wd.setup();
  });
}

function nextWeek() {
  weekdays.value.forEach(async (wd, index) => {
    wd.date = new Date(wd.date.setDate(wd.date.getDate() + 7));
    await wd.setup();
  });
}

async function initiateWeekdays() {
  const weekdayNames: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const colors: string[] = [
    "#673ab7",
    "#603eb6",
    "#5a42b6",
    "#5346b6",
    "#4c4ab6",
    "#454eb5",
    "#3f51b5",
  ];
  const icon: string = "mdi-roman-numeral-";

  for (let i = 1; i <= 7; i++) {
    weekdays.value.push(
      new Weekday(
        i,
        weekdayNames[i - 1],
        colors[i - 1],
        icon + i,
        getDayOfCurrentWeek(i)
      )
    );
  }

  weekdays.value.forEach(async (wd) => {
    await wd.setup();
  });
}

onMounted(async () => {
  await initiateWeekdays();
});
</script>
