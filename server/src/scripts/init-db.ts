import fs from "fs";
import { env } from "../config/env";
import { initCoreDb } from "../db/migrations/init-core-db";

if (!fs.existsSync(env.adminDbDir)) {
  fs.mkdirSync(env.adminDbDir, { recursive: true });
}

initCoreDb();

console.log("Core DB initialized");
