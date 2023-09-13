<template>
  <v-sheet rounded="lg" class="pa-5">
    <v-label>New Todo Name</v-label>
    <v-text-field v-model="newSubText" variant="solo"></v-text-field>
    <v-expansion-panels>
      <v-expansion-panel v-for="todo in template">
        <v-expansion-panel-title class="text-h5">
          <div class="d-flex align-center">
            <CustomDialog
              :action="() => disableTodo(todo.id, todo.inactive)"
              :color="todo.inactive ? 'secondary' : 'primary'"
              class="text-h6"
              :icon="todo.inactive ? 'mdi-delete-restore' : 'mdi-delete'"
              size="small"
            >
              <template v-slot:content>
                Are you sure you want to
                {{ todo.inactive ? "enable" : "disable" }} this todo?
              </template>
            </CustomDialog>
            <div class="mx-5">{{ capFirst(todo.name) }}</div>
            <v-text-field
              class="d-flex"
              label="Order"
              :model-value="todo.order"
              @update:model-value="
                (newVal) => {
                  if (Number(newVal) > 0) {
                    todo.order = Number(newVal);
                  }
                }
              "
              @update:focused="
                async (focused) => {
                  if (!focused) {
                    await supabase
                      .from('todo')
                      .update({ order: todo.order })
                      .eq('id', todo.id);
                    await getTodoTemplate();
                  }
                }
              "
              @click.native="check($event)"
              variant="underlined"
            ></v-text-field>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-sheet
            class="my-3 d-flex align-center"
            v-for="sub in todo.subtodos"
          >
            <CustomDialog
              :action="() => disableTodo(sub.id, sub.inactive)"
              :color="sub.inactive ? 'secondary' : 'primary'"
              :class="smAndDown ? 'mr-2' : 'mx-5'"
              :icon="sub.inactive ? 'mdi-delete-restore' : 'mdi-delete'"
              size="x-small"
            >
              <template v-slot:content>
                Are you sure you want to
                {{ sub.inactive ? "enable" : "disable" }} this subtodo?
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

function check(e: Event) {
  e.stopPropagation();
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

async function disableTodo(id: string, status: boolean) {
  const { error } = await supabase
    .from("todo")
    .update({ inactive: !status })
    .eq("id", id);
  if (error === null) {
    await getTodoTemplate();
  }
}
</script>
