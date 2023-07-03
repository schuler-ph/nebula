<template>
  <v-form>
    <!-- <v-text-field v-model="entry?.title" label="Title"></v-text-field> -->
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { InsertDto } from "@/types/supabaseHelper";
import { getUserId } from "@/lib/supabaseClient";
import { onMounted } from "vue";

const entry = ref<InsertDto<"diary">>();

onMounted(async () => {
  entry.value = {
    user_id: await getUserId(),
    day: new Date().toISOString().substring(0, 10),
    title: "",
    content: "",
  };
  console.log(entry.value);
});
</script>
