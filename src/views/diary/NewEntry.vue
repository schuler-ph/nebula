<template>
  <v-form>
    <v-container
      rounded="lg"
      class="d-flex align-center justify-center flex-column"
    >
      <v-row class="d-flex align-center mb-4">
        <v-btn @click="decreaseDate" icon="mdi-chevron-down"></v-btn>
        <v-btn class="ma-5" elevation="10">
          <span v-if="date">{{ dateToIsoString(date[0]) }}</span>
          <v-menu
            v-model="datePickerMenu"
            :close-on-content-click="false"
            activator="parent"
          >
            <v-date-picker
              color="primary"
              @click:save="datePickerMenu = false"
              @click:cancel="datePickerMenu = false"
              v-model="date"
            ></v-date-picker
          ></v-menu>
        </v-btn>
        <v-btn @click="increaseDate" icon="mdi-chevron-up"></v-btn
      ></v-row>
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
    />

    <v-sheet class="d-flex justify-center py-5" rounded="lg">
      <v-btn @click="submitInsert">Submit</v-btn>
    </v-sheet>
    <v-snackbar v-model="snackbarOpen" :color="snackbarColor">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbarOpen = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { InsertDto } from "@/types/supabaseHelper";
import { getUserId, supabase } from "@/lib/supabaseClient";
import { VDatePicker } from "vuetify/lib/labs/components.mjs";
import ContentInputCollection from "@/components/diary/ContentInputCollection.vue";
import router from "@/router";

const datePickerMenu = ref(false);
const date = ref([new Date()]);
const title = ref("");

const content = ref("");
const contentUni = ref("");
const contentTraining = ref("");

const snackbarOpen = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("");

async function submitInsert() {
  const entry: InsertDto<"diary"> = {
    day: dateToIsoString(date.value[0]),
    user_id: await getUserId(),
    title: title.value,
    content: content.value,
    content_training: contentTraining.value,
    content_uni: contentUni.value,
  };

  const { error } = await supabase.from("diary").insert(entry);

  if (error === null) {
    router.push({ name: "Home" });
  } else {
    if (error.code === "23505") {
      snackbarText.value = "You already created an entry for this day!";
      snackbarColor.value = "red-darken-4";
      snackbarOpen.value = true;
    }
    console.log(error);
  }
}

function dateToIsoString(date1: Date) {
  let str = "";
  str += date1.getFullYear();
  str += "-";
  if ((date1.getMonth() as number) + 1 < 10) {
    str += 0;
  }
  str += date1.getMonth() + 1;
  str += "-";
  if ((date1.getDate() as number) < 10) {
    str += 0;
  }
  str += date1.getDate();
  return str;
}

function decreaseDate() {
  date.value[0] = new Date(
    date.value[0].getFullYear(),
    date.value[0].getMonth(),
    date.value[0].getDate() - 1
  );
}

function increaseDate() {
  date.value[0] = new Date(
    date.value[0].getFullYear(),
    date.value[0].getMonth(),
    date.value[0].getDate() + 1
  );
}
</script>
