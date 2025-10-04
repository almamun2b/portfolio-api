import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
const createProject = async (data: Prisma.ProjectCreateInput) => {
  if (!data.title) {
    throw new Error("Title is required");
  }
  let slug = generateSlug(data.title);

  const isExisting = await prisma.project.findUnique({
    where: {
      slug,
    },
  });
  if (isExisting) {
    slug = `${slug}-${Date.now()}`;
  }
  const result = await prisma.project.create({
    data: {
      ...data,
      slug,
    },
  });
  return result;
};

const getProjects = async ({
  page = 1,
  limit = 10,
  search,
  type,
  sortBy = "createdAt",
  sortOrder = "desc",
}: {
  page?: number;
  limit?: number;
  search?: string;
  type?: "Frontend" | "Backend" | "Fullstack";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const skip = (page - 1) * limit;

  // Build the where clause with proper filtering
  const whereConditions: any[] = [];

  // Search functionality - search in title, description, content, and technologies
  if (search && search.trim()) {
    const searchTerm = search.trim();

    // Create search conditions for string fields
    const searchConditions: any[] = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
      { content: { contains: searchTerm, mode: "insensitive" } },
      { technologies: { hasSome: [searchTerm] } }, // Search in technologies array
    ];

    // For enum field (type), check if search term matches any enum values
    const projectTypes = ["Frontend", "Backend", "Fullstack"];
    const matchingTypes = projectTypes.filter((projectType) =>
      projectType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingTypes.length > 0) {
      searchConditions.push({ type: { in: matchingTypes } });
    }

    whereConditions.push({
      OR: searchConditions,
    });
  }

  // Type filter
  if (type) {
    whereConditions.push({
      type: type,
    });
  }

  const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

  // Validate sortBy field to prevent injection
  const validSortFields = ["createdAt", "updatedAt", "title", "type"];
  const safeSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
  const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";

  const total = await prisma.project.count({ where });

  const projects = await prisma.project.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [safeSortBy]: safeSortOrder,
    },
  });

  return {
    projects,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProjectById = async (id: number | string) => {
  const result = await prisma.project.findUnique({
    where: {
      ...(typeof id === "number" ? { id } : { slug: id }),
    },
  });
  if (!result) {
    throw new Error("Project not found");
  }
  return result;
};

const updateProject = async (id: number, data: Prisma.ProjectUpdateInput) => {
  if (!data.title) {
    throw new Error("Title is required");
  }
  let slug = generateSlug(data.title as string);

  const isExisting = await prisma.project.findUnique({
    where: {
      slug,
    },
  });
  if (isExisting) {
    slug = `${slug}-${Date.now()}`;
  }
  data.slug = slug;

  const result = await prisma.project.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteProject = async (id: number) => {
  const result = await prisma.project.delete({
    where: {
      id,
    },
  });
  return result;
};

export const projectService = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
