<template>
  <v-card :title="category" class="my-3" color="primary" variant="outlined">
    <div class="d-flex justify-center align-center">
      <v-btn
        size="x-small"
        icon="mdi-octagram"
        @click="() => emit('openNewDialog', category, true)"
      ></v-btn>
      <v-card-title>Skills</v-card-title>
    </div>
    <v-card-item
      v-for="exSkill in exercises?.filter((e) => e.isSkill === true)"
    >
      <v-divider class="mb-3" :thickness="2" />
      <div class="d-flex align-center">
        <div
          class="d-flex text-black"
          :class="xs ? 'flex-column' : 'flex-row justify-between w-100'"
        >
          <div>{{ capFirst(exSkill.name) }}</div>

          <v-spacer v-if="!xs" />
          <div>
            {{
              subCategoryTranslator(exSkill.subCategory) +
              exSkill.category +
              " " +
              skillTranslator(exSkill.isSkill)
            }}
          </div>
        </div>
        <v-spacer v-if="xs" />
        <v-btn
          size="small"
          color="black"
          icon="mdi-dots-vertical"
          variant="plain"
          @click="() => emit('openEditDialog', exSkill)"
        ></v-btn>
      </div>
    </v-card-item>
    <v-divider class="mb-2" :thickness="3"></v-divider>
    <div class="d-flex justify-center align-center">
      <v-btn
        size="x-small"
        icon="mdi-triangle"
        @click="() => emit('openNewDialog', category, false)"
      ></v-btn>
      <v-card-title>Basics</v-card-title>
    </div>
    <v-card-item
      v-for="exBasic in exercises?.filter((e) => e.isSkill === false)"
    >
      <v-divider class="mb-3" :thickness="2" />
      <div class="d-flex align-center">
        <div
          class="d-flex text-black"
          :class="xs ? 'flex-column' : 'flex-row justify-between w-100'"
        >
          <div>{{ capFirst(exBasic.name) }}</div>

          <v-spacer v-if="!xs" />
          <div>
            {{
              subCategoryTranslator(exBasic.subCategory) +
              exBasic.category +
              " " +
              skillTranslator(exBasic.isSkill)
            }}
          </div>
        </div>
        <v-spacer v-if="xs" />
        <v-btn
          size="small"
          color="black"
          icon="mdi-dots-vertical"
          variant="plain"
          @click="() => emit('openEditDialog', exBasic)"
        ></v-btn>
      </div>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import {
  capFirst,
  subCategoryTranslator,
  skillTranslator,
} from "@/helper/stringHelper";
import { Row } from "@/types/supabaseHelper";
import { useDisplay } from "vuetify/lib/framework.mjs";
const { xs } = useDisplay();

defineProps<{ category: string; exercises: Array<Row<"exercise">> }>();
const emit = defineEmits(["openNewDialog", "openEditDialog"]);
</script>

<style scoped></style>
