<template>
  <v-sheet rounded="lg" class="pa-3">
    <div class="d-flex mb-3 justify-center">
      <v-btn @click="() => openDialog('')">Add new Split</v-btn>
      <v-btn
        @click="() => openDialog(allSplits.find(as => as.id === selectedSplit)!.name)"
        v-if="selectedSplit"
        class="ml-3"
        >Edit split</v-btn
      >
    </div>

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
  <v-dialog v-model="tempDialogOpen" width="600">
    <v-card>
      <v-card-title>{{ selectedSplit ? "Edit" : "Add" }} split</v-card-title>
      <v-card-text>
        <v-text-field label="Name of split" v-model="tempSplitName" />
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="selectedSplit" @click="() => submitEdit()">Submit</v-btn>
        <v-btn v-else @click="() => submitAdd()">Submit</v-btn>
        <v-spacer />
        <CustomDialog
          :action="deleteSplit"
          color="red"
          text="Delete"
          variant="tonal"
          v-if="selectedSplit"
          ><template v-slot:content>
            Are you sure you want to delete this split?
          </template></CustomDialog
        >
        <v-spacer v-if="selectedSplit" />
        <v-btn @click="() => closeDialog()">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { getUserId, supabase } from "@/lib/supabaseClient";
import { ref } from "vue";
import { Row } from "@/types/supabaseHelper";
import { exerciseSDforSplit } from "@/helper/stringHelper";
import { useStorageStore } from "@/store/storageStore";
import { storeToRefs } from "pinia";
import { useSnackbarStore } from "@/store/snackbarStore";
import CustomDialog from "@/components/generic/CustomDialog.vue";

const { newSnackbarMessage } = useSnackbarStore();
const selectedSplit = ref();

const tempDialogOpen = ref(false);
const tempSplitName = ref("");

const openDialog = (name: string) => {
  tempSplitName.value = name;
  tempDialogOpen.value = true;
};

const closeDialog = () => {
  tempSplitName.value = "";
  tempDialogOpen.value = false;
};

const submitAdd = async () => {
  if (tempSplitName.value !== "") {
    const { error } = await supabase.from("split").insert({
      exercises: [],
      user_id: await getUserId(),
      name: tempSplitName.value,
    });

    if (error === null) {
      closeDialog();
      await initSplitsSingle();
    } else {
      newSnackbarMessage("Couldn't add new split", "error");
    }
  }
};

const submitEdit = async () => {
  if (tempSplitName.value !== "") {
    const { error } = await supabase
      .from("split")
      .update({
        name: tempSplitName.value,
      })
      .eq(
        "id",
        allSplits.value.find((as) => as.id === selectedSplit.value)!.id
      );

    if (error === null) {
      closeDialog();
      await initSplitsSingle();
    } else {
      newSnackbarMessage("Couldn't edit split", "error");
    }
  }
};

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
  const subtitle = exerciseSDforSplit(item);

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

const deleteSplit = async () => {
  const { error } = await supabase
    .from("split")
    .delete()
    .eq("id", allSplits.value.find((as) => as.id === selectedSplit.value)!.id);
  if (error !== null) {
    console.log(error);
  }
  closeDialog();
  await initSplitsSingle();
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
