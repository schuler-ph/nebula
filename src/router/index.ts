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
