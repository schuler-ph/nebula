<template>
  <v-sheet
    rounded="lg"
    class="d-flex flex-column ma-1 align-center"
    height="100"
    :color="color"
  >
    <v-btn
      @click="$router.push('/edit/' + dateToIsoString(date))"
      :prepend-icon="icon"
      :color="
        dateToIsoString(date) === dateToIsoString(new Date())
          ? 'white'
          : 'transparent'
      "
      :class="
        dateToIsoString(date) === dateToIsoString(new Date())
          ? ''
          : 'text-white'
      "
      class="text-h6 font-weight-black"
      >{{ title + " - " + dateToIsoString(date) }}</v-btn
    >

    <v-sheet>
      {{ contentLength }}
    </v-sheet>
  </v-sheet>
</template>

<script setup lang="ts">
import { dateToIsoString } from "@/helper/dateHelper";
import { Row } from "@/types/supabaseHelper";
defineProps(["title", "color", "icon", "date", "contentLength"]);

function getFullContentLength(instance: Row<"diary">) {
  let len = 0;
  len += instance.title?.length!;
  len += instance.content?.length!;
  len += instance.content_uni?.length!;
  len += instance.content_training?.length!;
  len += instance.content_projects?.length!;
  return len;
}
</script>
