<template>
  <v-form>
    <v-container
      rounded="lg"
      class="d-flex align-center justify-center flex-column"
    >
      <v-row class="d-flex align-center mb-4">
        <v-btn
          @click="date[0] = new Date(date[0].setDate(date[0].getDate() - 1))"
          icon="mdi-calendar-arrow-left"
        ></v-btn>
        <v-btn class="ma-5" elevation="10" size="large">
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
        <v-btn
          @click="date[0] = new Date(date[0].setDate(date[0].getDate() + 1))"
          icon="mdi-calendar-arrow-right"
        ></v-btn
      ></v-row>
      <v-text-field
        variant="solo-filled"
        class="w-50"
        v-model.trim="title"
        label="Title"
        color="primary"
      ></v-text-field>
    </v-container>

    <!-- <ContentInputCollection
      @update:content="(c) => (content = c)"
      @update:contentUni="(c) => (contentUni = c)"
      @update:contentTraining="(c) => (contentTraining = c)"
      @update:contentProjects="(c) => (contentProjects = c)"
    /> -->

    <v-sheet class="d-flex justify-center py-5" rounded="lg">
      <v-btn @click="submitInsert">Submit</v-btn>
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
import { InsertDto } from "@/types/supabaseHelper";
import { getUserId, supabase } from "@/lib/supabaseClient";
import { VDatePicker } from "vuetify/lib/labs/components.mjs";
import ContentInputCollection from "@/components/diary/ContentInputCollection.vue";
import router from "@/router";
import { dateToIsoString } from "@/helper/dateHelper";

import CustomSnackbar from "@/components/generic/CustomSnackbar.vue";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useDiaryContent } from "@/hooks/useDiaryContent";
const { snackbarOpen, snackbarText, snackbarColor, newSnackbarMessage } =
  useSnackbar();

const datePickerMenu = ref(false);

const { date, title, content, contentUni, contentTraining, contentProjects } =
  useDiaryContent();

async function submitInsert() {
  const entry: InsertDto<"diary"> = {
    day: dateToIsoString(date.value[0]),
    user_id: await getUserId(),
    title: title.value,
    content: content.value,
    // TODO
  };

  const { error } = await supabase.from("diary").insert(entry);

  if (error === null) {
    router.push({ name: "Home" });
  } else {
    if (error.code === "23505") {
      newSnackbarMessage("You already created an entry for this day!", "error");
    } else {
      console.log("INSERT ERROR", error);
      newSnackbarMessage(error.message, "error");
    }
  }
}
</script>
