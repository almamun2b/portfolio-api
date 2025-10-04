import express from "express";

const router = express.Router();

import { blogController } from "./blog.controller";

router.post("/", blogController.createBlog);
router.get("/", blogController.getBlogs);
router.get("/stats", blogController.getBlogStats);
router.get("/popular", blogController.getPopularBlogs);
router.get("/featured", blogController.getFeaturedBlogs);
router.get("/:id", blogController.getBlogById);
router.patch("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

export const blogRoutes = router;
