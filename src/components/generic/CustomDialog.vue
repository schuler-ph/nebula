<template>
  <v-dialog v-model="dialogOpen" width="auto">
    <template v-slot:activator="{ props }">
      <v-btn
        @click="checkInstant"
        variant="tonal"
        :color="color"
        :class="class"
        v-bind="props"
      >
        <slot name="text"></slot>
      </v-btn>
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
const { action, closeInstant } = defineProps([
  "action",
  "color",
  "class",
  "closeInstant",
]);
const dialogOpen = ref(false);
function doit() {
  dialogOpen.value = false;
  action();
}
function checkInstant() {
  console.log(closeInstant);
}
</script>
