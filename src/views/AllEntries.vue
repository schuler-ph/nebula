<template>
  <v-container class="rounded-lg">
    <v-row no-gutters>
      <v-col v-for="entry in diaryEntries" :key="entry.id" cols="12" sm="4">
        <DiaryEntry :entry="entry" @needRefresh="getEntries" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabaseClient";
import { Row } from "@/types/supabaseHelper";
import DiaryEntry from "@/components/diary/DiaryEntry.vue";
import { useStorageStore } from "@/store/storageStore";

const diaryEntries = ref<Row<"diary">[] | null>([]);
const { allEntrys, initDiary } = useStorageStore();

async function getEntries() {
  await initDiary();
}

onMounted(() => {
  diaryEntries.value = allEntrys;
});
</script>
