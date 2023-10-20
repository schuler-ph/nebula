<template>
  <v-app id="auth">
    <v-main>
      <v-card
        rounded="0"
        height="100%"
        :image="nebulaBg"
        class="d-flex justify-center align-center"
      >
        <router-view
      /></v-card>
    </v-main>
    <CustomSnackbar
      v-model="snackbarOpen"
      :text="snackbarText"
      :color="snackbarColor"
    />
  </v-app>
</template>

<script setup lang="ts">
import nebulaBg from "@/assets/bg/appBarNebula.jpg";
import CustomSnackbar from "@/components/generic/CustomSnackbar.vue";
import { useSnackbarStore } from "@/store/snackbarStore";
import { storeToRefs } from "pinia";

const { snackbarOpen, snackbarText, snackbarColor } = storeToRefs(
  useSnackbarStore()
);
</script>
