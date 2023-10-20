<template>
  <v-img class="py-10" height="700" src="@/assets/logo.svg" />
  <!-- <v-btn @click="() => enable()">enable</v-btn> -->
</template>

<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";

const enable = async () => {
  const { data, error } = await supabase.auth.updateUser({
    data: { disabled: false },
  });
};
</script>
