import express from "express";

const router = express.Router();

import { projectController } from "./project.controller";

router.post("/", projectController.createProject);
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProjectById);
router.patch("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

export const projectRoutes = router;
