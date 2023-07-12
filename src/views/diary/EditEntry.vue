<template>
  <v-form>
    <v-container
      rounded="lg"
      class="d-flex align-center justify-center flex-column"
    >
      <v-row class="mb-4">
        <v-btn class="ma-5" elevation="10" size="large">
          <span v-if="date">{{ day }}</span>
        </v-btn></v-row
      >
      <v-text-field
        variant="solo-filled"
        class="w-50"
        v-model.trim="title"
        label="Title"
        color="primary"
      ></v-text-field>
    </v-container>

    <ContentInputCollection
      @update:content="(c) => (content = c)"
      @update:contentUni="(c) => (contentUni = c)"
      @update:contentTraining="(c) => (contentTraining = c)"
      @update:contentProjects="(c) => (contentProjects = c)"
    />

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

    <v-sheet class="d-flex justify-center py-5" rounded="lg">
      <v-btn class="mr-4" @click="submitUpdate">Submit</v-btn>
      <v-btn @click="cancelUpdate">Cancel</v-btn>
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
    <CustomSnackbar
      v-model="snackbarOpen"
      :text="snackbarText"
      :color="snackbarColor"
    />
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UpdateDto } from "@/types/supabaseHelper";
import { supabase } from "@/lib/supabaseClient";
import ContentInputCollection from "@/components/diary/ContentInputCollection.vue";
import CustomSnackbar from "@/components/generic/CustomSnackbar.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useDiaryContent } from "@/hooks/useDiaryContent";
import TodoCollection from "@/components/diary/TodoCollection.vue";
import { useDisplay } from "vuetify";
const { smAndUp } = useDisplay();

const { day } = useRoute().params;
const modifiedTime = new Date().toUTCString();
const {
  date,
  title,
  content,
  contentUni,
  contentTraining,
  contentProjects,
  todoDaily,
  currentWeight,
  weightSlider,
} = useDiaryContent();
const { snackbarOpen, snackbarText, snackbarColor, newSnackbarMessage } =
  useSnackbar();
const cancelDialog = ref(false);
let oldEntry: UpdateDto<"diary">;

onMounted(async () => {
  const { data, error } = await supabase.from("diary").select().eq("day", day);
  if (error === null) {
    if (data.length !== 0) {
      title.value = data[0].title!;
      currentWeight.value = data[0].currentWeight!;

      if (currentWeight.value) {
        weightSlider.value = currentWeight.value;
      }

      oldEntry = {
        title: data[0].title,
        content: data[0].content,
        content_training: data[0].content_training,
        content_uni: data[0].content_uni,
        content_projects: data[0].content_projects,
        todoDailyDone: data[0].todoDailyDone,
        currentWeight: data[0].currentWeight,
        last_modified: modifiedTime,
      };
    } else {
      newSnackbarMessage("This date does not exist!", "error");
    }
  } else {
    console.log("SELECT ERROR", error);
    newSnackbarMessage(error.message, "error");
  }
});

function hasChanged() {
  return JSON.stringify(currentEntry()) !== JSON.stringify(oldEntry);
}

function currentEntry() {
  return {
    title: title.value,
    content: content.value,
    content_training: contentTraining.value,
    content_uni: contentUni.value,
    content_projects: contentProjects.value,
    todoDailyDone: todoDaily.value,
    currentWeight: currentWeight.value,
    last_modified: modifiedTime,
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

async function getLatestWeight() {
  const { data, error } = await supabase
    .from("diary")
    .select("currentWeight")
    .not("currentWeight", "is", null)
    .order("day", { ascending: false })
    .limit(1);

  if (error === null && data.length !== 0) {
    currentWeight.value = data[0].currentWeight!;
    centerSlider("force");
  }
}

function centerSlider(a: string) {
  if (a === "") {
    currentWeight.value = null;
  } else {
    weightSlider.value = currentWeight.value!;
  }
}
</script>
