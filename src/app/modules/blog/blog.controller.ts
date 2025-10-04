import { Request, Response } from "express";
import { postService } from "./blog.service";

const createBlog = async (req: Request, res: Response) => {
  try {
    const result = await postService.createBlog(req.body);
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create blog",
      error,
    });
  }
};

const getBlogs = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search ?? "") as string;
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
      : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    // Handle category parameter - can be category ID (number) or category slug (string)
    let category: string | number | undefined;
    if (req.query.category) {
      const categoryParam = req.query.category as string;
      // Check if it's a number (category ID) or string (category slug)
      const categoryId = Number(categoryParam);
      category = isNaN(categoryId) ? categoryParam : categoryId;
    }

    const sortBy = req.query.sortBy
      ? (req.query.sortBy as string)
      : "createdAt";

    // Ensure sortOrder is properly typed
    const sortOrderParam = req.query.sortOrder as string;
    const sortOrder: "asc" | "desc" = sortOrderParam === "asc" ? "asc" : "desc";

    const result = await postService.getBlogs({
      page,
      limit,
      search,
      isFeatured,
      tags,
      category,
      sortBy,
      sortOrder,
    });
    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve posts",
      error,
    });
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve blog stats",
      error,
    });
  }
};

const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const slug = !isNaN(Number(id)) ? Number(id) : id;
    const result = await postService.getBlogById(slug);
    res.status(200).json({
      success: true,
      message: "Blog retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve blog",
      error,
    });
  }
};

const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await postService.updateBlog(Number(id), req.body);
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update blog",
      error,
    });
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await postService.deleteBlog(Number(id));
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete blog",
      error,
    });
  }
};

const getPopularBlogs = async (req: Request, res: Response) => {
  try {
    const result = await postService.getPopularBlogs();
    res.status(200).json({
      success: true,
      message: "Popular blogs retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve popular blogs",
      error,
    });
  }
};

const getFeaturedBlogs = async (req: Request, res: Response) => {
  try {
    const result = await postService.getFeaturedBlogs();
    res.status(200).json({
      success: true,
      message: "Featured blogs retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve featured blogs",
      error,
    });
  }
};

export const blogController = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogStats,
  getPopularBlogs,
  getFeaturedBlogs,
};
