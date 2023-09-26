<template>
  <v-card :title="category" class="my-3" color="primary">
    <div class="d-flex justify-center align-center">
      <v-btn
        size="x-small"
        icon="mdi-octagram"
        @click="() => emit('openNewDialog', category, true)"
      ></v-btn>
      <v-card-title>Skills</v-card-title>
    </div>
    <v-card-item v-for="exSkill in exercises?.filter((e) => e.isSkill === true)"
      ><div class="d-flex align-center">
        <div>{{ capFirst(exSkill.name) }}</div>
        <v-spacer />
        <v-btn
          size="small"
          color="white"
          icon="mdi-dots-vertical"
          variant="plain"
          @click="() => emit('openEditDialog', exSkill)"
        ></v-btn>
      </div>
    </v-card-item>
    <v-divider :thickness="2"></v-divider>
    <div class="d-flex justify-center align-center">
      <v-btn
        size="x-small"
        icon="mdi-triangle"
        @click="() => emit('openNewDialog', category, false)"
      ></v-btn>
      <v-card-title>Basics</v-card-title>
    </div>
    <v-card-item
      v-for="exBasics in exercises?.filter((e) => e.isSkill === false)"
      ><div class="d-flex align-center">
        <div>{{ capFirst(exBasics.name) }}</div>
        <v-spacer />
        <v-btn
          size="small"
          color="white"
          icon="mdi-dots-vertical"
          variant="plain"
          @click="() => emit('openEditDialog', exBasics)"
        ></v-btn></div
    ></v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { capFirst } from "@/helper/stringHelper";
import { Row } from "@/types/supabaseHelper";
defineProps({
  category: String,
  exercises: Array<Row<"exercise">>,
});
const emit = defineEmits(["openNewDialog", "openEditDialog"]);
</script>

<style scoped></style>
