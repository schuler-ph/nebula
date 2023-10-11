<template>
  <v-form>
    <v-container
      rounded="lg"
      class="d-flex align-center justify-center flex-column"
    >
      <v-row class="">
        <v-btn class="ma-5" elevation="10" size="large">
          <span v-if="date">{{ day }}</span>
        </v-btn></v-row
      >
      <span class="text-grey"
        >Last edited: {{ modifiedTime?.toLocaleString("de-AT") }}</span
      >
      <v-text-field
        readonly
        variant="solo-filled"
        class="w-50 mt-4"
        v-model.trim="title"
        label="Title"
        color="primary"
      ></v-text-field>
    </v-container>

    <v-col cols="12" class="mb-2">
      <v-sheet class="bg-deep-purple-lighten-4 ma-1" height="100%" rounded="lg">
        <v-textarea
          v-model="content"
          :label="title"
          class="pa-2"
          variant="solo-filled"
          no-resize
          counter
          persistent-counter
        >
        </v-textarea>
      </v-sheet>
    </v-col>

    <TodoCollection @update:todoDaily="(t) => (todoDaily = t)" />

    <v-sheet class="d-flex justify-center ma-5">
      <v-card :width="smAndUp ? '50%' : '100%'" class="pa-3" elevation="10">
        <v-text-field
          :width="smAndUp ? '50%' : '100%'"
          v-model.number="currentWeight"
          label="Aktuelles Gewicht"
          type="number"
          step="0.1"
          @update:model-value="(a) => centerSlider(a)"
        >
          <template v-slot:append
            ><v-btn @click="getLatestWeight" icon="mdi-history"></v-btn
          ></template>
        </v-text-field>
        <v-slider
          class="mt-5"
          :min="currentWeight - 2"
          :max="currentWeight + 2"
          thumb-label="always"
          step="0.1"
          v-if="currentWeight"
          v-model.number="weightSlider"
          @end="
            (a) => {
              currentWeight = Number(weightSlider.toFixed(1));
              centerSlider(String(a));
            }
          "
        >
          <template v-slot:thumb-label>
            {{ weightSlider.toFixed(1) }}
          </template>
        </v-slider>
      </v-card>
    </v-sheet>

    <v-sheet
      class="d-flex justify-center py-5"
      rounded="lg"
      :class="trainingStatus ? '' : 'py-5'"
    >
      <v-btn
        @click="cancelUpdate"
        prepend-icon="mdi-chevron-left"
        class="cancelButton"
        :class="trainingStatus ? 'fixedButTrainingbar' : 'fixed'"
        >Cancel</v-btn
      >
      <v-btn
        class="submitButton"
        :class="trainingStatus ? 'fixedButTrainingbar' : 'fixed'"
        @click="submitUpdate"
        append-icon="mdi-send"
        >Submit</v-btn
      >
      <v-dialog v-model="cancelDialog" width="auto">
        <v-card>
          <v-card-text>
            Do you really want to cancel? You have unsaved changes!
          </v-card-text>
          <v-card-actions>
            <v-sheet class="d-flex flex-column align-center">
              <v-btn variant="tonal" @click="cancelDialog = false"
                >Go back to editing</v-btn
              >
              <v-btn
                variant="tonal"
                color="red"
                @click="$router.push({ name: 'Home' })"
                class="mt-3"
                >Discard unsaved changes</v-btn
              >
            </v-sheet>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-sheet>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { InsertDto, UpdateDto } from "@/types/supabaseHelper";
import { getUserId, supabase } from "@/lib/supabaseClient";
import router from "@/router";
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { useDiaryContent } from "@/hooks/useDiaryContent";
import TodoCollection from "@/components/diary/TodoCollection.vue";
import { useDisplay } from "vuetify";
import { useStorageStore } from "@/store/storageStore";
import { useSnackbarStore } from "@/store/snackbarStore";
import { useTrainingStore } from "@/store/trainingStore";
import { storeToRefs } from "pinia";

const { trainingStatus } = storeToRefs(useTrainingStore());
const { newSnackbarMessage } = useSnackbarStore();
const { smAndUp } = useDisplay();
const { day } = useRoute().params;
const currentTime = new Date().toUTCString();
const modifiedTime = ref<Date>();

const { date, title, content, todoDaily, currentWeight, weightSlider } =
  useDiaryContent();

const cancelDialog = ref(false);
let oldEntry: UpdateDto<"diary">;

const { allEntrys, initDiarySingle } = useStorageStore();

onMounted(async () => {
  const entry = allEntrys.find((e) => e.day === day);

  if (entry !== undefined) {
    // day found
    title.value = entry.title!;
    content.value = entry.content!;
    currentWeight.value = entry.currentWeight!;
    modifiedTime.value = new Date(entry.last_modified!);

    if (currentWeight.value) {
      weightSlider.value = currentWeight.value;
    }

    oldEntry = {
      title: entry.title,
      content: entry.content,
      todoDailyDone: entry.todoDailyDone,
      currentWeight: entry.currentWeight,
      last_modified: currentTime,
    };
  } else {
    // day not found
    const tempDate = new Date(day as string);
    title.value = tempDate.getWeekDayName() + tempDate.getWeek();
    currentWeight.value = null;
    const entry: InsertDto<"diary"> = {
      day: day as string,
      user_id: await getUserId(),
      title: title.value,
      content: "",
    };
    oldEntry = currentEntry();
    const { error } = await supabase.from("diary").insert(entry);

    if (error === null) {
      await initDiarySingle();
      newSnackbarMessage("New entry created!", "info");
    } else {
      newSnackbarMessage(
        "This date doesn't exist and couldn't be created!",
        "error"
      );
    }
  }
});

function hasChanged() {
  return JSON.stringify(currentEntry()) !== JSON.stringify(oldEntry);
}

function currentEntry() {
  return {
    title: title.value,
    content: content.value,
    // TODO
    todoDailyDone: todoDaily.value,
    currentWeight: currentWeight.value,
    last_modified: currentTime,
  } as UpdateDto<"diary">;
}

async function submitUpdate() {
  if (hasChanged()) {
    const { error } = await supabase
      .from("diary")
      .update(currentEntry())
      .eq("day", day);

    if (error === null) {
      router.push({ name: "Home" });
      await initDiarySingle();
    } else {
      if (error.code === "23505") {
        // just as template
        // newSnackbarMessage("You already created an entry for this day!", "error");
      } else {
        console.log("UPDATE ERROR", error);
        newSnackbarMessage(error.message, "error");
      }
    }
  } else {
    router.push({ name: "Home" });
  }
}

function cancelUpdate() {
  if (hasChanged()) {
    cancelDialog.value = true;
  } else {
    router.push({ name: "Home" });
  }
}

function getLatestWeight() {
  const req = allEntrys.filter((ae) => ae.currentWeight !== null);
  currentWeight.value = req[0].currentWeight;
  centerSlider("force");
}

function centerSlider(a: string) {
  if (a === "") {
    currentWeight.value = null;
  } else {
    weightSlider.value = currentWeight.value!;
  }
}
</script>

<style scoped>
.fixed {
  position: fixed;
  bottom: 1.5rem;
  z-index: 50;
}
.fixedButTrainingbar {
  position: fixed;
  bottom: 6.5rem;
  z-index: 50;
}
.submitButton {
  margin-left: 8rem;
}
.cancelButton {
  margin-right: 8rem;
}
</style>
