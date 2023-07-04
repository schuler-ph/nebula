<template>
  <v-col cols="12" sm="4" class="mb-2">
    <v-sheet :class="'bg-' + color" height="100%" rounded="lg" class="ma-1">
      <v-textarea
        :model-value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :label="title"
        class="pa-2"
        variant="solo-filled"
        no-resize
        counter
        persistent-counter
      >
      </v-textarea>
    </v-sheet>
  </v-col>
</template>

<script setup lang="ts">
const { modelValue } = defineProps(["modelValue", "title", "color"]);
defineEmits(["update:modelValue"]);
</script>
