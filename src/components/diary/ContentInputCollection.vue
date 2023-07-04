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
          <v-list>
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

const props = defineProps(["preCont", "preContUni", "preContTrain"]);
const emit = defineEmits([
  "update:content",
  "update:contentUni",
  "update:contentTraining",
]);

const { day } = useRoute().params;

onMounted(async () => {
  const { data, error } = await supabase.from("diary").select().eq("day", day);
  if (error === null) {
    content.value = data[0].content!;
    contentUni.value = data[0].content_uni!;
    contentTraining.value = data[0].content_training!;
    emit("update:content", content.value);
    emit("update:contentUni", contentUni.value);
    emit("update:contentTraining", contentTraining.value);
  }
});

const content = ref("");
const contentUni = ref("");
const contentTraining = ref("");
const contentProjects = ref("");
const showContentUni = ref(false);
const showContentTraining = ref(false);
</script>
