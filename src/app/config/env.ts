import dotenv from "dotenv";

interface Env {
  NODE_ENV: "development" | "production";
  PORT: string;
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRATION: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION: string;
  BCRYPT_SALT_ROUNDS: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
}

dotenv.config();

const getEnvVar = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Environment variable ${name} is required but was not provided`
    );
  }
  return value;
};

const env: Env = {
  NODE_ENV: getEnvVar("NODE_ENV") as "development" | "production",
  PORT: getEnvVar("PORT"),
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  JWT_ACCESS_SECRET: getEnvVar("JWT_ACCESS_SECRET"),
  JWT_ACCESS_EXPIRATION: getEnvVar("JWT_ACCESS_EXPIRATION"),
  JWT_REFRESH_SECRET: getEnvVar("JWT_REFRESH_SECRET"),
  JWT_REFRESH_EXPIRATION: getEnvVar("JWT_REFRESH_EXPIRATION"),
  BCRYPT_SALT_ROUNDS: getEnvVar("BCRYPT_SALT_ROUNDS"),
  SUPER_ADMIN_EMAIL: getEnvVar("SUPER_ADMIN_EMAIL"),
  SUPER_ADMIN_PASSWORD: getEnvVar("SUPER_ADMIN_PASSWORD"),
};

export { env };
