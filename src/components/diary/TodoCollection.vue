<template>
  <v-row no-gutters>
    <TodoInput
      v-model="todoDaily"
      category="daily"
      color="deep-purple-lighten-4"
      @update:modelValue="$emit('update:todoDaily', todoDaily)"
    />
  </v-row>
</template>

<script setup lang="ts">
import { useDiaryContent } from "@/hooks/useDiaryContent";
import TodoInput from "./TodoInput.vue";
import { onMounted } from "vue";
import { supabase } from "@/lib/supabaseClient";
import { useRoute } from "vue-router";

const { todoDaily, todoTraining, showTodoTraining } = useDiaryContent();

onMounted(async () => {
  const { day } = useRoute().params;
  const { data, error } = await supabase
    .from("diary")
    .select("todoDailyDone")
    .eq("day", day);
  if (error === null && data.length !== 0) {
    todoDaily.value = data[0].todoDailyDone;
  }
});

defineEmits(["update:todoDaily"]);
</script>
