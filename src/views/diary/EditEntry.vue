<template>
  <v-form>
    <v-container
      rounded="lg"
      class="d-flex align-center justify-center flex-column"
    >
      <v-row>
        <v-btn class="my-5" elevation="10">
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

    <v-row no-gutters>
      <ContentInput
        title="Content"
        v-model.trim="content"
        color="deep-purple-lighten-4"
      />
      <ContentInput
        title="Uni"
        v-model.trim="contentUni"
        color="teal-lighten-4"
        v-if="showContentUni"
      />
      <ContentInput
        title="Training"
        v-model.trim="contentTraining"
        color="deep-orange-lighten-4"
        v-if="showContentTraining"
      />

      <v-col cols="12" sm="4">
        <v-sheet
          min-height="100"
          :border="true"
          class="d-flex justify-center align-center ma-1"
          rounded="lg"
          height="100%"
        >
          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" elevation="10" icon="mdi-plus"></v-btn>
            </template>
            <v-list>
              <v-switch
                v-model="showContentUni"
                label="Uni"
                color="teal-lighten-2"
              ></v-switch>
              <v-switch
                v-model="showContentTraining"
                label="Training"
                color="deep-orange-lighten-2"
              ></v-switch>
            </v-list>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
    <v-sheet class="d-flex justify-center mt-5">
      <v-btn class="mr-4" @click="submitUpdate">Submit</v-btn>
      <v-btn @click="$router.push({ name: 'Home' })">Cancel</v-btn>
    </v-sheet>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UpdateDto } from "@/types/supabaseHelper";
import { supabase } from "@/lib/supabaseClient";
import ContentInput from "@/components/diary/ContentInput.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { onMounted } from "vue";

const date = ref([]);
const title = ref("");
const content = ref("");
const contentUni = ref("");
const showContentUni = ref(false);
const contentTraining = ref("");
const showContentTraining = ref(false);

const { day } = useRoute().params;

onMounted(async () => {
  const { data, error } = await supabase.from("diary").select().eq("day", day);
  if (error === null) {
    title.value = data[0].title!;
    content.value = data[0].content!;
    contentUni.value = data[0].content_uni!;
    contentTraining.value = data[0].content_training!;
  }
});

async function submitUpdate() {
  const entry: UpdateDto<"diary"> = {
    title: title.value,
    content: content.value,
    content_training: contentTraining.value,
    content_uni: contentUni.value,
  };

  const { error } = await supabase.from("diary").update(entry).eq("day", day);
  router.push({ name: "Home" });
}
</script>
