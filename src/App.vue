<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import useAuth from "@/hooks/useAuth";

onBeforeMount(() => {
  const { login, initAuth, logout } = useAuth();
  initAuth();
});
</script>
