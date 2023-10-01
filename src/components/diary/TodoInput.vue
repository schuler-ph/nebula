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
                  (newVal) => {
                    const adding = newVal.indexOf(todo.id) !== -1;

                    todo.subtodos?.forEach((sub) => {
                      const index = newVal.indexOf(sub.id);

                      if (adding && index === -1) {
                        newVal.push(sub.id);
                      } else if (!adding && index !== -1) {
                        newVal.splice(index, 1);
                      }
                    });

                    $emit('update:modelValue', newVal);
                  }
                "
              ></v-checkbox-btn>
            </div>
            <span class="text-h5 font-weight-regular">
              {{ capFirst(todo.name) }} ({{
                modelValue?.filter((i1) =>
                  todo.subtodos?.some((i2) => i2.id === i1)
                ).length
              }}
              / {{ todo.subtodos?.length }})
            </span>
          </v-sheet>
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
                  (newVal) => {
                    const mainIndex = newVal.indexOf(todo.id);
                    const done =
                      mainIndex === -1 ? newVal.length : newVal.length - 1;
                    const total = todo.subtodos?.length;

                    if (done === total && mainIndex === -1) {
                      newVal.push(todo.id);
                    } else if (done !== total && mainIndex !== -1) {
                      newVal.splice(mainIndex, 1);
                    }

                    $emit('update:modelValue', newVal);
                  }
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
import { useStorageStore } from "@/store/storageStore";
import { Row } from "@/types/supabaseHelper";
import { onMounted, ref } from "vue";

const { modelValue } = defineProps({
  modelValue: {
    type: Array<string>,
  },
  color: {
    type: String,
  },
});
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

  const { allTodos } = useStorageStore();
  const req = allTodos
    .filter((t) => t.inactive !== true && t.category === "daily")
    .sort((a, b) => {
      if (a.order! < b.order!) return -1;
      else if (a.order! > b.order!) return 1;
      return 0;
    });

  todos = req.filter((d) => d.subtodo_of === null);
  todos.forEach((t) => {
    const subtodos = req.filter((d) => d.subtodo_of === t.id);
    template.value.push({
      ...t,
      subtodos,
    });
  });
}
</script>
