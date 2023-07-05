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

    <v-sheet class="d-flex justify-center py-5" rounded="lg">
      <v-btn class="mr-4" @click="submitUpdate">Submit</v-btn>
      <v-btn @click="$router.push({ name: 'Home' })">Cancel</v-btn>
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

const { date, title, content, contentUni, contentTraining, contentProjects } =
  useDiaryContent();

const { snackbarOpen, snackbarText, snackbarColor, newSnackbarMessage } =
  useSnackbar();

const { day } = useRoute().params;

onMounted(async () => {
  const { data, error } = await supabase.from("diary").select().eq("day", day);
  if (error === null) {
    if (data.length !== 0) {
      title.value = data[0].title!;
    } else {
      newSnackbarMessage("This date does not exist!", "error");
    }
  } else {
    newSnackbarMessage("Unknown Error!", "error");
  }
});

async function submitUpdate() {
  const entry: UpdateDto<"diary"> = {
    title: title.value,
    content: content.value,
    content_training: contentTraining.value,
    content_uni: contentUni.value,
    content_projects: contentProjects.value,
    last_modified: new Date().toUTCString(),
  };

  const { error } = await supabase.from("diary").update(entry).eq("day", day);

  if (error === null) {
    router.push({ name: "Home" });
  } else {
    if (error.code === "23505") {
      newSnackbarMessage("You already created an entry for this day!", "error");
    } else {
      console.log("UPDATE ERROR", error);
      newSnackbarMessage("Unknown Error!", "error");
    }
  }
}
</script>
