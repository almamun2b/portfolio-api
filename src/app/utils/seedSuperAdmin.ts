import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { env } from "../config/env";

const seedSuperAdmin = async () => {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: env.SUPER_ADMIN_EMAIL },
  });
  if (existingAdmin) {
    console.log("Super Admin already exists");
    return;
  }
  const hashedPassword = await bcrypt.hash(
    env.SUPER_ADMIN_PASSWORD,
    Number(env.BCRYPT_SALT_ROUNDS)
  );

  try {
    const result = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: env.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        phone: "01700000000",
        isVerified: true,
      },
    });
    if (result) {
      console.log("✅ Super Admin seeded successfully");
    }
  } catch (error) {
    console.error("❌ Error seeding super admin:", error);
  }
};

export { seedSuperAdmin };
