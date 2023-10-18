<template>
  <v-sheet rounded="lg" elevation="10">
    <v-list rounded="lg">
      <div v-for="linkGroup in sidebarLinks">
        <div class="text-h6 font-weight-regular ml-4">
          {{ linkGroup.title }}
        </div>
        <v-list-item
          v-for="link in linkGroup.links"
          :key="link.title"
          exact
          :to="link.to"
          :prepend-icon="link.icon"
        >
          <v-list-item-title> {{ link.title }} </v-list-item-title>
        </v-list-item>
        <v-divider class="my-2"></v-divider>
      </div>
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

const sidebarLinks = [
  {
    title: "Diary",
    links: [
      {
        title: "Week overview",
        to: "/",
        icon: "mdi-view-day",
      },
      {
        title: "All entries",
        to: "/allentries",
        icon: "mdi-calendar-month",
      },
      // {
      //   title: "Week closure",
      //   to: "/weekclosure",
      //   icon: "mdi-calendar-week",
      // },
    ],
  },
  {
    title: "Training",
    links: [
      {
        title: "Split",
        to: "/training/split",
        icon: "mdi-octahedron",
      },
      {
        title: "Exercises",
        to: "/training/exercises",
        icon: "mdi-pyramid",
      },
      {
        title: "Training",
        to: "/training",
        icon: "mdi-weight-lifter",
      },
    ],
  },
  {
    title: "Todo",
    links: [
      {
        title: "Daily",
        to: "/todo/daily",
        icon: "mdi-repeat-variant",
      },
      {
        title: "Longterm",
        to: "/todoLt/longterm",
        icon: "mdi-flag-checkered",
      },
      {
        title: "Uni",
        to: "/todoLt/uni",
        icon: "mdi-school",
      },
      {
        title: "Nebula",
        to: "/todoLt/nebula",
        icon: "mdi-notebook",
      },
    ],
  },
  {
    title: "History",
    links: [
      {
        title: "Weight",
        to: "/history",
        icon: "mdi-chart-bell-curve-cumulative",
      },
      {
        title: "Water Intake",
        to: "/history",
        icon: "mdi-chart-bell-curve-cumulative",
      },
      {
        title: "Habits",
        to: "/history",
        icon: "mdi-chart-bell-curve-cumulative",
      },
      {
        title: "Sleep Schedule",
        to: "/history",
        icon: "mdi-chart-bell-curve-cumulative",
      },
    ],
  },
];
</script>

<style scoped></style>
