<template>
  <v-dialog v-model="dialogOpen" width="auto">
    <template v-slot:activator="{ props }">
      <v-btn
        v-if="!text"
        :variant="variant"
        :color="color"
        :class="class"
        v-bind="props"
        :icon="icon"
        :size="size"
      />
      <v-btn
        v-else
        :variant="variant"
        :color="color"
        :class="class"
        v-bind="props"
        :size="size"
        >{{ text }}</v-btn
      >
    </template>

    <v-card>
      <v-card-text>
        <slot name="content"></slot>
      </v-card-text>
      <v-card-actions>
        <v-sheet class="d-flex">
          <v-btn variant="tonal" color="red" @click="doit">Confirm</v-btn>
          <v-btn variant="tonal" @click="dialogOpen = false">Cancel</v-btn>
        </v-sheet>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
const { action } = defineProps([
  "action",
  "color",
  "class",
  "text",
  "icon",
  "size",
  "variant",
]);
const dialogOpen = ref(false);
function doit() {
  dialogOpen.value = false;
  action();
}
</script>
