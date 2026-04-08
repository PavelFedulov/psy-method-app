import Database from "better-sqlite3";

export function createAdminDb(dbPath: string) {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  return db;
}
