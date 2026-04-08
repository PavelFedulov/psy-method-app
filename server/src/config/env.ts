import dotenv from "dotenv";
import path from "path";

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
  jwtSecret: getEnv("JWT_SECRET"),
  coreDbPath: path.resolve(
    process.cwd(),
    getEnv("CORE_DB_PATH", "./data/core.sqlite"),
  ),
  adminDbDir: path.resolve(
    process.cwd(),
    getEnv("ADMIN_DB_DIR", "./data/admin-dbs"),
  ),
};
