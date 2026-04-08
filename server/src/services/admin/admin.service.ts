import { z } from "zod";
import { coreDb } from "../../db/core/core-db";
import { getAdminDbByFileName } from "../../db/factories/admin-db-factory";
import { initAdminDb } from "../../db/migrations/init-admin-db";
import { nowIso } from "../../utils/now";
import { hashPassword } from "../../utils/password";

const createAdminSchema = z.object({
  username: z
    .string()
    .min(3, "Логин должен содержать минимум 3 символа")
    .max(50, "Логин слишком длинный"),
  password: z
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .max(100, "Пароль слишком длинный"),
});

type CreateAdminInput = z.infer<typeof createAdminSchema>;

export async function createAdmin(input: CreateAdminInput) {
  const validated = createAdminSchema.parse(input);

  const existingAdmin = coreDb
    .prepare(
      `
      SELECT id
      FROM admins
      WHERE username = ?
      `,
    )
    .get(validated.username);

  if (existingAdmin) {
    throw new Error("Админ с таким логином уже существует");
  }

  const passwordHash = await hashPassword(validated.password);

  const insertResult = coreDb
    .prepare(
      `
      INSERT INTO admins (username, password_hash, is_active, db_file_name, created_at)
      VALUES (?, ?, 1, ?, ?)
      `,
    )
    .run(
      validated.username,
      passwordHash,
      `admin_${validated.username}.sqlite`,
      nowIso(),
    );

  const adminId = Number(insertResult.lastInsertRowid);
  const dbFileName = `admin_${validated.username}.sqlite`;

  const adminDb = getAdminDbByFileName(dbFileName);
  initAdminDb(adminDb);
  adminDb.close();

  return {
    id: adminId,
    username: validated.username,
    dbFileName,
    isActive: true,
  };
}

export function getAdminsList() {
  return coreDb
    .prepare(
      `
      SELECT id, username, is_active AS isActive, db_file_name AS dbFileName, created_at AS createdAt
      FROM admins
      ORDER BY id DESC
      `,
    )
    .all();
}

export function updateAdminStatus(adminId: number, isActive: boolean) {
  const result = coreDb
    .prepare(
      `
      UPDATE admins
      SET is_active = ?
      WHERE id = ?
      `,
    )
    .run(isActive ? 1 : 0, adminId);

  if (result.changes === 0) {
    throw new Error("Админ не найден");
  }
}

export function deleteAdmin(adminId: number) {
  const row = coreDb
    .prepare(
      `
      SELECT db_file_name AS dbFileName
      FROM admins
      WHERE id = ?
      `,
    )
    .get(adminId) as { dbFileName: string } | undefined;

  if (!row) {
    throw new Error("Админ не найден");
  }

  coreDb.prepare("DELETE FROM admin_sessions WHERE admin_id = ?").run(adminId);
  coreDb.prepare("DELETE FROM admins WHERE id = ?").run(adminId);

  return {
    dbFileName: row.dbFileName,
  };
}
