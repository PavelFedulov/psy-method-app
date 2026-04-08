import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { env } from "../../config/env";

const dbDir = path.dirname(env.coreDbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const coreDb = new Database(env.coreDbPath);
coreDb.pragma("journal_mode = WAL");
