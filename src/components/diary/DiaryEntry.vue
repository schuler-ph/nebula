<template>
  <v-card
    :title="entry.day!"
    :subtitle="entry.title! + ' (' + entry.content?.length + ')'"
    class="ma-2 pa-2"
  ></v-card>
</template>

<script setup lang="ts">
import { Row } from "@/types/supabaseHelper";

const { entry } = defineProps<{
  entry: Row<"diary">;
}>();
</script>
