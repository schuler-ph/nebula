export const authRoutes = [
  {
    path: "/auth",
    component: () => import("@/layouts/v1/Default.vue"),
    children: [
      {
        path: "",
        name: "Login",
        component: () => import("@/views/auth/Login.vue"),
      },
    ],
  },
];
