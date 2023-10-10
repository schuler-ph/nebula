<template>
  <span class="font-weight-black nebulaTextGradient"><slot /></span>
</template>

<script setup lang="ts"></script>

<style scoped>
.nebulaTextGradient {
  background-image: linear-gradient(90deg, #c782f1, #5270dc);
  background-clip: border-box;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
