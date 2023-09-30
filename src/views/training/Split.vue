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
          selectedCategories = splits.find((s) => s.id === mv)?.categories!;
          selectedExercises = splits.find((s) => s.id === mv)?.exercises!;
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

const { snackbarOpen, snackbarText, snackbarColor, newSnackbarMessage } =
  useSnackbar();
const splits = ref<Row<"split">[]>([]);
const allExercises = ref<Row<"exercise">[]>([]);
const selectedSplit = ref();

const categories = ["Push", "Pull", "Legs", "Core"];
const selectedCategories = ref<Array<string>>([]);

const exercisesByCategory = ref<Row<"exercise">[]>([]);
const selectedExercises = ref<Array<string>>([]);

onMounted(async () => {
  await getSplitsAndExercises();
});

const getSplitsAndExercises = async () => {
  const { data: data1, error: error1 } = await supabase
    .from("split")
    .select()
    .order("index", { ascending: true });
  if (error1 === null && data1.length !== 0) {
    splits.value = data1;
  } else {
    console.log(error1);
  }
  const { data: data2, error: error2 } = await supabase
    .from("exercise")
    .select()
    .order("category")
    .order("isSkill", { ascending: false })
    .order("subCategory")
    .order("name");

  if (error2 === null && data2.length !== 0) {
    allExercises.value = data2;
  } else {
    console.log(error2);
  }
};

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
    await getSplitsAndExercises();
  }
};
</script>
