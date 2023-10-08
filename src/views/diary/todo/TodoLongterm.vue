<template>
  <v-sheet rounded="lg" class="pa-5">
    <v-label>New Todo Name</v-label>
    <v-text-field
      v-model="newTodoText"
      variant="solo"
      ref="textFieldRef"
    ></v-text-field>
    <div class="d-flex justify-center">
      <v-btn @click="() => addNewTodo(null)" class="mb-3"> New Todo </v-btn>
    </div>
    <v-expansion-panels>
      <v-expansion-panel v-for="todo in ltTodos">
        <v-expansion-panel-title class="text-h5">
          <v-btn
            :color="todo.done ? 'secondary' : 'primary'"
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
          {{ capFirst(todo.name) }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="d-flex justify-center mt-1 mb-3">
            <v-btn @click="() => addNewTodo(todo.id)"> New Subtodo </v-btn>
          </div>
          <v-divider class="mb-5" :thickness="2"></v-divider>
          <v-sheet
            class="my-3 d-flex align-center"
            v-for="sub in todo.subtodos"
          >
            <v-btn
              :color="sub.done ? 'secondary' : 'primary'"
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
            <!-- <CustomDialog
              :action="() => todoToggleDone(sub.id, sub.done)"
              :color="sub.done ? 'secondary' : 'primary'"
              :class="smAndDown ? 'mr-2' : 'mx-5'"
              icon="mdi-pencil"
              size="x-small"
            >
              <template v-slot:content>
                Are you sure you want to toggle the status of this subtodo?
              </template>
            </CustomDialog> -->
            <div>
              {{ capFirst(sub.name) }}
            </div>
          </v-sheet>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

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
            <CustomDialog
              :action="() => deleteTodo()"
              color="red"
              icon="mdi-delete"
              size="small"
            >
              <template v-slot:content>
                Are you sure you want to delete this todo?
              </template>
            </CustomDialog>
            <v-btn color="secondary" @click="() => (editTodoDialogOpen = false)"
              >Cancel</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import { useStorageStore } from "@/store/storageStore";
import { getLongtermTodos } from "@/store/storage/todos";
import { useSnackbarStore } from "@/store/snackbarStore";

const { smAndDown } = useDisplay();
const { newSnackbarMessage } = useSnackbarStore();

const newTodoText = ref("");
const textFieldRef = ref();

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
    editTodoStatus.value = !todoToEdit.done;
    editTodoTime.value = new Date();
    editTodoDialogOpen.value = true;
  }
};

const deleteTodo = async () => {
  editTodoDialogOpen.value = false;
  const { error } = await supabase
    .from("todo")
    .delete()
    .eq("id", editTodoId.value);
  await getTodoTemplate();
};
const submitEditTodo = async () => {
  editTodoDialogOpen.value = false;
  await supabase
    .from("todo")
    .update({
      name: editTodoText.value,
      updated_at: editTodoTime.value!.toUTCString(),
      done: !editTodoStatus.value,
    })
    .eq("id", editTodoId.value);
  await getTodoTemplate();
};

const ltTodos = ref();

onMounted(() => {
  alignTodos();
});

const { initTodosSingle } = useStorageStore();

const alignTodos = () => {
  ltTodos.value = [];
  ltTodos.value = getLongtermTodos();
};

async function getTodoTemplate() {
  await initTodosSingle();
  alignTodos();
}

async function addNewTodo(parent: string | null) {
  if (newTodoText.value !== "") {
    const todo: InsertDto<"todo"> = {
      category: "longterm",
      name: newTodoText.value,
      user_id: await getUserId(),
      subtodo_of: parent,
    };
    const { error } = await supabase.from("todo").insert(todo);
    if (error === null) {
      newTodoText.value = "";
      await getTodoTemplate();
    }
  } else {
    textFieldRef.value.focus();
    newSnackbarMessage("Define the name of the todo first!", "error");
  }
}

function check(e: Event) {
  e.stopPropagation();
}
</script>
