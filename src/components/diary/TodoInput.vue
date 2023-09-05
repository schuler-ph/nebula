<template>
  <v-col cols="12" class="pa-1 my-1">
    <v-expansion-panels :class="'bg-' + color" class="pa-3 rounded-lg">
      <v-expansion-panel v-for="todo in template">
        <v-expansion-panel-title>
          <v-sheet class="d-flex align-center">
            <div>
              <v-checkbox-btn
                color="primary"
                :value="todo.id"
                :model-value="modelValue"
                @click.native="check($event)"
                @update:model-value="
                  (newVal) => $emit('update:modelValue', newVal)
                "
              ></v-checkbox-btn>
            </div>
            <span class="text-h5 font-weight-regular">
              {{ capFirst(todo.name) }}
            </span></v-sheet
          >
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-sheet
            v-for="sub in todo.subtodos"
            class="d-flex align-center flex-row justify-start"
          >
            <div>
              <v-checkbox-btn
                color="primary"
                :value="sub.id"
                :model-value="modelValue"
                @update:model-value="
                  (newVal) => $emit('update:modelValue', newVal)
                "
              >
              </v-checkbox-btn>
            </div>
            <span class="text-h6 font-weight-regular">
              {{ capFirst(sub.name) }}
            </span>
          </v-sheet>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-col>
</template>

<script setup lang="ts">
import { capFirst } from "@/helper/stringHelper";
import { supabase } from "@/lib/supabaseClient";
import { Row } from "@/types/supabaseHelper";
import { onMounted, ref } from "vue";

const { category } = defineProps(["modelValue", "color", "category"]);
defineEmits(["update:modelValue"]);

const template = ref<TodoTemplate[]>([]);
type TodoTemplate = Row<"todo"> & { subtodos?: Row<"todo">[] };

onMounted(async () => {
  await getTodoTemplate();
});

function check(e: Event) {
  e.stopPropagation();
}

async function getTodoTemplate() {
  let todos: Row<"todo">[];
  template.value = [];
  const { data, error } = await supabase
    .from("todo")
    .select()
    .not("inactive", "eq", true)
    .eq("category", "daily")
    .order("order", { ascending: true });
  if (error === null && data.length !== 0) {
    todos = data.filter((d) => d.subtodo_of === null);
    todos.forEach((t) => {
      const subtodos = data.filter((d) => d.subtodo_of === t.id);
      template.value.push({
        ...t,
        subtodos,
      });
    });
  }
}
</script>
