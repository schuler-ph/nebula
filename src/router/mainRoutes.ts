export const mainRoutes = [
  {
    path: "/",
    component: () => import("@/layouts/v1/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Home.vue"),
      },
    ],
  },
];
