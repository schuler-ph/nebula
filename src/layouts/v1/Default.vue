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
  </v-app>
</template>

<script setup lang="ts">
import nebulaBg from "@/assets/bg/appBarNebula.jpg";
</script>

<style src="../../plugins/styles.css"></style>
