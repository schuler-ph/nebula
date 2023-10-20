<template>
  <v-sheet rounded="lg" class="pa-5">
    <div class="d-flex align-center mb-3">
      <v-btn @click="openNewTodoDialog"> New Todo </v-btn>
      <v-spacer />
      <v-btn
        variant="tonal"
        @click="
          () => {
            showLtDoneTodos = !showLtDoneTodos;
            alignTodos(props.category);
          }
        "
      >
        {{ showLtDoneTodos ? "Hide" : "Show" }} done todos
      </v-btn>
    </div>
    <v-expansion-panels v-if="ltTodos && ltTodos.length > 0">
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
          {{ capFirst(todo.name) + ` (${todo.subtodos?.length})` }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div
            class="d-flex mt-1"
            :class="smAndDown ? 'flex-column align-center' : 'flex-row'"
          >
            <v-btn
              class="mb-3"
              @click="
                () => {
                  editTodoSubTodoOf = todo.id;
                  openNewTodoDialog();
                }
              "
            >
              New Subtodo
            </v-btn>
            <v-spacer />
            <CustomDialog
              text="not done"
              variant="tonal"
              class="mb-3"
              :class="smAndDown ? '' : 'mr-2'"
              :action="() => allSubTodosNotDone(todo.subtodos)"
            >
              <template v-slot:content>
                Are you sure you want to set all subtodos to not done?
              </template>
            </CustomDialog>
            <CustomDialog
              variant="tonal"
              text="done"
              class="mb-3"
              :action="() => allSubTodosDone(todo.subtodos)"
            >
              <template v-slot:content>
                Are you sure you want to set all subtodos to done?
              </template>
            </CustomDialog>
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
                  editTodoSubTodoOf = todo.id;
                  openEditDialog();
                }
              "
            >
            </v-btn>
            <div>
              {{ capFirst(sub.name) }}
              <div v-if="sub.linked_date" class="text-body-2 text-deep-purple">
                {{ sub.linked_date }}
              </div>
            </div>
          </v-sheet>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div v-else class="d-flex justify-center">
      <div>No todos yet...</div>
    </div>

    <v-dialog
      v-model="editTodoDialogOpen"
      width="500"
      :fullscreen="xs"
      persistent
    >
      <v-card class="overflow-visible">
        <v-card-title class="d-flex flex-row align-center">
          <div>
            {{ editTodoId ? "Edit" : "New" }}
            {{ editTodoSubTodoOf ? "Subtodo" : "Todo" }}
          </div>
          <v-spacer />
          <v-btn
            class="p-0"
            variant="text"
            color="grey"
            @click="() => closeTodoDialog()"
            >Cancel</v-btn
          >
        </v-card-title>
        <v-card-text>
          <v-text-field label="Title" v-model="editTodoText"></v-text-field>
          <v-switch
            v-if="editTodoId"
            label="Done"
            color="primary"
            v-model="editTodoStatus"
          ></v-switch>
          <div>Linked Dates:</div>
          <VueDatePicker
            v-model="editTodoLinkedDates"
            model-type="yyyy-MM-dd HH:mm"
          />
          <v-switch
            label="Include time in linked date"
            color="primary"
            v-model="editTodoIncludeTime"
          ></v-switch>

          <CustomDialog
            v-if="editTodoId"
            :action="() => deleteTodo()"
            color="red"
            text="Delete todo"
            size="small"
          >
            <template v-slot:content>
              Are you sure you want to delete this todo?
            </template>
          </CustomDialog>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="flat"
            color="primary"
            class="px-5"
            @click="
              () => {
                if (editTodoId) submitEditTodo();
                else addNewTodo();
              }
            "
          >
            {{
              editTodoId
                ? "save changes"
                : "add new " + (editTodoSubTodoOf ? "subtodo" : "todo")
            }}</v-btn
          >
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script setup lang="ts">
import { getUserId, supabase } from "@/lib/supabaseClient";
import { InsertDto, Row, UpdateDto } from "@/types/supabaseHelper";
import { ref } from "vue";
import { onMounted } from "vue";
import { capFirst } from "@/helper/stringHelper";
import CustomDialog from "@/components/generic/CustomDialog.vue";
import { useDisplay } from "vuetify";
import { useStorageStore } from "@/store/storageStore";
import { getLongtermTodos, TodoTemplate } from "@/store/storage/todos";
import { useSnackbarStore } from "@/store/snackbarStore";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { watch } from "vue";
import { useSettingsStore } from "@/store/settingsStore";
import { storeToRefs } from "pinia";

