<template>
  <v-sheet rounded="lg" class="pa-5">
    <v-label>New Todo Name</v-label>
    <v-text-field v-model="newSubText" variant="solo"></v-text-field>
    <v-expansion-panels>
      <v-expansion-panel v-for="todo in template">
        <v-expansion-panel-title class="text-h5">
          <CustomDialog
            :action="() => deleteTodo(todo.id)"
            color="primary"
            class="mr-5 text-h6"
            icon="mdi-trash-can-outline"
            size="small"
          >
            <template v-slot:content>
              Are you sure you want to delete this todo and all subtodos?
            </template>
          </CustomDialog>
          {{ capFirst(todo.name) }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-sheet class="my-2" v-for="sub in todo.subtodos">
            <CustomDialog
              :action="() => deleteTodo(sub.id)"
              color="primary"
              class="mx-5"
              icon="mdi-trash-can-outline"
              size="x-small"
            >
              <template v-slot:content>
                Are you sure you want to delete this todo and all subtodos?
              </template>
            </CustomDialog>
            {{ capFirst(sub.name) }}
          </v-sheet>
          <v-divider class="my-5" :thickness="2"></v-divider>
          <v-btn @click="addNewTodo(todo.id)"> New Subtodo </v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-btn @click="addNewTodo()" class="mt-5"> New Todo </v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
import { getUserId, supabase } from "@/lib/supabaseClient";
import { InsertDto, Row } from "@/types/supabaseHelper";
import { ref } from "vue";
import { onMounted } from "vue";
import { capFirst } from "@/helper/stringHelper";
import CustomDialog from "@/components/generic/CustomDialog.vue";

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
    subtodo_of: parent ? parent : null,
  };
  const { error } = await supabase.from("todo").insert(todo);
  if (error === null) {
    newSubText.value = "";
    await getTodoTemplate();
  }
}

async function deleteTodo(id: string) {
  const { error } = await supabase.from("todo").delete().eq("id", id);
  if (error === null) {
    await getTodoTemplate();
  }
}
</script>
