<template>
  <v-app id="inspire">
    <v-app-bar flat :image="nebulaBg" elevation="10">
      <v-container class="fill-height d-flex align-center justify-center pa-0">
        <v-avatar :image="nebulaLogo" size="48"></v-avatar>

        <v-btn
          v-for="link in links"
          :key="link.title"
          variant="text"
          color="white"
          @click="$router.push(link.to)"
          :class="xs ? 'pa-0' : ''"
          size="x-large"
        >
          {{ link.title }}
        </v-btn>

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              :class="smAndDown ? '' : 'd-none'"
              v-bind="props"
              icon="mdi-menu"
              variant="elevated"
              color="white"
            ></v-btn>
          </template>
          <Sidebar />
        </v-menu>
      </v-container>
    </v-app-bar>

    <v-main class="bg-deep-purple-lighten-5">
      <!-- <v-toolbar
        class="bg-white pl-6"
        :border="true"
        :class="smAndDown ? '' : 'd-none'"
        title="Menu"
        :collapse="xs"
      >
      </v-toolbar> -->
      <v-container>
        <v-row>
          <v-col :cols="md ? 4 : 3" :hidden="smAndDown" class="fixed">
            <Sidebar />
          </v-col>

          <v-col>
            <v-sheet min-height="70vh" rounded="lg" elevation="20">
              <router-view />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Sidebar from "@/components/menu/Sidebar.vue";
import { useDisplay } from "vuetify";
const { smAndDown, xs, md } = useDisplay();

import nebulaLogo from "@/assets/logo.svg";
import nebulaBg from "@/assets/bg/appBarNebula.jpg";

const links = [
  {
    title: "Nebula",
    to: "/",
  },
  {
    title: "About",
    to: "/about",
  },
];
</script>
