<template>
  <v-row no-gutters>
    <ContentInput
      title="Content"
      v-model="content"
      color="deep-purple-lighten-4"
      @update:modelValue="$emit('update:content', content)"
    />
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ContentInput from "./ContentInput.vue";
import { onMounted } from "vue";
import { supabase } from "@/lib/supabaseClient";
import { useRoute } from "vue-router";
import { useDiaryContent } from "@/hooks/useDiaryContent";

const emit = defineEmits([
  "update:content",
  "update:contentUni",
  "update:contentTraining",
  "update:contentProjects",
]);

onMounted(async () => {
  const { day } = useRoute().params;

  if (day) {
    const { data, error } = await supabase
      .from("diary")
      .select()
      .eq("day", day);
    if (error === null && data.length !== 0) {
      content.value = data[0].content!;
      // TODO
      emit("update:content", content.value);
    }
  }
});

const { content, contentUni, contentTraining, contentProjects } =
  useDiaryContent();
</script>
