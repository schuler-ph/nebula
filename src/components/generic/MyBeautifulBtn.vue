<template>
  <v-btn
    @click="() => action()"
    elevation="10"
    class="nebulaBgGradient text-h6 font-weight-bold px-5"
    :class="class"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :icon="icon"
    ><slot
  /></v-btn>
</template>

<script setup lang="ts">
const props = defineProps<{
  action: () => void;
  class?: string;
  prependIcon?: string;
  appendIcon?: string;
  icon?: string;
}>();
</script>

<style scoped>
.nebulaBgGradient {
  background-image: linear-gradient(90deg, #c782f1, #5270dc);
  -webkit-text-fill-color: transparent;
  -webkit-text-fill-color: white;
}
</style>
