<template>
  <v-card
    elevation="3"
    :title="entry.day!"
    :subtitle="entry.title! + ' (' + getFullContentLength() + ')'"
    class="ma-2 pa-2"
  >
    <v-card-actions>
      <v-menu activator="parent" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-cog"
            color="primary"
            variant="elevated"
          />
        </template>

        <v-card class="d-flex flex-column" width="150">
          <v-btn
            @click="$router.push('/edit/' + entry.day)"
            variant="tonal"
            color="primary"
            class="mt-2 mb-1 mx-2"
          >
            Edit
          </v-btn>

          <v-dialog v-model="deleteDialog" width="auto">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="tonal"
                color="red"
                class="mt-1 mb-2 mx-2"
                v-bind="props"
              >
                Delete
              </v-btn>
            </template>

            <v-card>
              <v-card-text>
                Are you sure you want to delete this diary entry?
                <br />
                Its content is
                <span class="font-weight-black">{{
                  entry.content?.length
                }}</span>
                characters long!
              </v-card-text>
              <v-card-actions>
                <v-sheet class="d-flex">
                  <v-btn variant="tonal" color="red" @click="deleteThisEntry"
                    >Confirm</v-btn
                  >
                  <v-btn
                    variant="tonal"
                    color="primary"
                    @click="deleteDialog = false"
                    >Cancel</v-btn
                  >
                </v-sheet>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { Row } from "@/types/supabaseHelper";
import { ref } from "vue";

const { entry } = defineProps<{
  entry: Row<"diary">;
}>();

const deleteDialog = ref(false);
const emit = defineEmits(["needRefresh"]);
async function deleteThisEntry() {
  await supabase.from("diary").delete().eq("id", entry.id);
  emit("needRefresh");
}

function getFullContentLength() {
  let len = 0;
  len += entry.content?.length!;
  len += entry.content_uni?.length!;
  len += entry.content_training?.length!;
  len += entry.content_projects?.length!;
  return len;
}
</script>
