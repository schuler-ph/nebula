<template>
  <v-card title="404" subtitle="Page not found">
    <v-card-actions>
      <v-btn prepend-icon="mdi-step-backward" @click="$router.back()"
        >Go back</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts"></script>
