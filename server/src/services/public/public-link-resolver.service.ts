import { coreDb } from "../../db/core/core-db";
import { getAdminDbByFileName } from "../../db/factories/admin-db-factory";

type LinkIndexRow = {
  admin_id: number;
  db_file_name: string;
};

export function resolveAdminDbByParticipantToken(token: string) {
  const row = coreDb
    .prepare(
      `
      SELECT admin_id, db_file_name
      FROM participant_link_index
      WHERE token = ?
      `,
    )
    .get(token) as LinkIndexRow | undefined;

  if (!row) {
    return null;
  }

  return {
    adminId: row.admin_id,
    dbFileName: row.db_file_name,
    db: getAdminDbByFileName(row.db_file_name),
  };
}
