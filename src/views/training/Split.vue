<template>
  <v-sheet rounded="lg" class="pa-3">
    <v-select
      v-model="selectedSplit"
      :items="splits"
      item-title="name"
      item-value="id"
      hide-details
      class="mb-3"
      @update:model-value="
        (mv) => {
          selectedCategories = splits.find((s) => s.id === mv)?.categories!
        }
      "
    />

    <v-sheet v-if="selectedSplit !== undefined">
      <div class="d-flex align-center mb-3">
        <v-select
          v-model="selectedCategories"
          :items="categories"
          multiple
          chips
          hide-details
          @update:model-value="
            (mv) => {
              getExercisesBySelCat();
            }
          "
        />
      </div>
      <div v-if="exercisesByCategory.length !== 0">
        <v-select
          v-model="selectedExercises"
          :items="exercisesByCategory"
          :item-props="itemProps"
          multiple
          chips
        ></v-select>
      </div>
    </v-sheet>

    <v-btn @click="() => submitChanges()">Submit</v-btn>
  </v-sheet>
  <CustomSnackbar
    v-model="snackbarOpen"
    :text="snackbarText"
    :color="snackbarColor"
  />
</template>

<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { onMounted, ref } from "vue";
import { Row } from "@/types/supabaseHelper";
import { useSnackbar } from "@/hooks/useSnackbar";
import CustomSnackbar from "@/components/generic/CustomSnackbar.vue";
import {
  capFirst,
  subCategoryTranslator,
  skillTranslator,
} from "@/helper/stringHelper";

const { snackbarOpen, snackbarText, snackbarColor, newSnackbarMessage } =
  useSnackbar();
const splits = ref<Row<"split">[]>([]);
const selectedSplit = ref();

const categories = ["Push", "Pull", "Legs", "Core"];
const selectedCategories = ref<Array<string>>([]);

const exercisesByCategory = ref<Row<"exercise">[]>([]);
const selectedExercises = ref<Array<string>>([]);

onMounted(async () => {
  await getSplits();
});

const getSplits = async () => {
  const { data, error } = await supabase
    .from("split")
    .select()
    .order("index", { ascending: true });
  if (error === null && data.length !== 0) {
    splits.value = data;
  } else {
    console.log(error);
  }
};

const getExercisesBySelCat = async () => {
  exercisesByCategory.value = [];
  const { data, error } = await supabase
    .from("exercise")
    .select()
    .order("category")
    .order("isSkill", { ascending: false })
    .order("subCategory")
    .order("name");
  if (error === null && data.length !== 0) {
    selectedCategories.value.forEach((sel) => {
      exercisesByCategory.value.push(...data.filter((d) => d.category === sel));
    });
  } else {
    console.log(error);
  }
};

const itemProps: any = (item: Row<"exercise">) => {
  const subtitle =
    subCategoryTranslator(item.subCategory) +
    item.category +
    " " +
    skillTranslator(item.isSkill);

  return {
    title: capFirst(item.name),
    subtitle,
  };
};

const submitChanges = async () => {
  const { error } = await supabase
    .from("split")
    .update({ categories: selectedCategories.value })
    .eq("id", selectedSplit.value);
  if (error) {
    console.log(error);
  } else {
    await getSplits();
  }
};
</script>
