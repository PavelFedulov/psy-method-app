import type Database from "better-sqlite3";
import { coreDb } from "../../db/core/core-db";
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
  db: Database.Database;
  adminId: number;
  dbFileName: string;
};

export function createParticipantLink(params: CreateParticipantLinkParams) {
  const { db, adminId, dbFileName } = params;

  const token = generateParticipantToken();
  const createdAt = nowIso();

  const transaction = db.transaction(() => {
    const result = db
      .prepare(
        `
        INSERT INTO participant_links (
          token,
          status,
          created_at,
          started_at,
          completed_at,
          revoked_at
        )
        VALUES (?, ?, ?, NULL, NULL, NULL)
        `,
      )
      .run(token, LINK_STATUS.NEW, createdAt);

    coreDb
      .prepare(
        `
        INSERT INTO participant_link_index (
          admin_id,
          db_file_name,
          token,
          created_at
        )
        VALUES (?, ?, ?, ?)
        `,
      )
      .run(adminId, dbFileName, token, createdAt);

    return {
      id: Number(result.lastInsertRowid),
      token,
      status: LINK_STATUS.NEW,
      createdAt,
      startedAt: null,
      completedAt: null,
      revokedAt: null,
    };
  });

  return transaction();
}

export function getParticipantLinks(db: Database.Database) {
  const rows = db
    .prepare(
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
      ORDER BY id DESC
      `,
    )
    .all() as ParticipantLinkRow[];

  return rows.map((row) => ({
    id: row.id,
    token: row.token,
    status: row.status,
    createdAt: row.created_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    revokedAt: row.revoked_at,
  }));
}

export function revokeParticipantLink(db: Database.Database, linkId: number) {
  const link = db
    .prepare(
      `
      SELECT id, status, revoked_at
      FROM participant_links
      WHERE id = ?
      `,
    )
    .get(linkId) as
    | { id: number; status: string; revoked_at: string | null }
    | undefined;

  if (!link) {
    throw new Error("Ссылка не найдена");
  }

  if (link.status === LINK_STATUS.COMPLETED) {
    throw new Error("Нельзя отозвать уже завершенную ссылку");
  }

  if (link.status === LINK_STATUS.REVOKED) {
    throw new Error("Ссылка уже отозвана");
  }

  db.prepare(
    `
    UPDATE participant_links
    SET status = ?, revoked_at = ?
    WHERE id = ?
    `,
  ).run(LINK_STATUS.REVOKED, nowIso(), linkId);

  return { ok: true };
}

export function deleteUnusedParticipantLink(
  db: Database.Database,
  linkId: number,
) {
  const link = db
    .prepare(
      `
      SELECT id, token, status, started_at, completed_at
      FROM participant_links
      WHERE id = ?
      `,
    )
    .get(linkId) as
    | {
        id: number;
        token: string;
        status: string;
        started_at: string | null;
        completed_at: string | null;
      }
    | undefined;

  if (!link) {
    throw new Error("Ссылка не найдена");
  }

  const hasSession = db
    .prepare(
      `
      SELECT id
      FROM participant_sessions
      WHERE link_id = ?
      LIMIT 1
      `,
    )
    .get(linkId);

  if (hasSession || link.started_at || link.completed_at) {
    throw new Error("Можно удалить только неиспользованную ссылку");
  }

  const transaction = db.transaction(() => {
    db.prepare(
      `
      DELETE FROM participant_links
      WHERE id = ?
      `,
    ).run(linkId);

    coreDb
      .prepare(
        `
        DELETE FROM participant_link_index
        WHERE token = ?
        `,
      )
      .run(link.token);
  });

  transaction();

  return { ok: true };
}
