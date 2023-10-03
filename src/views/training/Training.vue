<template>
  <div>
    <v-select
      v-model="selectedSplit"
      :items="splits"
      :item-props="itemProps"
    ></v-select>
    <v-btn @click="() => start_training(selectedSplit!)">Start</v-btn>
    <v-btn @click="() => end_training()">End</v-btn>
  </div>
</template>

<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { onMounted, ref } from "vue";
import { Row } from "@/types/supabaseHelper";
import { useStorageStore } from "@/store/storageStore";
import { useTrainingStore } from "@/store/trainingStore";

const splits = ref<Row<"split">[]>();
const selectedSplit = ref<Row<"split">>();

const { allSplits } = useStorageStore();

onMounted(() => {
  splits.value = allSplits;
});

const { start_training, end_training } = useTrainingStore();

const itemProps: any = (item: Row<"split">) => {
  return {
    title: item.name,
  };
};
</script>

<style scoped></style>
