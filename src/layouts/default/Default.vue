<template>
  <v-app id="inspire">
    <v-app-bar flat :image="nebulaBg" elevation="10">
      <v-container class="fill-height d-flex align-center justify-center">
        <v-avatar
          :class="xs ? '' : 'me-10 ms-4'"
          :image="nebulaLogo"
          size="32"
        ></v-avatar>

        <v-btn
          v-for="link in links"
          :key="link.title"
          variant="text"
          color="white"
          @click="$router.push(link.to)"
          :class="xs ? 'pa-0' : ''"
        >
          {{ link.title }}
        </v-btn>

        <v-btn
          prepend-icon="mdi-chevron-down"
          color="white"
          :class="xs ? 'pa-0' : ''"
        >
          User

          <v-menu location="start" activator="parent">
            <v-list>
              <v-list-item>
                <v-btn append-icon="mdi-logout" class="ma-3" @click="logout"
                  >logout</v-btn
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="bg-deep-purple-lighten-5">
      <v-toolbar
        class="bg-white pl-6"
        :border="true"
        :class="smAndDown ? '' : 'd-none'"
        title="Menu"
        :collapse="xs"
      >
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-menu"></v-btn>
          </template>
          <Sidebar />
        </v-menu>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="2" :hidden="smAndDown">
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
const { smAndDown, xs } = useDisplay();

import nebulaLogo from "@/assets/logo.svg";
import nebulaBg from "@/assets/bg/appBarNebula.jpg";

import useAuth from "@/hooks/useAuth";
const { logout } = useAuth();

const links = [
  {
    title: "Home",
    to: "/",
  },
  {
    title: "About",
    to: "/about",
  },
];
</script>