const { smAndDown, xs } = useDisplay();
const { newSnackbarMessage } = useSnackbarStore();

const editTodoDialogOpen = ref(false);
const editTodoId = ref<string>("");
const editTodoText = ref("");
const editTodoTime = ref<Date>();
const editTodoStatus = ref(false);
const editTodoLinkedDates = ref<string | null>(null);
const editTodoSubTodoOf = ref<string>("");
const editTodoIncludeTime = ref(false);

const openNewTodoDialog = () => {
  editTodoDialogOpen.value = true;
};

const closeTodoDialog = () => {
  editTodoId.value = "";
  editTodoText.value = "";
  editTodoStatus.value = false;
  editTodoLinkedDates.value = null;
  editTodoSubTodoOf.value = "";
  editTodoDialogOpen.value = false;
  editTodoIncludeTime.value = false;
};

const openEditDialog = () => {
  const { allTodos } = useStorageStore();
  const todoToEdit = allTodos.find((at) => at.id === editTodoId.value);
  if (todoToEdit) {
    if (todoToEdit.linked_date) {
      if (todoToEdit.linked_date!.length === 10)
        editTodoLinkedDates.value = todoToEdit.linked_date + " 12:00";
      else {
        editTodoLinkedDates.value = todoToEdit.linked_date!;
        editTodoIncludeTime.value = true;
      }
    }
    editTodoText.value = todoToEdit.name;
    editTodoStatus.value = todoToEdit.done;
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
  if (!editTodoLinkedDates.value) editTodoLinkedDates.value = null;
  else
    editTodoLinkedDates.value = editTodoIncludeTime.value
      ? editTodoLinkedDates.value
      : editTodoLinkedDates.value?.split(" ")[0];
  const update: UpdateDto<"todo"> = {
    name: editTodoText.value,
    updated_at: editTodoTime.value!.toUTCString(),
    done: editTodoStatus.value,
    linked_date: editTodoLinkedDates.value,
  };
  const { error } = await supabase
    .from("todo")
    .update(update)
    .eq("id", editTodoId.value);
  if (error === null) {
    await getTodoTemplate();
  } else console.log(error);
  closeTodoDialog();
};

const allSubTodosDone = async (subtodos: Row<"todo">[] | undefined) => {
  if (subtodos) {
    subtodos.forEach(async (st) => {
      if (!st.done) {
        await supabase.from("todo").update({ done: true }).eq("id", st.id);
      }
    });
  }
  setTimeout(async () => {
    await initTodosSingle();
  }, 1000);
};

const allSubTodosNotDone = async (subtodos: Row<"todo">[] | undefined) => {
  if (subtodos) {
    subtodos.forEach(async (st) => {
      if (st.done) {
        await supabase.from("todo").update({ done: false }).eq("id", st.id);
      }
    });
  }
  setTimeout(async () => {
    await initTodosSingle();
  }, 1000);
};

const ltTodos = ref<TodoTemplate[]>();
const props = defineProps(["category"]);
const { showLtDoneTodos } = storeToRefs(useSettingsStore());

onMounted(() => {
  alignTodos(props.category);
});

watch(
  () => props.category,
  (newCat) => {
    alignTodos(newCat);
  }
);

const { initTodosSingle } = useStorageStore();

const alignTodos = (cat: string) => {
  ltTodos.value = [];
  ltTodos.value = getLongtermTodos(cat, showLtDoneTodos.value);
};

async function getTodoTemplate() {
  await initTodosSingle();
  alignTodos(props.category);
}

async function addNewTodo() {
  if (!editTodoLinkedDates.value) editTodoLinkedDates.value = null;
  if (editTodoText.value !== "") {
    const todo: InsertDto<"todo"> = {
      category: props.category,
      name: editTodoText.value,
      user_id: await getUserId(),
      subtodo_of: editTodoSubTodoOf.value ? editTodoSubTodoOf.value : null,
      linked_date: editTodoIncludeTime.value
        ? editTodoLinkedDates.value
        : editTodoLinkedDates.value?.split(" ")[0],
    };
    const { error } = await supabase.from("todo").insert(todo);
    if (error === null) {
      await getTodoTemplate();
    }
  } else {
    newSnackbarMessage("Define the name of the todo first!", "error");
  }
  closeTodoDialog();
}

function check(e: Event) {
  e.stopPropagation();
}
</script>
