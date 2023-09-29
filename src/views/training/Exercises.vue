<template>
  <v-sheet rounded="lg" class="pa-3">
    <div class="d-flex justify-center mb-3">
      <v-btn @click="() => (tempDialogOpen = true)">Add new Exercise</v-btn>
    </div>
    <ExercisesCategoryOverview
      v-for="cat in categories"
      :category="cat.name"
      :exercises="cat.exercises.value"
      @open-new-dialog="(category, isSkill) => openDialog(category, isSkill)"
      @open-edit-dialog="(exercise) => openEditDialog(exercise)"
    />
  </v-sheet>
  <v-dialog v-model="tempDialogOpen" width="600">
    <v-card>
      <v-card-title>{{
        tempId ? "Edit Exercise" : "New Exercise"
      }}</v-card-title>
      <v-card-text>
        <v-text-field
          label="Name of exercise"
          v-model="tempText"
        ></v-text-field>

        <div class="d-flex align-center">
          <v-select
            v-model="tempSubCategory"
            :items="subCategories"
            item-title="name"
            item-value="val"
            label="Sub-Category"
            class="mr-4"
            hide-details
            v-if="tempCategory === 'Push' || tempCategory === 'Pull'"
          />
          <v-select
            class="mr-4"
            hide-details
            label="Category"
            v-model="tempCategory"
            :items="categories.map((cat) => cat.name)"
          />
          <div>
            <v-switch
              class="d-flex align-center"
              :label="tempIsSkill ? 'Skill' : 'Basic'"
              color="primary"
              v-model="tempIsSkill"
            />
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="() => cancelDialog()">Cancel</v-btn>
        <v-spacer v-if="tempId !== undefined"></v-spacer>
        <CustomDialog
          v-if="tempId !== undefined"
          :action="deleteExercise"
          color="red"
          text="Delete"
          variant="tonal"
        >
          <template v-slot:content>
            Are you sure you want to delete this exercise?
          </template>
        </CustomDialog>
        <v-spacer></v-spacer>
        <v-btn v-if="tempId === undefined" @click="() => submitNewExercise()"
          >Submit</v-btn
        >
        <v-btn v-else @click="() => submitEditedExercise()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { getUserId, supabase } from "@/lib/supabaseClient";
import { onMounted, ref } from "vue";
import { Row } from "@/types/supabaseHelper";
import ExercisesCategoryOverview from "@/components/training/ExercisesCategoryOverview.vue";
import CustomDialog from "@/components/generic/CustomDialog.vue";

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
    .order("subCategory")
    .order("name", { ascending: true });
  if (error === null && data.length !== 0) {
    exercisesPush.value = data.filter((d) => d.category === "Push");
    exercisesPull.value = data.filter((d) => d.category === "Pull");
    exercisesLegs.value = data.filter((d) => d.category === "Legs");
    exercisesCore.value = data.filter((d) => d.category === "Core");
  }
};

const tempDialogOpen = ref(false);
const tempText = ref("");
const tempIsSkill = ref(false);
const tempCategory = ref<string | undefined>();
const tempSubCategory = ref<string | null>(null);
const tempId = ref();

const categories = [
  { name: "Push", exercises: exercisesPush },
  { name: "Pull", exercises: exercisesPull },
  { name: "Legs", exercises: exercisesLegs },
  { name: "Core", exercises: exercisesCore },
];
const subCategories = [
  { name: "Horizontal", val: "H" },
  { name: "Vertical", val: "V" },
  { name: "N/A", val: null },
];

const submitNewExercise = async () => {
  if (tempText.value !== "" && tempCategory.value !== undefined) {
    const { error } = await supabase.from("exercise").insert({
      name: tempText.value,
      user_id: await getUserId(),
      isSkill: tempIsSkill.value,
      category: tempCategory.value,
      subCategory: tempSubCategory.value,
    });

    if (error !== null) {
      console.log(error);
    } else {
      await getExercises();
      cancelDialog();
    }
  }
};

const submitEditedExercise = async () => {
  if (tempText.value !== "" && tempCategory.value !== undefined) {
    const updated_at = new Date().toUTCString();
    const { error } = await supabase
      .from("exercise")
      .update({
        name: tempText.value,
        user_id: await getUserId(),
        isSkill: tempIsSkill.value,
        category: tempCategory.value,
        subCategory: tempSubCategory.value,
        updated_at,
      })
      .eq("id", tempId.value);

    if (error !== null) {
      console.log(error);
    } else {
      await getExercises();
      cancelDialog();
    }
  }
};

const cancelDialog = () => {
  tempDialogOpen.value = false;
  tempId.value = undefined;
  tempCategory.value = undefined;
  tempIsSkill.value = false;
  tempSubCategory.value = null;
  tempText.value = "";
};

const openDialog = (category: string, isSkill: boolean) => {
  tempId.value = undefined;
  tempCategory.value = category;
  tempIsSkill.value = isSkill;
  tempDialogOpen.value = true;
};

const openEditDialog = (exercise: Row<"exercise">) => {
  tempText.value = exercise.name;
  tempCategory.value = exercise.category;
  tempIsSkill.value = exercise.isSkill;
  tempSubCategory.value = exercise.subCategory;
  tempId.value = exercise.id;
  tempDialogOpen.value = true;
};

const deleteExercise = async () => {
  const { error } = await supabase
    .from("exercise")
    .delete()
    .eq("id", tempId.value);
  if (error !== null) {
    console.log(error);
  }
  cancelDialog();
  await getExercises();
};
</script>
