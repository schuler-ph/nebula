<template>
  <div class="d-flex justify-center align-center">
    <v-btn
      size="x-small"
      icon="mdi-octagram"
      @click="
        () => {
          emit('openNewDialog', category, subSkillCategory);
        }
      "
    ></v-btn>
    <v-card-title>{{ name }}</v-card-title>
  </div>
  <v-card-item v-for="ex in exercises">
    <v-divider class="mb-3" :thickness="2" />
    <div class="d-flex align-center">
      <div
        class="d-flex text-black"
        :class="xs ? 'flex-column' : 'flex-row justify-between w-100'"
      >
        <div>{{ capFirst(ex.name) }}</div>

        <v-spacer v-if="!xs" />
        <div>
          {{ exerciseShortDescription(ex) }}
        </div>
      </div>
      <v-spacer v-if="xs" />
      <v-btn
        size="small"
        color="black"
        icon="mdi-dots-vertical"
        variant="plain"
        @click="
          () => {
            emit('openEditDialog', ex);
          }
        "
      ></v-btn>
    </div>
  </v-card-item>
</template>

<script setup lang="ts">
import { capFirst, exerciseShortDescription } from "@/helper/stringHelper";
import { useDisplay } from "vuetify/lib/framework.mjs";
const { xs } = useDisplay();
defineProps(["exercises", "name", "category", "subSkillCategory"]);
const emit = defineEmits(["openNewDialog", "openEditDialog"]);
</script>

<style scoped></style>
