import { coreDb } from "../db/core/core-db";
import { initCoreDb } from "../db/migrations/init-core-db";
import { env } from "../config/env";
import { hashPassword } from "../utils/password";
import { nowIso } from "../utils/now";

async function run() {
  initCoreDb();

  const existing = coreDb
    .prepare(
      `
      SELECT id
      FROM super_admins
      WHERE username = ?
      `,
    )
    .get(env.superAdminUsername);

  if (existing) {
    console.log("Super admin already exists");
    return;
  }

  const passwordHash = await hashPassword(env.superAdminPassword);

  coreDb
    .prepare(
      `
      INSERT INTO super_admins (username, password_hash, created_at)
      VALUES (?, ?, ?)
      `,
    )
    .run(env.superAdminUsername, passwordHash, nowIso());

  console.log("Super admin created");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
