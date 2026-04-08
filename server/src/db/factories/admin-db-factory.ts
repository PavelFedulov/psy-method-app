import fs from "fs";
import path from "path";
import { env } from "../../config/env";
import { createAdminDb } from "../admin/admin-db";

export function getAdminDbByFileName(dbFileName: string) {
  if (!fs.existsSync(env.adminDbDir)) {
    fs.mkdirSync(env.adminDbDir, { recursive: true });
  }

  const dbPath = path.join(env.adminDbDir, dbFileName);
  return createAdminDb(dbPath);
}
