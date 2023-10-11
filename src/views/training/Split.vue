<template>
  <v-sheet rounded="lg" class="pa-3">
    <v-select
      label="Split name"
      v-model="selectedSplit"
      :items="allSplits"
      item-title="name"
      item-value="id"
      hide-details
      class="mb-3"
      @update:model-value="
        (mv) => {
          recoverSplitData(mv);
        }
      "
    />

    <v-sheet v-if="selectedSplit !== undefined">
      <v-select
        v-model="selectedWeekdays"
        multiple
        chips
        label="Weekday"
        :items="weekDaysTemplate"
        item-title="name"
        item-value="id"
        hide-details
        class="mb-3"
      >
      </v-select>
      <div class="d-flex align-center mb-3">
        <v-select
          label="Categories in this Split"
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
          label="Selected Exercises"
          v-model="selectedExercises"
          :items="exercisesByCategory"
          :item-props="itemProps"
          item-title="name"
          item-value="id"
          multiple
          chips
        ></v-select>
      </div>
    </v-sheet>

    <v-btn @click="() => submitChanges()">Submit</v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { onMounted, ref } from "vue";
import { Row } from "@/types/supabaseHelper";
import {
  capFirst,
  subCategoryTranslator,
  skillTranslator,
} from "@/helper/stringHelper";
import { useStorageStore } from "@/store/storageStore";
import { storeToRefs } from "pinia";
import { useSnackbarStore } from "@/store/snackbarStore";

const { newSnackbarMessage } = useSnackbarStore();
const selectedSplit = ref();

const weekDaysTemplate = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 0, name: "Sunday" },
];
const selectedWeekdays = ref<Array<number>>([]);

const categories = ["Push", "Pull", "Legs", "Core"];
const selectedCategories = ref<Array<string>>([]);

const exercisesByCategory = ref<Row<"exercise">[]>([]);
const selectedExercises = ref<Array<string>>([]);
const { allExercises, allSplits } = storeToRefs(useStorageStore());
const { initSplitsSingle } = useStorageStore();

const getExercisesBySelCat = () => {
  exercisesByCategory.value = [];
  selectedCategories.value.forEach((sel) => {
    exercisesByCategory.value.push(
      ...allExercises.value.filter((d) => d.category === sel)
    );
  });
};

const itemProps: any = (item: Row<"exercise">) => {
  const subtitle =
    subCategoryTranslator(item.subCategory) +
    item.category +
    " " +
    skillTranslator(item.isSkill);

  return {
    title: item.name,
    subtitle,
  };
};

const submitChanges = async () => {
  const { error } = await supabase
    .from("split")
    .update({
      categories: selectedCategories.value,
      exercises: selectedExercises.value,
      weekdaySelection: selectedWeekdays.value,
    })
    .eq("id", selectedSplit.value);
  if (error) {
    console.log(error);
  } else {
    await initSplitsSingle();
  }
};

const recoverSplitData = (mv: string) => {
  const sp = allSplits.value.find((s) => s.id === mv);
  if (sp) {
    selectedCategories.value = sp.categories;
    selectedExercises.value = sp.exercises;
    selectedWeekdays.value = sp.weekdaySelection;
  }
  getExercisesBySelCat();
};
</script>
