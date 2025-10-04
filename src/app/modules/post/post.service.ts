import { Blog, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const createPost = async (data: Prisma.BlogCreateInput): Promise<Blog> => {
  const result = await prisma.blog.create({
    data,
    include: {
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

const getPosts = async ({
  page = 1,
  limit = 10,
  search,
  isFeatured,
  tags,
  sortBy = "createdAt",
  sortOrder = "desc",
}: {
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
  tags?: string[];
  sortBy?: string;
  sortOrder?: string;
}) => {
  const skip = (page - 1) * limit;
  const where: any = {
    AND: [
      search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      typeof isFeatured === "boolean" && {
        isFeatured,
      },
      tags &&
        tags.length > 0 && {
          tags: {
            hasEvery: tags,
          },
        },
    ].filter(Boolean),
  };
  const result = await prisma.blog.findMany({
    skip: skip,
    take: limit,
    where: where,
    include: {
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
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.blog.count({ where });
  const totalPage = Math.ceil(total / limit);
  return {
    posts: result,
    meta: {
      page,
      limit,
      total,
      totalPage,
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

const getPostById = async (id: number) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.blog.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const post = await tx.blog.findUnique({
      where: {
        id,
      },
      include: {
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

const updatePost = async (id: number, data: Prisma.BlogUpdateInput) => {
  const result = await prisma.blog.update({
    where: {
      id,
    },
    data,
    include: {
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

const deletePost = async (id: number) => {
  const result = await prisma.blog.delete({
    where: {
      id,
    },
  });
  return result;
};

export const postService = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getBlogStats,
};
