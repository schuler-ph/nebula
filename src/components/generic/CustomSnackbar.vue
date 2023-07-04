<template>
  <v-snackbar :model-value="modelValue" :color="color">
    {{ text }}
    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="$emit('update:modelValue', false)"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
const { modelValue } = defineProps(["modelValue", "text", "color"]);
defineEmits(["update:modelValue"]);
</script>
