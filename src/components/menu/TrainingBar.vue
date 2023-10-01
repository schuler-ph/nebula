<template>
  <div id="bottomTrainingBar" class="d-flex">
    <div class="mr-5">
      {{ formatTime() }}
    </div>
    <div class="mr-5">{{ trainingSplit }}</div>
    <div class="mr-5">{{ currentExercise }}</div>
    <div class="mr-5">{{ splitExercises[currentExercise]?.name }}</div>
    <br />
    <v-btn @click="() => prev_exercise()">pre</v-btn>
    <v-btn @click="() => next_exercise()">nxt</v-btn>
  </div>
</template>

<script setup lang="ts">
import { usePlannerStore } from "@/store/plannerStore";
import { onMounted, ref } from "vue";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
} from "date-fns";
import { storeToRefs } from "pinia";
const { trainingSplit, currentExercise, splitExercises } = storeToRefs(
  usePlannerStore()
);

const { prev_exercise, next_exercise, trainingStarted } = usePlannerStore();

const hrs = ref(0);
const min = ref(0);
const sec = ref(0);

const tstart = new Date(trainingStarted!);

onMounted(() => {
  setInterval(() => {
    const currentTime = new Date();
    hrs.value = differenceInHours(currentTime, tstart);
    min.value = differenceInMinutes(currentTime, tstart);
    sec.value = differenceInSeconds(currentTime, tstart);
  }, 1000);
});

const formatTime = () => {
  let str = "";
  if (hrs.value % 24 < 10) {
    str += "0" + (hrs.value % 24);
  } else {
    str += hrs.value % 24;
  }
  str += ":";
  if (min.value % 60 < 10) {
    str += "0" + (min.value % 60);
  } else {
    str += min.value % 60;
  }
  str += ":";
  if (sec.value % 60 < 10) {
    str += "0" + (sec.value % 60);
  } else {
    str += sec.value % 60;
  }
  return str;
};
</script>

<style scoped>
#bottomTrainingBar {
  bottom: 0;
  left: 0;
  display: block;
  position: fixed;
  width: 100%;
  height: 5rem;
  border-top: 1px solid black;
  background-color: white;
  z-index: 1000;
}
</style>
