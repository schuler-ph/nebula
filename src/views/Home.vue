<template>
  <v-container class="rounded-lg">
    <v-row>
      <v-btn size="large" @click="$router.push('/new')" class="mx-auto my-5">
        New entry
      </v-btn>
    </v-row>
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

const diaryEntries = ref<Row<"diary">[] | null>([]);

async function getEntries() {
  const { data, error } = await supabase
    .from("diary")
    .select()
    .order("day", { ascending: false });
  diaryEntries.value = data;
}

onMounted(() => {
  getEntries();
});
</script>
