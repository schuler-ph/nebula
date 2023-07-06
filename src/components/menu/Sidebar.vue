<template>
  <v-sheet rounded="lg" elevation="10">
    <v-list rounded="lg">
      <v-list-item
        v-for="link in links"
        :key="link.title"
        exact
        :to="link.to"
        :prepend-icon="link.icon"
      >
        <v-list-item-title> {{ link.title }} </v-list-item-title>
      </v-list-item>

      <v-divider class="my-2"></v-divider>
      <v-list-item
        v-for="link in linksTraining"
        :key="link.title"
        exact
        :to="link.to"
        :prepend-icon="link.icon"
      >
        <v-list-item-title> {{ link.title }} </v-list-item-title>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-menu location="start">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-box"
            append-icon="mdi-dots-vertical"
            link
            color="grey-lighten-4"
          >
            <v-list-item-title>User</v-list-item-title>
          </v-list-item>
        </template>
        <v-list>
          <v-list-item>
            <v-btn append-icon="mdi-logout" class="ma-3" @click="logout"
              >logout</v-btn
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list>
  </v-sheet>
</template>

<script setup lang="ts">
import useAuth from "@/hooks/useAuth";
const { logout } = useAuth();

const links = [
  {
    title: "All entries",
    to: "/",
    icon: "mdi-calendar-month",
  },
  {
    title: "New entry",
    to: "/new",
    icon: "mdi-calendar-plus",
  },
];
const linksTraining = [
  {
    title: "Plan",
    to: "/training",
    icon: "mdi-hexagon-multiple",
  },
  {
    title: "Split",
    to: "/training/split",
    icon: "mdi-hexagon",
  },
  {
    title: "Exercises",
    to: "/training/exercises",
    icon: "mdi-star-three-points",
  },
];
</script>

<style scoped></style>
