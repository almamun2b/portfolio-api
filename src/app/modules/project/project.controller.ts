import { Request, Response } from "express";
import { projectService } from "./project.service";

const createProject = async (req: Request, res: Response) => {
  try {
    const result = await projectService.createProject(req.body);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create project",
      error,
    });
  }
};

const getProjects = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search ?? "") as string;

    // Handle type parameter
    const typeParam = req.query.type as string;
    const type: "Frontend" | "Backend" | "Fullstack" | undefined =
      typeParam && ["Frontend", "Backend", "Fullstack"].includes(typeParam)
        ? (typeParam as "Frontend" | "Backend" | "Fullstack")
        : undefined;

    const sortBy = req.query.sortBy
      ? (req.query.sortBy as string)
      : "createdAt";

    // Ensure sortOrder is properly typed
    const sortOrderParam = req.query.sortOrder as string;
    const sortOrder: "asc" | "desc" = sortOrderParam === "asc" ? "asc" : "desc";

    const result = await projectService.getProjects({
      page,
      limit,
      search,
      type,
      sortBy,
      sortOrder,
    });
    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve projects",
      error,
    });
  }
};

const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const slug = !isNaN(Number(id)) ? Number(id) : id;
    const result = await projectService.getProjectById(slug);
    res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve project",
      error,
    });
  }
};

const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await projectService.updateProject(Number(id), req.body);
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update project",
      error,
    });
  }
};

const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await projectService.deleteProject(Number(id));
    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete project",
      error,
    });
  }
};

export const projectController = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
