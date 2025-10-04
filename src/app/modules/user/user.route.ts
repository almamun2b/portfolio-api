import express from "express";

const router = express.Router();

import { userController } from "./user.controller";

router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const userRoutes = router;
