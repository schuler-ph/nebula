<template>
  <v-sheet rounded="lg" class="pa-3">
    <div class="d-flex mb-3 align-center flex-column">
      <div class="mb-3 d-flex align-center">
        <v-btn
          :disabled="selCat === 0"
          icon="mdi-chevron-left"
          size="x-small"
          @click="
            () => {
              if (selCat > 0) selCat--;
            }
          "
        ></v-btn>
        <v-btn variant="tonal" class="mx-3">{{
          categories[selCat].name
        }}</v-btn>
        <v-btn
          :disabled="selCat === categories.length - 1"
          icon="mdi-chevron-right"
          size="x-small"
          @click="
            () => {
              if (selCat < categories.length) selCat++;
            }
          "
        ></v-btn>
      </div>
      <v-btn
        @click="
          () => {
            openDialog(categories[selCat].name, null);
          }
        "
        >Add new {{ xs ? "" : categories[selCat].name }} Exercise</v-btn
      >
    </div>
    <ExercisesCategoryOverview
      :category="categories[selCat].name"
      :exercises="categories[selCat].exercises.value"
      @open-new-dialog="
        (category, subSkillCategory) => openDialog(category, subSkillCategory)
      "
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

        <div
          class="d-flex align-stretch"
          :class="xs ? 'flex-column' : 'flex-row'"
        >
          <v-select
            v-model="tempSubCategory"
            :items="subCategories"
            item-title="name"
            item-value="val"
            label="Sub-Category"
            :class="xs ? 'mb-4' : 'mr-4'"
            hide-details
            v-if="tempCategory === 'Push' || tempCategory === 'Pull'"
          />
          <v-select
            :class="xs ? 'mb-4' : 'mr-4'"
            hide-details
            label="Category"
            v-model="tempCategory"
            :items="categories.map((cat) => cat.name)"
          />
          <v-select
            label="Sub-Skill Category"
            v-model="tempSubSkillCategory"
            :items="subSkillCategories"
            item-title="name"
            item-value="val"
            hide-details
          />
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
import { useDisplay } from "vuetify/lib/framework.mjs";
import { capFirst } from "@/helper/stringHelper";
import { useStorageStore } from "@/store/storageStore";

const { xs } = useDisplay();
const { allExercises, initExSingle } = useStorageStore();

const exercisesPush = ref<Row<"exercise">[]>([]);
const exercisesPull = ref<Row<"exercise">[]>([]);
const exercisesLegs = ref<Row<"exercise">[]>([]);
const exercisesCore = ref<Row<"exercise">[]>([]);
const stretchingEx = ref<Row<"exercise">[]>([]);

const selCat = ref(0);

onMounted(() => {
  assignExercises();
});

const getExercises = async () => {
  await initExSingle();
  assignExercises();
};

const assignExercises = () => {
  exercisesPush.value = allExercises.filter((d) => d.category === "Push");
  exercisesPull.value = allExercises.filter((d) => d.category === "Pull");
  exercisesLegs.value = allExercises.filter((d) => d.category === "Legs");
  exercisesCore.value = allExercises.filter((d) => d.category === "Core");
  stretchingEx.value = allExercises.filter((d) => d.category === "Stretch");
};

const tempDialogOpen = ref(false);
const tempText = ref("");
const tempCategory = ref<string | undefined>();
const tempSubCategory = ref<string | null>(null);
const tempSubSkillCategory = ref<string | null>(null);
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

const subSkillCategories = [
  { name: "Hold", val: "H" },
  { name: "Transition", val: "T" },
  { name: "Reps", val: "R" },
  { name: "Basic", val: null },
];

const submitNewExercise = async () => {
  if (tempText.value !== "" && tempCategory.value !== undefined) {
    const { error } = await supabase.from("exercise").insert({
      name: capFirst(tempText.value),
      user_id: await getUserId(),
      category: tempCategory.value,
      subCategory: tempSubCategory.value,
      subSkillCategory: tempSubSkillCategory.value,
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
        name: capFirst(tempText.value),
        user_id: await getUserId(),
        category: tempCategory.value,
        subCategory: tempSubCategory.value,
        subSkillCategory: tempSubSkillCategory.value,
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
  tempSubCategory.value = null;
  tempSubSkillCategory.value = null;
  tempText.value = "";
};

const openDialog = (category: string, subSkillCategory: string | null) => {
  tempId.value = undefined;
  tempCategory.value = category;
  tempSubSkillCategory.value = subSkillCategory;
  tempDialogOpen.value = true;
};

const openEditDialog = (exercise: Row<"exercise">) => {
  tempText.value = exercise.name;
  tempCategory.value = exercise.category;
  tempSubCategory.value = exercise.subCategory;
  tempSubSkillCategory.value = exercise.subSkillCategory;
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
