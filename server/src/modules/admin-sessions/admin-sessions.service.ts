import type Database from "better-sqlite3";
import { LINK_STATUS } from "../../constants/app.constants";
import { formatDurationMmSs } from "../../utils/format-duration";

type SessionListRow = {
  id: number;
  participant_code: string;
  current_step: number;
  status: string;
  started_at: string;
  last_activity_at: string;
  completed_at: string | null;
  link_id: number;
  link_status: string;
};

type SessionStepRow = {
  id: number;
  step_number: number;
  stimulus_type: string;
  stimulus_label: string;
  adjustable_part_label: string;
  reference_value: number;
  final_value: number;
  deviation: number;
  clicks_more: number;
  clicks_less: number;
  clicks_total: number;
  time_spent_seconds: number;
  created_at: string;
};

export function getAdminSessionsList(db: Database.Database) {
  const rows = db
    .prepare(
      `
      SELECT
        s.id,
        s.participant_code,
        s.age,
        s.gender,
        s.current_step,
        s.status,
        s.started_at,
        s.last_activity_at,
        s.completed_at,
        s.link_id,
        l.status AS link_status
      FROM participant_sessions s
      JOIN participant_links l ON l.id = s.link_id
      ORDER BY s.id DESC
      `,
    )
    .all() as SessionListRow[];

  return rows.map((row) => ({
    id: row.id,
    participantCode: row.participant_code,
    age: row.age,
    gender: row.gender,
    currentStep: row.current_step,
    status: row.status,
    startedAt: row.started_at,
    lastActivityAt: row.last_activity_at,
    completedAt: row.completed_at,
    linkId: row.link_id,
    linkStatus: row.link_status,
  }));
}

export function getAdminSessionDetail(
  db: Database.Database,
  sessionId: number,
) {
  const session = db
    .prepare(
      `
      SELECT
        s.id,
        s.participant_code,
        s.current_step,
        s.status,
        s.started_at,
        s.last_activity_at,
        s.completed_at,
        s.link_id,
        l.token,
        l.status AS link_status,
        l.created_at AS link_created_at,
        l.started_at AS link_started_at,
        l.completed_at AS link_completed_at,
        l.revoked_at AS link_revoked_at
      FROM participant_sessions s
      JOIN participant_links l ON l.id = s.link_id
      WHERE s.id = ?
      `,
    )
    .get(sessionId) as
    | {
        id: number;
        participant_code: string;
        current_step: number;
        status: string;
        started_at: string;
        last_activity_at: string;
        completed_at: string | null;
        link_id: number;
        token: string;
        link_status: string;
        link_created_at: string;
        link_started_at: string | null;
        link_completed_at: string | null;
        link_revoked_at: string | null;
      }
    | undefined;

  if (!session) {
    throw new Error("Прохождение не найдено");
  }

  const steps = db
    .prepare(
      `
      SELECT
        id,
        step_number,
        stimulus_type,
        stimulus_label,
        adjustable_part_label,
        reference_value,
        final_value,
        deviation,
        clicks_more,
        clicks_less,
        clicks_total,
        time_spent_seconds,
        created_at
      FROM session_steps
      WHERE session_id = ?
      ORDER BY step_number ASC
      `,
    )
    .all(sessionId) as SessionStepRow[];

  const totalTimeSeconds = steps.reduce(
    (sum, step) => sum + step.time_spent_seconds,
    0,
  );
  const totalClicks = steps.reduce((sum, step) => sum + step.clicks_total, 0);

  return {
    session: {
      id: session.id,
      participantCode: session.participant_code,
      currentStep: session.current_step,
      status: session.status,
      startedAt: session.started_at,
      lastActivityAt: session.last_activity_at,
      completedAt: session.completed_at,
      stepsCompleted: steps.length,
      totalTimeSeconds,
      totalTimeFormatted: formatDurationMmSs(totalTimeSeconds),
      totalClicks,
    },
    link: {
      id: session.link_id,
      token: session.token,
      status: session.link_status,
      createdAt: session.link_created_at,
      startedAt: session.link_started_at,
      completedAt: session.link_completed_at,
      revokedAt: session.link_revoked_at,
    },
    steps: steps.map((step) => ({
      id: step.id,
      stepNumber: step.step_number,
      stimulusType: step.stimulus_type,
      stimulusLabel: step.stimulus_label,
      adjustablePartLabel: step.adjustable_part_label,
      referenceValue: step.reference_value,
      finalValue: step.final_value,
      deviation: step.deviation,
      clicksMore: step.clicks_more,
      clicksLess: step.clicks_less,
      clicksTotal: step.clicks_total,
      timeSpentSeconds: step.time_spent_seconds,
      timeSpentFormatted: formatDurationMmSs(step.time_spent_seconds),
      createdAt: step.created_at,
    })),
  };
}

export function deleteAdminSession(db: Database.Database, sessionId: number) {
  const session = db
    .prepare(
      `
      SELECT id, link_id
      FROM participant_sessions
      WHERE id = ?
      `,
    )
    .get(sessionId) as
    | {
        id: number;
        link_id: number;
      }
    | undefined;

  if (!session) {
    throw new Error("Прохождение не найдено");
  }

  const transaction = db.transaction(() => {
    db.prepare(
      `
      DELETE FROM session_steps
      WHERE session_id = ?
      `,
    ).run(sessionId);

    db.prepare(
      `
      DELETE FROM participant_sessions
      WHERE id = ?
      `,
    ).run(sessionId);

    db.prepare(
      `
      UPDATE participant_links
      SET
        status = ?,
        started_at = NULL,
        completed_at = NULL,
        revoked_at = NULL
      WHERE id = ?
      `,
    ).run(LINK_STATUS.NEW, session.link_id);
  });

  transaction();

  return { ok: true };
}

export function bulkDeleteAdminSessions(
  db: Database.Database,
  sessionIds: number[],
) {
  if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
    throw new Error("Нужно передать хотя бы один session id");
  }

  const normalizedIds = sessionIds
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0);

  if (normalizedIds.length === 0) {
    throw new Error("Некорректный список session id");
  }

  const transaction = db.transaction(() => {
    for (const sessionId of normalizedIds) {
      const session = db
        .prepare(
          `
          SELECT id, link_id
          FROM participant_sessions
          WHERE id = ?
          `,
        )
        .get(sessionId) as
        | {
            id: number;
            link_id: number;
          }
        | undefined;

      if (!session) {
        continue;
      }

      db.prepare(
        `
        DELETE FROM session_steps
        WHERE session_id = ?
        `,
      ).run(sessionId);

      db.prepare(
        `
        DELETE FROM participant_sessions
        WHERE id = ?
        `,
      ).run(sessionId);

      db.prepare(
        `
        UPDATE participant_links
        SET
          status = ?,
          started_at = NULL,
          completed_at = NULL,
          revoked_at = NULL
        WHERE id = ?
        `,
      ).run(LINK_STATUS.NEW, session.link_id);
    }
  });

  transaction();

  return {
    ok: true,
    deletedCount: normalizedIds.length,
  };
}
