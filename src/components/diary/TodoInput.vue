<template>
  <v-col cols="12" class="pa-1 my-1">
    <v-expansion-panels :class="'bg-' + color" class="pa-3 rounded-lg">
      <v-expansion-panel v-for="todo in template">
        <v-expansion-panel-title>
          <v-checkbox-btn
            :value="todo.id"
            :label="capFirst(todo.name)"
            :model-value="modelValue"
            @click.native="check($event)"
            @update:model-value="(newVal) => $emit('update:modelValue', newVal)"
          ></v-checkbox-btn>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-sheet v-for="sub in todo.subtodos">
            <v-checkbox-btn
              :value="sub.id"
              :label="capFirst(sub.name)"
              :model-value="modelValue"
              @update:model-value="
                (newVal) => $emit('update:modelValue', newVal)
              "
            ></v-checkbox-btn>
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
    .eq("category", category)
    .order("name", { ascending: true });
  if (error === null && data.length !== 0) {
    todos = data.filter((d) => d.subtodo_of === null);
    todos.forEach(async (t) => {
      const { data, error } = await supabase
        .from("todo")
        .select()
        .eq("subtodo_of", t.id);
      if (error === null && data.length !== 0) {
        template.value.push({
          ...t,
          subtodos: data,
        });
      } else {
        template.value.push(t);
      }
    });
  }
}
</script>
