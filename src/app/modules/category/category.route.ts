import express from "express";

const router = express.Router();

import { categoryController } from "./category.controller";

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export const categoryRoutes = router;
