<template>
  <v-sheet class="d-flex flex-column" rounded="lg">
    <v-sheet class="d-flex flex-column ma-3 align-center" color="transparent">
      <!-- <v-sheet class="text-h5 mb-3">{{
        "Week starting Mon " + weekdays[0].date.toISOString()
      }}</v-sheet> -->
      <v-sheet class="d-flex">
        <v-btn
          prepend-icon="mdi-calendar-arrow-left"
          @click="prevWeek"
          class="mr-3"
          >previous</v-btn
        >
        <v-btn append-icon="mdi-calendar-arrow-right" @click="nextWeek"
          >next</v-btn
        >
      </v-sheet>
    </v-sheet>
    <SplitDay
      v-for="wd in weekdays"
      :color="wd.color"
      :title="wd.name"
      :icon="wd.icon"
      :date="wd.date"
    />
  </v-sheet>
</template>

<script setup lang="ts">
import SplitDay from "@/components/training/SplitDay.vue";
import { ref } from "vue";

function getDayOfCurrentWeek(day: number) {
  var curr = new Date();
  return new Date(curr.setDate(curr.getDate() - (curr.getDay() - day)));
}

const weekdays = ref([
  {
    name: "Monday",
    color: "#673ab7",
    icon: "mdi-roman-numeral-1",
    date: getDayOfCurrentWeek(1),
  },
  {
    name: "Tuesday",
    color: "#603eb6",
    icon: "mdi-roman-numeral-2",
    date: getDayOfCurrentWeek(2),
  },
  {
    name: "Wednesday",
    color: "#5a42b6",
    icon: "mdi-roman-numeral-3",
    date: getDayOfCurrentWeek(3),
  },
  {
    name: "Thursday",
    color: "#5346b6",
    icon: "mdi-roman-numeral-4",
    date: getDayOfCurrentWeek(4),
  },
  {
    name: "Friday",
    color: "#4c4ab6",
    icon: "mdi-roman-numeral-5",
    date: getDayOfCurrentWeek(5),
  },
  {
    name: "Saturday",
    color: "#454eb5",
    icon: "mdi-roman-numeral-6",
    date: getDayOfCurrentWeek(6),
  },
  {
    name: "Sunday",
    color: "#3f51b5",
    icon: "mdi-roman-numeral-7",
    date: getDayOfCurrentWeek(7),
  },
]);

function prevWeek() {
  weekdays.value.forEach((wd) => {
    wd.date = new Date(wd.date.setDate(wd.date.getDate() - 7));
  });
}
function nextWeek() {
  weekdays.value.forEach((wd) => {
    wd.date = new Date(wd.date.setDate(wd.date.getDate() + 7));
  });
}
</script>
