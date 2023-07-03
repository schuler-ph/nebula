<template>
  <ul>
    <li v-for="entry in diaryEntries" :key="entry.id">{{ entry.day + ": " + entry.title }}</li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient';
import { Row } from "@/types/supabaseHelper"

const diaryEntries = ref<Row<'diary'>[] | null>([])

async function getCountries() {
  const { data } = await supabase.from('diary').select()
  diaryEntries.value = data
}

onMounted(() => {
  getCountries()
})
</script>
