<template>
  <v-card :title="category" class="my-3" color="primary" variant="outlined">
    <ExerciseCategory
      v-for="sbSk in subSkillCategories"
      :exercises="exercises?.filter((e) => e.subSkillCategory === sbSk.val)"
      :name="sbSk.name"
      :category="category"
      :subSkillCategory="sbSk.val"
      @open-edit-dialog="(ex) => emit('openEditDialog', ex)"
      @open-new-dialog="
        (category, subSkillCategory) =>
          emit('openNewDialog', category, subSkillCategory)
      "
    />
  </v-card>
</template>

<script setup lang="ts">
import { Row } from "@/types/supabaseHelper";
import ExerciseCategory from "./ExerciseCategory.vue";

const { exercises } = defineProps<{
  category: string;
  exercises: Array<Row<"exercise">>;
}>();
const emit = defineEmits(["openNewDialog", "openEditDialog"]);

const subSkillCategories = [
  { name: "Transition", val: "T" },
  { name: "Hold", val: "H" },
  { name: "Reps", val: "R" },
  { name: "Basic", val: null },
];
</script>

<style scoped></style>
