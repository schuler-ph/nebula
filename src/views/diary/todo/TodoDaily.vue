<template>
  <v-sheet rounded="lg" class="pa-5">
    <v-label>New Todo Name</v-label>
    <v-text-field v-model="newTodoText" variant="solo"></v-text-field>
    <div class="d-flex justify-center mb-5">
      <v-btn @click="() => addNewTodo(null)"> New Todo </v-btn>
    </div>
    <v-expansion-panels>
      <v-expansion-panel v-for="todo in dlTodos">
        <v-expansion-panel-title class="text-h5">
          <div class="d-flex align-center">
            <v-btn
              :color="todo.inactive ? 'secondary' : 'primary'"
              class="mr-5 text-h6"
              icon="mdi-pencil"
              size="small"
              @click="
                () => {
                  editTodoId = todo.id;
                  openEditDialog();
                }
              "
              @click.native="check($event)"
            >
            </v-btn>
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
            <v-btn
              :color="sub.inactive ? 'secondary' : 'primary'"
              :class="smAndDown ? 'mr-2' : 'mx-5'"
              icon="mdi-pencil"
              size="x-small"
              @click="
                () => {
                  editTodoId = sub.id;
                  openEditDialog();
                }
              "
            >
            </v-btn>
            <div>
              {{ capFirst(sub.name) }}
            </div>
          </v-sheet>
          <v-divider class="my-5" :thickness="2"></v-divider>
          <v-btn @click="() => addNewTodo(todo.id)"> New Subtodo </v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-sheet>

  <v-dialog v-model="editTodoDialogOpen" width="500">
    <v-card>
      <v-card-text>
        <v-text-field label="Title" v-model="editTodoText"></v-text-field>
        <v-switch
          label="Active"
          color="primary"
          v-model="editTodoStatus"
        ></v-switch>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex">
          <v-btn color="primary" @click="() => submitEditTodo()"
            >Submit Changes</v-btn
          >
          <!-- <CustomDialog
            :action="() => deleteTodo()"
            color="red"
            icon="mdi-delete"
            size="small"
          >
            <template v-slot:content>
              Are you sure you want to delete this todo?
            </template>
          </CustomDialog> -->
          <v-btn color="secondary" @click="() => (editTodoDialogOpen = false)"
            >Cancel</v-btn
          >
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { getUserId, supabase } from "@/lib/supabaseClient";
import { InsertDto, Row } from "@/types/supabaseHelper";
import { ref } from "vue";
import { onMounted } from "vue";
import { capFirst } from "@/helper/stringHelper";
import CustomDialog from "@/components/generic/CustomDialog.vue";
import { useDisplay } from "vuetify";
import { useStorageStore } from "@/store/storageStore";
import { getDailyTodos } from "@/store/storage/todos";
const { smAndDown } = useDisplay();

const dlTodos = ref();
const newTodoText = ref("");

const editTodoDialogOpen = ref(false);
const editTodoId = ref<string>();
const editTodoText = ref("");
const editTodoTime = ref<Date>();
const editTodoStatus = ref(false);

const openEditDialog = () => {
  const { allTodos } = useStorageStore();
  const todoToEdit = allTodos.find((at) => at.id === editTodoId.value);
  if (todoToEdit) {
    editTodoText.value = todoToEdit.name;
    editTodoStatus.value = !todoToEdit.inactive;
    editTodoTime.value = new Date();
    editTodoDialogOpen.value = true;
  }
};

// const deleteTodo = async () => {
//   editTodoDialogOpen.value = false;
//   const { error } = await supabase
//     .from("todo")
//     .delete()
//     .eq("id", editTodoId.value);
//   await getTodoTemplate();
// };
const submitEditTodo = async () => {
  editTodoDialogOpen.value = false;
  await supabase
    .from("todo")
    .update({
      name: editTodoText.value,
      updated_at: editTodoTime.value!.toUTCString(),
      inactive: !editTodoStatus.value,
    })
    .eq("id", editTodoId.value);
  await getTodoTemplate();
};

onMounted(() => {
  alignTodos();
});
const { initTodosSingle } = useStorageStore();

function alignTodos() {
  dlTodos.value = [];
  dlTodos.value = getDailyTodos(false);
}

async function getTodoTemplate() {
  await initTodosSingle();
  alignTodos();
}

function check(e: Event) {
  e.stopPropagation();
}

async function addNewTodo(parent: string | null) {
  const { error } = await supabase.from("todo").insert({
    category: "daily",
    name: newTodoText.value,
    user_id: await getUserId(),
    subtodo_of: parent,
  });
  if (error === null) {
    newTodoText.value = "";
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
