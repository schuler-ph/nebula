<template>
  <v-form>
    <v-container
      rounded="lg"
      class="d-flex align-center justify-center flex-column"
    >
      <v-row class="mb-4">
        <v-btn class="ma-5" elevation="10">
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
    />

    <v-sheet class="d-flex justify-center py-5" rounded="lg">
      <v-btn class="mr-4" @click="submitUpdate">Submit</v-btn>
      <v-btn @click="$router.push({ name: 'Home' })">Cancel</v-btn>
    </v-sheet>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UpdateDto } from "@/types/supabaseHelper";
import { supabase } from "@/lib/supabaseClient";
import ContentInputCollection from "@/components/diary/ContentInputCollection.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { onMounted } from "vue";

const date = ref([]);
const title = ref("");
const content = ref("");
const contentUni = ref("");
const contentTraining = ref("");

const { day } = useRoute().params;

onMounted(async () => {
  const { data, error } = await supabase.from("diary").select().eq("day", day);
  if (error === null) {
    title.value = data[0].title!;
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
