import { env } from "../../config/env";
import { query } from "../../db/postgres";
import { nowIso } from "../../utils/now";
import { hashPassword } from "../../utils/password";

export async function ensureSuperAdmin() {
  const existing = await query<{ id: number }>(
    `
    SELECT id
    FROM super_admins
    WHERE username = $1
    `,
    [env.superAdminUsername],
  );

  if (existing.rows[0]) {
    return false;
  }

  const passwordHash = await hashPassword(env.superAdminPassword);

  await query(
    `
    INSERT INTO super_admins (username, password_hash, created_at)
    VALUES ($1, $2, $3)
    `,
    [env.superAdminUsername, passwordHash, nowIso()],
  );

  return true;
}
