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
import { usePlannerStore } from "@/store/plannerStore";
import { supabase } from "@/lib/supabaseClient";
import { onMounted, ref } from "vue";
import { Row } from "@/types/supabaseHelper";

const splits = ref<Row<"split">[]>();
const selectedSplit = ref<Row<"split">>();

onMounted(async () => {
  const { data, error } = await supabase
    .from("split")
    .select()
    .order("index", { ascending: true });
  if (error === null && data.length !== 0) {
    splits.value = data;
  } else {
    console.log(error);
  }
});

const { start_training, end_training } = usePlannerStore();

const itemProps: any = (item: Row<"split">) => {
  return {
    title: item.name,
  };
};
</script>

<style scoped></style>
