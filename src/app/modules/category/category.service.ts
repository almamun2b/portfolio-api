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

const createCategory = async (data: Prisma.CategoryCreateInput) => {
  if (!data.name) {
    throw new Error("Name is required");
  }

  const categorySlug = generateSlug(data.name);

  const isCategoryExist = await prisma.category.findFirst({
    where: {
      OR: [
        {
          name: data.name,
        },
        {
          slug: categorySlug,
        },
      ],
    },
  });
  if (isCategoryExist) {
    return {
      error: "Category already exists",
      status: 400,
      success: false,
    };
  }

  const result = await prisma.category.create({
    data: {
      name: data.name,
      slug: categorySlug,
    },
  });
  return result;
};

const getCategories = async () => {
  const result = await prisma.category.findMany();
  return result;
};

const getCategoryById = async (id: string | number) => {
  let result;
  if (typeof id === "string") {
    result = await prisma.category.findUnique({
      where: {
        slug: id,
      },
    });
  } else {
    result = await prisma.category.findUnique({
      where: {
        id,
      },
    });
  }
  return result;
};

const updateCategory = async (id: number, data: Prisma.CategoryUpdateInput) => {
  const isCategoryExist = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (!isCategoryExist) {
    throw new Error("Category not found");
  }
  if (!data.name) {
    throw new Error("Name is required");
  }

  const categorySlug = generateSlug(data.name as string);

  const result = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      slug: categorySlug,
    },
  });
  return result;
};

const deleteCategory = async (id: number) => {
  const result = await prisma.category.delete({
    where: {
      id,
    },
  });
  return result;
};

export const categoryService = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
