<template>
  <v-row no-gutters>
    <ContentInput
      title="Content"
      v-model.trim="content"
      color="deep-purple-lighten-4"
      @update:modelValue="$emit('update:content', content)"
    />
    <ContentInput
      title="Uni"
      v-model.trim="contentUni"
      color="teal-lighten-4"
      v-if="showContentUni"
      @update:modelValue="$emit('update:contentUni', contentUni)"
    />
    <ContentInput
      title="Training"
      v-model.trim="contentTraining"
      color="deep-orange-lighten-4"
      v-if="showContentTraining"
      @update:modelValue="$emit('update:contentTraining', contentTraining)"
    />
    <ContentInput
      title="Projekte"
      v-model.trim="contentProjects"
      color="light-green-lighten-4"
      v-if="showContentProjects"
      @update:modelValue="$emit('update:contentProjects', contentProjects)"
    />

    <v-col cols="12" sm="4">
      <v-sheet
        min-height="100"
        :border="true"
        class="d-flex justify-center align-center ma-1"
        rounded="lg"
        height="100%"
      >
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" elevation="10" icon="mdi-plus"></v-btn>
          </template>
          <v-list class="px-3">
            <v-switch
              v-model="showContentUni"
              label="Uni"
              color="teal-lighten-2"
            ></v-switch>
            <v-switch
              v-model="showContentTraining"
              label="Training"
              color="deep-orange-lighten-2"
            ></v-switch>
            <v-switch
              v-model="showContentProjects"
              label="Projekte"
              color="light-green-lighten-2"
            ></v-switch>
          </v-list>
        </v-menu>
      </v-sheet>
    </v-col>
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
      contentUni.value = data[0].content_uni!;
      contentTraining.value = data[0].content_training!;
      contentProjects.value = data[0].content_projects!;
      emit("update:content", content.value);
      emit("update:contentUni", contentUni.value);
      emit("update:contentTraining", contentTraining.value);
      emit("update:contentProjects", contentProjects.value);
      showContentUni.value = contentUni.value.length > 0;
      showContentTraining.value = contentTraining.value.length > 0;
      showContentProjects.value = contentProjects.value.length > 0;
    }
  }
});

const {
  content,
  contentUni,
  contentTraining,
  contentProjects,
  showContentUni,
  showContentTraining,
  showContentProjects,
} = useDiaryContent();
</script>
