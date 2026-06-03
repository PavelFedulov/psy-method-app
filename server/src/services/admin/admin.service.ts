import { z } from "zod";
import { query, transaction } from "../../db/postgres";
import { nowIso } from "../../utils/now";
import { hashPassword } from "../../utils/password";

const createAdminSchema = z.object({
  username: z
    .string()
    .min(3, "Логин должен содержать минимум 3 символа")
    .max(50, "Логин слишком длинный")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Логин может содержать только латинские буквы, цифры, _ и -",
    ),
  password: z
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .max(100, "Пароль слишком длинный"),
});

type CreateAdminInput = z.infer<typeof createAdminSchema>;

export async function createAdmin(input: CreateAdminInput) {
  const validated = createAdminSchema.parse(input);

  const existingAdmin = await query<{ id: number }>(
      `
      SELECT id
      FROM admins
      WHERE username = $1
      `,
    [validated.username],
  );

  if (existingAdmin.rows[0]) {
    throw new Error("Админ с таким логином уже существует");
  }

  const passwordHash = await hashPassword(validated.password);

  const insertResult = await query<{ id: number }>(
      `
      INSERT INTO admins (username, password_hash, is_active, created_at)
      VALUES ($1, $2, TRUE, $3)
      RETURNING id
      `,
    [validated.username, passwordHash, nowIso()],
  );

  return {
    id: insertResult.rows[0].id,
    username: validated.username,
    isActive: true,
  };
}

export async function getAdminsList() {
  const result = await query<{
    id: number;
    username: string;
    isActive: boolean;
    createdAt: string;
  }>(
      `
      SELECT id, username, is_active AS "isActive", created_at AS "createdAt"
      FROM admins
      ORDER BY id DESC
      `,
  );

  return result.rows;
}

export async function updateAdminStatus(adminId: number, isActive: boolean) {
  const result = await query(
      `
      UPDATE admins
      SET is_active = $1
      WHERE id = $2
      `,
    [isActive, adminId],
  );

  if (result.rowCount === 0) {
    throw new Error("Админ не найден");
  }
}

export async function deleteAdmin(adminId: number) {
  const deleted = await transaction(async (client) => {
    const existing = await client.query<{ id: number }>(
      `
      SELECT id
      FROM admins
      WHERE id = $1
      `,
      [adminId],
    );

    if (!existing.rows[0]) {
      return false;
    }

    await client.query("DELETE FROM admin_sessions WHERE admin_id = $1", [
      adminId,
    ]);
    await client.query("DELETE FROM admins WHERE id = $1", [adminId]);
    return true;
  });

  if (!deleted) {
    throw new Error("Админ не найден");
  }

  return { ok: true };
}
