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
    <v-row v-if="wd.instance && activeDailyTodos" class="my-2">
      <v-btn class="mr-2" color="deep-purple-lighten-1">{{
        wd.instance.content!.length
      }}</v-btn>
      <v-btn color="deep-purple-lighten-1">
        {{ doneSubTodos(activeDailyTodos) }} /
        {{ totalSubTodos(activeDailyTodos) }}
      </v-btn>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import { dateToIsoString } from "@/helper/dateHelper";
import Weekday from "@/types/custom/Weekday";
import { Row } from "@/types/supabaseHelper";
import { useDisplay } from "vuetify";
const { xs } = useDisplay();

type TodoTemplate = Row<"todo"> & { subtodos?: Row<"todo">[] };

const { activeDailyTodos, wd } = defineProps({
  wd: {
    required: true,
    type: Weekday,
  },
  activeDailyTodos: {
    type: Array<TodoTemplate>,
  },
});

const totalSubTodos = (adt: Array<TodoTemplate>) => {
  let num = 0;

  adt!.forEach((a) => {
    num += a.subtodos!.length;
  });

  return num;
};

const doneSubTodos = (adt: Array<TodoTemplate>) => {
  let num = 0;

  adt!.forEach((todo) => {
    num += wd.instance!.todoDailyDone.filter((i1) =>
      todo.subtodos?.some((i2) => i2.id === i1)
    ).length;
  });

  return num;
};
</script>
