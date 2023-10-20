// Composables
import { createRouter, createWebHashHistory } from "vue-router";
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
        path: "todoLt/:category",
        name: "TodoLongterm",
        component: () => import("@/views/diary/todo/TodoLongterm.vue"),
        props: (route: any) => ({
          category: route.params.category,
        }),
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
      // {
      //   path: "/auth/signup",
      //   name: "Signup",
      //   component: () => import("@/views/auth/Signup.vue"),
      // },
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
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const { auth_valid } = useAuthStore();
  const allowedRoutes = ["Login", "Signup"];

  if (!auth_valid && !allowedRoutes.includes(to.name as string)) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
