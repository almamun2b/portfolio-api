import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.createPost(req.body);
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getPosts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search ?? "") as string;
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
      : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const sortBy = req.query.sortBy
      ? (req.query.sortBy as string)
      : "createdAt";
    const sortOrder = req.query.sortOrder
      ? (req.query.sortOrder as string)
      : "desc";

    const result = await postService.getPosts({
      page,
      limit,
      search,
      isFeatured,
      tags,
      sortBy,
      sortOrder,
    });
    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getBlogStats = async (req: Request, res: Response) => {
  try {
    const result = await postService.getBlogStats();
    res.status(200).json({
      success: true,
      message: "Blog stats retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve blog stats",
      error,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await postService.getPostById(Number(id));
    res.status(200).json({
      success: true,
      message: "Blog retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await postService.updatePost(Number(id), req.body);
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await postService.deletePost(Number(id));
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const postController = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getBlogStats,
};
