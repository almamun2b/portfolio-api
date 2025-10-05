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

const createBlog = async (data: Prisma.BlogCreateInput) => {
  if (!data.title) {
    throw new Error("Title is required");
  }
  let slug = generateSlug(data.title);

  const isExisting = await prisma.blog.findUnique({
    where: {
      slug,
    },
  });
  if (isExisting) {
    slug = `${slug}-${Date.now()}`;
  }

  const result = await prisma.$transaction(async (tx) => {
    if (data.isFeatured) {
      await tx.blog.updateMany({
        where: {
          isFeatured: true,
        },
        data: {
          isFeatured: false,
        },
      });
    }
    const newPost = await tx.blog.create({
      data: {
        ...data,
        slug,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });
    return newPost;
  });
  return result;
};

const getBlogs = async ({
  page = 1,
  limit = 10,
  search,
  isFeatured,
  tags,
  category,
  sortBy = "createdAt",
  sortOrder = "desc",
}: {
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
  tags?: string[];
  category?: string | number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const skip = (page - 1) * limit;

  // Build the where clause with proper filtering
  const whereConditions: any[] = [];

  // Search functionality - search in title, description, and content
  if (search && search.trim()) {
    whereConditions.push({
      OR: [
        {
          title: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Featured filter
  if (typeof isFeatured === "boolean") {
    whereConditions.push({
      isFeatured,
    });
  }

  // Tags filter - match ANY of the provided tags (not ALL)
  if (tags && tags.length > 0) {
    whereConditions.push({
      tags: {
        hasSome: tags,
      },
    });
  }

  // Category filter - support both category ID and category slug
  if (category) {
    if (typeof category === "number") {
      whereConditions.push({
        categoryId: category,
      });
    } else if (typeof category === "string") {
      whereConditions.push({
        category: {
          OR: [{ slug: category }, { name: category }],
        },
      });
    }
  }

  const where: any = whereConditions.length > 0 ? { AND: whereConditions } : {};

  // Validate sortBy field to prevent injection
  const validSortFields = [
    "createdAt",
    "updatedAt",
    "title",
    "views",
    "isFeatured",
  ];
  const safeSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
  const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";

  const result = await prisma.blog.findMany({
    skip: skip,
    take: limit,
    where: where,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      image: true,
      views: true,
      tags: true,
      isFeatured: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          picture: true,
        },
      },
    },
    orderBy: {
      [safeSortBy]: safeSortOrder,
    },
  });

  const total = await prisma.blog.count({ where });
  const totalPages = Math.ceil(total / limit);

  return {
    posts: result,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

const getBlogStats = async () => {
  const result = await prisma.$transaction(async (tx) => {
    const aggregatesRes = await tx.blog.aggregate({
      _count: true,
      _sum: {
        views: true,
      },
      _avg: {
        views: true,
      },
      _max: {
        views: true,
      },
      _min: {
        views: true,
      },
    });
    const featuredPostCount = await tx.blog.count({
      where: {
        isFeatured: true,
      },
    });
    const topFeaturedPost = await tx.blog.findFirst({
      where: {
        isFeatured: true,
      },
      orderBy: {
        views: "desc",
      },
    });
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastPostsCount = await tx.blog.count({
      where: {
        createdAt: {
          gte: lastWeek,
        },
      },
    });

    return {
      stats: {
        totalPosts: aggregatesRes._count,
        totalViews: aggregatesRes._sum.views,
        averageViews: aggregatesRes._avg.views,
        maxViews: aggregatesRes._max.views,
        minViews: aggregatesRes._min.views,
      },
      featured: {
        count: featuredPostCount,
        topPost: topFeaturedPost,
      },
      lastWeekPost: {
        count: lastPostsCount,
      },
    };
  });
  return result;
};

const getBlogById = async (id: number | string) => {
  const result = await prisma.$transaction(async (tx) => {
    if (typeof id === "string") {
      await tx.blog.update({
        where: {
          slug: id,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    }
    const whereCondition = typeof id === "number" ? { id } : { slug: id };
    const post = await tx.blog.findUnique({
      where: whereCondition,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            picture: true,
          },
        },
      },
    });
    return post;
  });
  return result;
};

const updateBlog = async (id: number, data: Prisma.BlogUpdateInput) => {
  if (!data.title) {
    throw new Error("Title is required");
  }
  let slug = generateSlug(data.title as string);

  const isExisting = await prisma.blog.findUnique({
    where: {
      slug,
    },
  });
  if (isExisting) {
    slug = `${slug}-${Date.now()}`;
  }
  data.slug = slug;

  const result = await prisma.blog.update({
    where: {
      id,
    },
    data,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          picture: true,
        },
      },
    },
  });
  return result;
};

const deleteBlog = async (id: number) => {
  const result = await prisma.blog.delete({
    where: {
      id,
    },
  });
  return result;
};

const getPopularBlogs = async () => {
  const result = await prisma.blog.findMany({
    take: 4,
    orderBy: {
      views: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      image: true,
      views: true,
      tags: true,
      isFeatured: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          picture: true,
        },
      },
    },
  });
  return result;
};

const getFeaturedBlogs = async () => {
  const result = await prisma.blog.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      image: true,
      views: true,
      tags: true,
      isFeatured: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          picture: true,
        },
      },
    },
  });
  return result;
};

const getTags = async () => {
  // Get all blogs with their tags
  const blogs = await prisma.blog.findMany({
    select: {
      tags: true,
    },
  });

  const allTags = blogs.flatMap((blog) => blog.tags);

  const uniqueTags = [...new Set(allTags)].sort();

  return uniqueTags;
};

export const postService = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogStats,
  getPopularBlogs,
  getFeaturedBlogs,
  getTags,
};
