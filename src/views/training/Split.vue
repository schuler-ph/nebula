<template>
  <v-sheet rounded="lg" class="pa-3">
    <v-select
      v-model="selectedSplit"
      :items="allSplits"
      item-title="name"
      item-value="id"
      hide-details
      class="mb-3"
      @update:model-value="
        (mv) => {
          selectedCategories = allSplits.find((s) => s.id === mv)?.categories!;
          selectedExercises = allSplits.find((s) => s.id === mv)?.exercises!;
          getExercisesBySelCat();
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
          item-title="name"
          item-value="id"
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
import { useStorageStore } from "@/store/storageStore";
import { storeToRefs } from "pinia";

const { snackbarOpen, snackbarText, snackbarColor, newSnackbarMessage } =
  useSnackbar();
const selectedSplit = ref();

const categories = ["Push", "Pull", "Legs", "Core"];
const selectedCategories = ref<Array<string>>([]);

const exercisesByCategory = ref<Row<"exercise">[]>([]);
const selectedExercises = ref<Array<string>>([]);
const { allExercises, allSplits } = storeToRefs(useStorageStore());
const { initSplits } = useStorageStore();

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
    })
    .eq("id", selectedSplit.value);
  if (error) {
    console.log(error);
  } else {
    await initSplits();
  }
};
</script>
