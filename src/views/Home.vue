<template>
  <v-card>
    <v-card-title>Hello oida</v-card-title>
    <v-card-actions>
      <my-beautiful-btn :action="animate">Animate</my-beautiful-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import MyBeautifulBtn from "@/components/generic/MyBeautifulBtn.vue";
import { ref } from "vue";

const wide = ref(false);

const animate = () => {};
</script>

<style scoped></style>
