import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { postRoutes } from "../modules/post/post.route";
import { userRoutes } from "../modules/user/user.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/post",
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
