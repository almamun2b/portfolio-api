import express from "express";

const router = express.Router();

import { postController } from "./post.controller";

router.post("/", postController.createPost);
router.get("/", postController.getPosts);
router.get("/stats", postController.getBlogStats);
router.get("/:id", postController.getPostById);
router.patch("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

export const postRoutes = router;
