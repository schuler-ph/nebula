<template>
  <v-sheet rounded="lg">
    <v-select
      v-model="selectedSplit"
      :items="splits"
      item-title="name"
      item-value="id"
    />

    <v-sheet v-if="selectedSplit !== undefined">
      <div class="d-flex">
        <v-select
          v-model="selectedCategories"
          :items="categories"
          multiple
          chips
        />
        <v-btn
          label="Get exercises"
          append-icon="mdi-reload"
          @click="() => getExercisesBySelCat()"
        />
      </div>
      <div v-if="exercisesByCategory.length !== 0">
        <v-select
          v-model="selectedExercises"
          :items="exercisesByCategory"
          :item-props="itemProps as any"
          multiple
          chips
        ></v-select>
      </div>
    </v-sheet>
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
import { capFirst } from "@/helper/stringHelper";

const { snackbarOpen, snackbarText, snackbarColor, newSnackbarMessage } =
  useSnackbar();
const splits = ref<Row<"split">[]>([]);
const selectedSplit = ref();

const categories = ["Push", "Pull", "Legs", "Core"];
const selectedCategories = ref<Array<string>>([]);

const exercisesByCategory = ref<Row<"exercise">[]>([]);
const selectedExercises = ref<Array<string>>([]);

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

const getExercisesBySelCat = async () => {
  exercisesByCategory.value = [];
  const { data, error } = await supabase
    .from("exercise")
    .select()
    .order("updated_at");
  if (error === null && data.length !== 0) {
    selectedCategories.value.forEach((sel) => {
      exercisesByCategory.value.push(
        ...data.filter((d) => d.category === sel && d.isSkill === true)
      );
      exercisesByCategory.value.push(
        ...data.filter((d) => d.category === sel && d.isSkill === false)
      );
    });
  } else {
    console.log(error);
  }
};

const itemProps = (item: Row<"exercise">) => {
  const skillLabel = item.isSkill ? "Skill" : "Basic";
  return {
    title: capFirst(item.name),
    subtitle: item.category + " " + skillLabel,
  };
};
</script>
