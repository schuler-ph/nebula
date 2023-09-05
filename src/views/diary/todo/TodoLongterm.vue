<template>
  <v-sheet rounded="lg" class="pa-5">
    <v-label>New Todo Name</v-label>
    <v-text-field v-model="newSubText" variant="solo"></v-text-field>
    <v-expansion-panels>
      <v-expansion-panel v-for="todo in template">
        <v-expansion-panel-title class="text-h5">
          <CustomDialog
            :action="() => todoToggleDone(todo.id, todo.done)"
            :color="todo.done ? 'secondary' : 'primary'"
            class="mr-5 text-h6"
            :icon="todo.done ? 'mdi-undo' : 'mdi-check'"
            size="small"
          >
            <template v-slot:content>
              Are you sure you want to toggle the status of this todo?
            </template>
          </CustomDialog>
          {{ capFirst(todo.name) }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-sheet
            class="my-3 d-flex align-center"
            v-for="sub in todo.subtodos"
          >
            <CustomDialog
              :action="() => todoToggleDone(sub.id, sub.done)"
              :color="sub.done ? 'secondary' : 'primary'"
              :class="smAndDown ? 'mr-2' : 'mx-5'"
              :icon="sub.done ? 'mdi-undo' : 'mdi-check'"
              size="x-small"
            >
              <template v-slot:content>
                Are you sure you want to toggle the status of this subtodo?
              </template>
            </CustomDialog>
            <div>
              {{ capFirst(sub.name) }}
            </div>
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
import { useDisplay } from "vuetify";
const { smAndDown } = useDisplay();

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
    .eq("category", "longterm")
    .order("name", { ascending: true });
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

async function addNewTodo(parent?: string) {
  if (newSubText.value !== "") {
    const todo: InsertDto<"todo"> = {
      category: "longterm",
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
}

async function todoToggleDone(id: string, done: boolean) {
  const { error } = await supabase
    .from("todo")
    .update({ done: !done })
    .eq("id", id);
  if (error === null) {
    await getTodoTemplate();
  }
}
</script>
