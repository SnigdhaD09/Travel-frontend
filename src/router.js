import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/homepage",
      name: "homepage",
      component: () => import("./views/HomePage.vue"),
    },
    {
      path: "/trip/:id",
      name: "editTrip",
      props: true,
      component: () => import("./views/EditTrip.vue"),
    },
    {
      path: "/ingredients",
      name: "ingredients",
      component: () => import("./views/IngredientList.vue"),
    },
  ],
});

export default router;
