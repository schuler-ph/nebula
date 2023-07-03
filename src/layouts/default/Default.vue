<template>
  <v-app id="inspire">
    <v-app-bar flat :image="nebulaBg">
      <v-container class="fill-height d-flex align-center">
        <v-avatar class="me-10 ms-4" :image="nebulaLogo" size="32"></v-avatar>

        <v-btn v-for="link in links" :key="link" variant="text" color="white">
          {{ link }}
        </v-btn>

        <v-spacer></v-spacer>
        <v-btn color="white">
          User

          <v-menu location="start" activator="parent">
            <v-list>
              <v-list-item>
                <v-btn @click="logout" color="deep-purple-darken-2"
                  >logout</v-btn
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
        <!-- <v-responsive max-width="260">
          <v-text-field
            prepend-icon="mdi-eye"
            density="compact"
            hide-details
          ></v-text-field>
        </v-responsive> -->
      </v-container>
    </v-app-bar>

    <v-main class="bg-deep-purple-lighten-5">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg">
              <v-list rounded="lg">
                <v-list-item v-for="n in 5" :key="n" link>
                  <v-list-item-title> List Item {{ n }} </v-list-item-title>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item link color="grey-lighten-4">
                  <v-list-item-title> Refresh </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <router-view />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import nebulaLogo from "@/assets/logo.svg";
import nebulaBg from "@/assets/bg/appBarNebula.jpg";

import useAuth from "@/hooks/useAuth";
const { logout } = useAuth();

const links = ["Dashboard", "Messages", "Profile", "Updates"];
</script>
