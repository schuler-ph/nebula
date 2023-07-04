<template>
  <v-sheet rounded="lg" elevation="10">
    <v-list rounded="lg">
      <v-list-item v-for="link in links" :key="link.title" exact :to="link.to">
        <v-list-item-title> {{ link.title }} </v-list-item-title>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item link color="grey-lighten-4">
        <v-list-item-title> Refresh </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-sheet>
</template>

<script setup lang="ts">
const links = [
  {
    title: "All entries",
    to: "/",
  },
  {
    title: "New entry",
    to: "/new",
  },
];
</script>
