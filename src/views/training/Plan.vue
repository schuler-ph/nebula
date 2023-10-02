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
          @click="() => currentWeek()"
          :color="
            weekdays[0].date.getWeek() === currentDate.getWeek()
              ? 'transparent'
              : 'primary'
          "
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
    <SplitDay v-for="wd in weekdays" :wd="wd" />
  </v-sheet>
</template>

<script setup lang="ts">
import SplitDay from "@/components/training/SplitDay.vue";
import { onMounted } from "vue";
import { useDisplay } from "vuetify";
import { usePlannerStore } from "@/store/plannerStore";
import { storeToRefs } from "pinia";

const { weekdays } = storeToRefs(usePlannerStore());
const { nextWeek, prevWeek, currentWeek, initiateWeekdays } = usePlannerStore();
const { smAndUp } = useDisplay();

const currentDate = new Date();

onMounted(() => {
  initiateWeekdays();
});
</script>
