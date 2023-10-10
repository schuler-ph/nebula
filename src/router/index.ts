// Composables
import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { mainRoutes } from "./mainRoutes";
import { authRoutes } from "./authRoutes";

const routes = [
  ...mainRoutes,
  ...authRoutes,
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/layouts/v1/Default.vue"),
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

router.beforeEach((to, from) => {
  const { auth_valid } = useAuthStore();
  // if (to.name !== "Login" && !auth_valid) next({ name: "Login" });
  // else next();
  console.log(to);
  console.log(from);
});

export default router;
