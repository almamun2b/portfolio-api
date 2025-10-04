import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";

const loginWithCredential = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password as string
  );

  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  // exclude password from the returned user object
  const { password: _password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

const authWithGoogle = async (data: Prisma.UserCreateInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    const result = await prisma.user.create({
      data,
    });
    return result;
  }

  return user;
};

export const authService = {
  loginWithCredential,
  authWithGoogle,
};
