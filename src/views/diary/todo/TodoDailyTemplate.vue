<template>
  <v-sheet rounded="lg">
    <v-label>New Todo Name</v-label>
    <v-text-field v-model="newSubText" variant="solo"></v-text-field>
    <v-expansion-panels>
      <v-expansion-panel v-for="todo in template">
        <v-expansion-panel-title>
          {{ capFirst(todo.name) }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-sheet v-for="sub in todo.subtodos">
            {{ capFirst(sub.name) }}
          </v-sheet>
          <v-divider class="my-5" :thickness="2"></v-divider>
          <v-btn @click="addNewTodo(todo.id)"> New Subtodo </v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-btn @click="addNewTodo" class="mt-5"> New Todo </v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
import { getUserId, supabase } from "@/lib/supabaseClient";
import { InsertDto, Row } from "@/types/supabaseHelper";
import { ref } from "vue";
import { onMounted } from "vue";
import { capFirst } from "@/helper/stringHelper";

const template = ref<TodoTemplate[]>([]);
type TodoTemplate = Row<"todo"> & { subtodos?: Row<"todo">[] };
const newSubText = ref("");

onMounted(async () => {
  await getTodoTemplate();
});

async function getTodoTemplate() {
  let todos: Row<"todo">[];
  template.value = [];
  const { data, error } = await supabase
    .from("todo")
    .select()
    .eq("category", "daily")
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

async function addNewTodo(parent?: string) {
  const todo: InsertDto<"todo"> = {
    category: "daily",
    name: newSubText.value,
    user_id: await getUserId(),
    subtodo_of: parent,
  };
  const { error } = await supabase.from("todo").insert(todo);
  if (error === null) {
    newSubText.value = "";
    await getTodoTemplate();
  }
}
</script>
