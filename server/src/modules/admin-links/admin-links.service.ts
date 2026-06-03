import { query } from "../../db/postgres";
import { LINK_STATUS } from "../../constants/app.constants";
import { nowIso } from "../../utils/now";
import { generateParticipantToken } from "../../utils/token";

type ParticipantLinkRow = {
  id: number;
  token: string;
  status: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  revoked_at: string | null;
};

type CreateParticipantLinkParams = {
  adminId: number;
};

export async function createParticipantLink(params: CreateParticipantLinkParams) {
  const token = generateParticipantToken();
  const createdAt = nowIso();

  const result = await query<{ id: number }>(
    `
    INSERT INTO participant_links (
      admin_id,
      token,
      status,
      created_at,
      started_at,
      completed_at,
      revoked_at
    )
    VALUES ($1, $2, $3, $4, NULL, NULL, NULL)
    RETURNING id
    `,
    [params.adminId, token, LINK_STATUS.NEW, createdAt],
  );

  return {
    id: result.rows[0].id,
    token,
    status: LINK_STATUS.NEW,
    createdAt,
    startedAt: null,
    completedAt: null,
    revokedAt: null,
  };
}

export async function getParticipantLinks(adminId: number) {
  const result = await query<ParticipantLinkRow>(
      `
      SELECT
        id,
        token,
        status,
        created_at,
        started_at,
        completed_at,
        revoked_at
      FROM participant_links
      WHERE admin_id = $1
      ORDER BY id DESC
      `,
    [adminId],
  );

  return result.rows.map((row) => ({
    id: row.id,
    token: row.token,
    status: row.status,
    createdAt: row.created_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    revokedAt: row.revoked_at,
  }));
}

export async function revokeParticipantLink(adminId: number, linkId: number) {
  const result = await query<{
    id: number;
    status: string;
    revoked_at: string | null;
  }>(
      `
      SELECT id, status, revoked_at
      FROM participant_links
      WHERE id = $1 AND admin_id = $2
      `,
    [linkId, adminId],
  );

  const link = result.rows[0];

  if (!link) {
    throw new Error("Ссылка не найдена");
  }

  if (link.status === LINK_STATUS.COMPLETED) {
    throw new Error("Нельзя отозвать уже завершенную ссылку");
  }

  if (link.status === LINK_STATUS.REVOKED) {
    throw new Error("Ссылка уже отозвана");
  }

  await query(
    `
    UPDATE participant_links
    SET status = $1, revoked_at = $2
    WHERE id = $3 AND admin_id = $4
    `,
    [LINK_STATUS.REVOKED, nowIso(), linkId, adminId],
  );

  return { ok: true };
}

export function deleteUnusedParticipantLink(
  adminId: number,
  linkId: number,
) {
  return deleteUnusedParticipantLinkAsync(adminId, linkId);
}

async function deleteUnusedParticipantLinkAsync(adminId: number, linkId: number) {
  const result = await query<{
    id: number;
    token: string;
    status: string;
    started_at: string | null;
    completed_at: string | null;
  }>(
      `
      SELECT id, token, status, started_at, completed_at
      FROM participant_links
      WHERE id = $1 AND admin_id = $2
      `,
    [linkId, adminId],
  );

  const link = result.rows[0];

  if (!link) {
    throw new Error("Ссылка не найдена");
  }

  const hasSession = await query<{ id: number }>(
      `
      SELECT id
      FROM participant_sessions
      WHERE link_id = $1 AND admin_id = $2
      LIMIT 1
      `,
    [linkId, adminId],
  );

  if (hasSession.rows[0] || link.started_at || link.completed_at) {
    throw new Error("Можно удалить только неиспользованную ссылку");
  }

  await query(
    `
    DELETE FROM participant_links
    WHERE id = $1 AND admin_id = $2
    `,
    [linkId, adminId],
  );

  return { ok: true };
}
