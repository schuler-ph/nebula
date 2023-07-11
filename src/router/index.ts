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
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
      },
      {
        path: "new",
        name: "NewEntry",
        component: () => import("@/views/diary/NewEntry.vue"),
      },
      {
        path: "edit/:day",
        name: "EditEntry",
        component: () => import("@/views/diary/EditEntry.vue"),
      },
      {
        path: "training",
        name: "Plan",
        component: () => import("@/views/training/Plan.vue"),
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
        path: "todo",
        name: "Todos",
        component: () => import("@/views/diary/todo/Main.vue"),
      },
      {
        path: "todo/daily",
        name: "TodoDailyTemplate",
        component: () => import("@/views/diary/todo/TodoDailyTemplate.vue"),
      },
      {
        path: "about",
        name: "About",
        component: () => import("@/views/About.vue"),
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
