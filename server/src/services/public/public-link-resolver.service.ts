import { query } from "../../db/postgres";

type LinkIndexRow = {
  admin_id: number;
};

export async function resolveAdminByParticipantToken(token: string) {
  const result = await query<LinkIndexRow>(
      `
      SELECT admin_id
      FROM participant_links
      WHERE token = $1
      `,
    [token],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    adminId: row.admin_id,
  };
}
