import dotenv from "dotenv";
dotenv.config();

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing env variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(getEnv("PORT", "3001")),
  clientUrl: getEnv("CLIENT_URL", "http://localhost:5173"),
  cookieSecret: getEnv("COOKIE_SECRET"),
  databaseUrl: getEnv("DATABASE_URL"),
  superAdminUsername: getEnv("SUPER_ADMIN_USERNAME"),
  superAdminPassword: getEnv("SUPER_ADMIN_PASSWORD"),
  isProduction: process.env.NODE_ENV === "production",
};
