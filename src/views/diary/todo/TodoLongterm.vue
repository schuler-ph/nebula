<template>
  <v-sheet rounded="lg" class="pa-5">
    <v-label>New Todo Name</v-label>
    <v-text-field v-model="newSubText" variant="solo"></v-text-field>
    <v-expansion-panels>
      <v-expansion-panel v-for="todo in template">
        <v-expansion-panel-title class="text-h5">
          <v-btn
            :color="todo.done ? 'secondary' : 'primary'"
            class="mr-5 text-h6"
            icon="mdi-pencil"
            size="small"
            @click="
              () => {
                editTodoId = todo.id;
                editTodo();
              }
            "
            @click.native="check($event)"
          >
          </v-btn>
          {{ capFirst(todo.name) }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
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
                  editTodo();
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
          <v-divider class="my-5" :thickness="2"></v-divider>
          <v-btn @click="addNewTodo(todo.id)"> New Subtodo </v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-btn @click="addNewTodo()" class="mt-5"> New Todo </v-btn>

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
const { smAndDown } = useDisplay();

const template = ref<TodoTemplate[]>([]);
type TodoTemplate = Row<"todo"> & { subtodos?: Row<"todo">[] };
const newSubText = ref("");

const editTodoDialogOpen = ref(false);
const editTodoId = ref<string>();
const editTodoText = ref("");
const editTodoTime = ref<Date>();
const editTodoStatus = ref(false);
const editTodo = () => {
  template.value.forEach((t) => {
    if (t.id === editTodoId.value) {
      editTodoText.value = t.name;
      editTodoStatus.value = !t.done;
      editTodoTime.value = new Date();
    } else {
      t.subtodos?.forEach((s) => {
        if (s.id === editTodoId.value) {
          editTodoText.value = s.name;
          editTodoStatus.value = !s.done;
          editTodoTime.value = new Date();
        }
      });
    }
  });

  editTodoDialogOpen.value = true;
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
    .order("updated_at", { ascending: false });
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

function check(e: Event) {
  e.stopPropagation();
}
</script>
