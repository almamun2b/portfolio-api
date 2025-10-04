import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { postRoutes } from "../modules/post/post.route";
import { userRoutes } from "../modules/user/user.route";
import { categoryRoutes } from "../modules/category/category.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/category",
    route: categoryRoutes,
  },
  {
    path: "/blog",
    route: postRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export { router };
