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
          @click="() => resetWeek()"
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
    <SplitDay v-for="wd in weekdays" :wd="wd" :activeDailyTodos="template" />
  </v-sheet>
</template>

<script setup lang="ts">
import SplitDay from "@/components/training/SplitDay.vue";
import { ref } from "vue";
import { getWeekIsoDates } from "@/helper/dateHelper";
import { onMounted } from "vue";
import Weekday from "@/types/custom/Weekday";
import { useDisplay } from "vuetify";
import { supabase } from "@/lib/supabaseClient";
import { Row } from "@/types/supabaseHelper";
import router from "@/router";
import { usePlannerStore } from "@/store/plannerStore";

const { weekOffset, increment, decrement, reset } = usePlannerStore();

const { smAndUp } = useDisplay();

const weekdays = ref<Weekday[]>([]);
const template = ref<TodoTemplate[]>([]);
type TodoTemplate = Row<"todo"> & { subtodos?: Row<"todo">[] };

function prevWeek() {
  decrement();
  weekdays.value.forEach((wd) => {
    wd.date = new Date(wd.date.setDate(wd.date.getDate() - 7));
    wd.setup();
  });
}

function resetWeek() {
  reset();
  const weekDates = getWeekIsoDates(0);
  weekdays.value.forEach((wd, index) => {
    wd.date = new Date(weekDates[index]);
    wd.setup();
  });
}

function nextWeek() {
  increment();
  weekdays.value.forEach((wd) => {
    wd.date = new Date(wd.date.setDate(wd.date.getDate() + 7));
    wd.setup();
  });
}

async function initiateWeekdays() {
  weekdays.value = [];

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

  const weekDates = getWeekIsoDates(weekOffset);

  for (let i = 1; i <= 7; i++) {
    weekdays.value.push(
      new Weekday(
        i,
        weekdayNames[i - 1],
        colors[i - 1],
        new Date(weekDates[i - 1])
      )
    );
  }

  weekdays.value.forEach(async (wd) => {
    await wd.setup();
  });
}

onMounted(async () => {
  await initiateWeekdays();

  const { data, error } = await supabase
    .from("todo")
    .select()
    .not("inactive", "eq", true)
    .eq("category", "daily")
    .order("order", { ascending: true });

  if (error === null && data.length !== 0) {
    let todos: Row<"todo">[];
    template.value = [];
    todos = data.filter((d) => d.subtodo_of === null);
    todos.forEach((t) => {
      const subtodos = data.filter((d) => d.subtodo_of === t.id);
      template.value.push({
        ...t,
        subtodos,
      });
    });
  }
});
</script>
