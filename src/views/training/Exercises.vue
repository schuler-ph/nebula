<template>
  <v-sheet rounded="lg" class="pa-3">
    <div class="d-flex justify-center mb-3">
      <v-btn @click="() => (addNewExerciseDialog = true)"
        >Add new Exercise</v-btn
      >
    </div>
    <ExercisesCategoryOverview
      category="Push"
      :exercises="exercisesPush"
      @open-new-dialog="(category, isSkill) => openDialog(category, isSkill)"
    />
    <ExercisesCategoryOverview
      category="Pull"
      :exercises="exercisesPull"
      @open-new-dialog="(category, isSkill) => openDialog(category, isSkill)"
    />
    <ExercisesCategoryOverview
      category="Legs"
      :exercises="exercisesLegs"
      @open-new-dialog="(category, isSkill) => openDialog(category, isSkill)"
    />
    <ExercisesCategoryOverview
      category="Core"
      :exercises="exercisesCore"
      @open-new-dialog="(category, isSkill) => openDialog(category, isSkill)"
    />
  </v-sheet>
  <v-dialog v-model="addNewExerciseDialog" width="600">
    <v-card>
      <v-card-title>New Exercise</v-card-title>
      <v-card-text>
        <v-text-field
          label="Name of exercise"
          v-model="newExerciseText"
        ></v-text-field>
        <v-select
          label="Category"
          v-model="newExerciseCategory"
          :items="categories"
        >
        </v-select>
        <v-switch
          label="Skill"
          color="primary"
          v-model="newExerciseIsSkill"
        ></v-switch>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="() => (addNewExerciseDialog = false)">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="() => submitNewExercise()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { getUserId, supabase } from "@/lib/supabaseClient";
import { onMounted, ref } from "vue";
import { Row } from "@/types/supabaseHelper";
import ExercisesCategoryOverview from "@/components/training/ExercisesCategoryOverview.vue";

const exercisesPush = ref<Row<"exercise">[]>();
const exercisesPull = ref<Row<"exercise">[]>();
const exercisesLegs = ref<Row<"exercise">[]>();
const exercisesCore = ref<Row<"exercise">[]>();

onMounted(async () => {
  await getExercises();
});

const getExercises = async () => {
  const { data, error } = await supabase
    .from("exercise")
    .select()
    .order("updated_at");
  if (error === null && data.length !== 0) {
    exercisesPush.value = data.filter((d) => d.category === "Push");
    exercisesPull.value = data.filter((d) => d.category === "Pull");
    exercisesLegs.value = data.filter((d) => d.category === "Legs");
    exercisesCore.value = data.filter((d) => d.category === "Core");
  }
};

const addNewExerciseDialog = ref(false);
const newExerciseText = ref("");
const newExerciseIsSkill = ref(false);
const newExerciseCategory = ref();
const categories = ["Push", "Pull", "Legs", "Core"];

const submitNewExercise = async () => {
  if (newExerciseText.value !== "" && newExerciseCategory.value !== undefined) {
    const { error } = await supabase.from("exercise").insert({
      name: newExerciseText.value,
      user_id: await getUserId(),
      isSkill: newExerciseIsSkill.value,
      category: newExerciseCategory.value,
    });

    if (error !== null) {
      console.log(error);
    } else {
      await getExercises();
      addNewExerciseDialog.value = false;
      newExerciseText.value = "";
      newExerciseCategory.value = undefined;
      newExerciseIsSkill.value = false;
    }
  }
};

const openDialog = (category: String, isSkill: boolean) => {
  newExerciseCategory.value = category;
  newExerciseIsSkill.value = isSkill;
  addNewExerciseDialog.value = true;
};
</script>
