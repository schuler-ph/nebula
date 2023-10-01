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
import { useRoute } from "vue-router";
import { useStorageStore } from "@/store/storageStore";

const { todoDaily } = useDiaryContent();

onMounted(async () => {
  const { day } = useRoute().params;

  const { allEntrys } = useStorageStore();
  const todoDailyDone = allEntrys.find((e) => e.day === day)?.todoDailyDone;

  todoDaily.value = todoDailyDone!;
  emit("update:todoDaily", todoDaily.value);
});

const emit = defineEmits(["update:todoDaily"]);
</script>
