import { initCoreDb } from "../db/migrations/init-core-db";
import { query } from "../db/postgres";
import { env } from "../config/env";
import { hashPassword } from "../utils/password";
import { nowIso } from "../utils/now";

async function run() {
  await initCoreDb();

  const existing = await query<{ id: number }>(
      `
      SELECT id
      FROM super_admins
      WHERE username = $1
      `,
    [env.superAdminUsername],
  );

  if (existing.rows[0]) {
    console.log("Super admin already exists");
    return;
  }

  const passwordHash = await hashPassword(env.superAdminPassword);

  await query(
      `
      INSERT INTO super_admins (username, password_hash, created_at)
      VALUES ($1, $2, $3)
      `,
    [env.superAdminUsername, passwordHash, nowIso()],
  );

  console.log("Super admin created");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
