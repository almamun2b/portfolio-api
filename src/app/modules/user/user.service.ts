import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";
import { env } from "../../config/env";

const createUser = async (data: Prisma.UserCreateInput) => {
  if (!data.email || !data.password) {
    return {
      error: "Email and password are required",
      status: 400,
      success: false,
    };
  }
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (isUserExist) {
    return {
      error: "User already exists",
      status: 400,
      success: false,
    };
  }
  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(env.BCRYPT_SALT_ROUNDS)
  );
  const result = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      picture: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const getUsers = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      picture: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      blogs: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    // include: {
    //   blogs: true,
    // },
  });
  return result;
};

const getUserById = async (id: number) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      picture: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const updateUser = async (id: number, data: Prisma.UserUpdateInput) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      picture: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const deleteUser = async (id: number) => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });
  return result;
};

export const userService = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
