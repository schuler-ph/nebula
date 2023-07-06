<template>
  <v-sheet rounded="lg" class="pa-3">
    <v-card v-for="cat in categories" :title="cat.name" class="mb-3">
      <v-list class="d-flex flex-column">
        <v-list-item v-for="ex in cat.exercise">
          {{ ex.name }}
        </v-list-item>
        <v-list-item>
          <v-btn size="x-small" icon="mdi-plus"></v-btn>
        </v-list-item>
      </v-list> </v-card
  ></v-sheet>
</template>

<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { onMounted, ref } from "vue";

const categories = ref();

onMounted(async () => {
  const { data, error } = await supabase
    .from("exerciseCategory")
    .select("*, exercise (*)")
    .order("id", { ascending: true });
  if (error === null) {
    categories.value = data;
  }
});
</script>
