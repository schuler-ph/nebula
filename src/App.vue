<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import useAuth from "@/hooks/useAuth";
import { useStorageStore } from "./store/storageStore";

onBeforeMount(() => {
  const { login, initAuth, logout } = useAuth();
  initAuth();
  const { initEx, initDiary, initSplits, initTodos } = useStorageStore();
  initEx();
  initDiary();
  initSplits();
  initTodos();
});
</script>
