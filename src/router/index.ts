// Composables
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/authStore";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/training/Plan.vue"),
      },
      {
        path: "allEntries",
        name: "AllEntries",
        component: () => import("@/views/AllEntries.vue"),
      },
      {
        path: "edit/:day",
        name: "EditEntry",
        component: () => import("@/views/diary/EditEntry.vue"),
      },
      {
        path: "weekclosure",
        name: "WeekClosure",
        component: () => import("@/views/diary/WeekClosure.vue"),
      },
      {
        path: "training/split",
        name: "Split",
        component: () => import("@/views/training/Split.vue"),
      },
      {
        path: "training/exercises",
        name: "Exercises",
        component: () => import("@/views/training/Exercises.vue"),
      },
      {
        path: "training",
        name: "Training",
        component: () => import("@/views/training/Training.vue"),
      },
      {
        path: "todo/daily",
        name: "TodoDaily",
        component: () => import("@/views/diary/todo/TodoDaily.vue"),
      },
      {
        path: "todo/longterm",
        name: "TodoLongterm",
        component: () => import("@/views/diary/todo/TodoLongterm.vue"),
      },
      {
        path: "about",
        name: "About",
        component: () => import("@/views/About.vue"),
      },
      {
        path: "history",
        name: "History",
        component: () => import("@/views/history/WeightHistory.vue"),
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("@/layouts/auth/Default.vue"),
    children: [
      {
        path: "",
        name: "Login",
        component: () => import("@/views/auth/Login.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/layouts/auth/Default.vue"),
    children: [
      {
        path: "",
        name: "NotFound",
        component: () => import("@/views/NotFound.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  const { auth_valid } = useAuthStore();

  if (!auth_valid && to.name !== "Login") {
    return { name: "Login" };
  }
});

export default router;
