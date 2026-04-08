import type Database from "better-sqlite3";
import { LINK_STATUS, SESSION_STATUS } from "../../constants/app.constants";
import { nowIso } from "../../utils/now";

type ParticipantLinkRow = {
  id: number;
  token: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  revoked_at: string | null;
};

type ParticipantSessionRow = {
  id: number;
  link_id: number;
  participant_code: string;
  current_step: number;
  status: string;
  started_at: string;
  last_activity_at: string;
  completed_at: string | null;
};

export function getPublicLinkState(db: Database.Database, token: string) {
  const link = db
    .prepare(
      `
      SELECT id, token, status, started_at, completed_at, revoked_at
      FROM participant_links
      WHERE token = ?
      `,
    )
    .get(token) as ParticipantLinkRow | undefined;

  if (!link) {
    return {
      state: "not_found" as const,
    };
  }

  const session = db
    .prepare(
      `
      SELECT id, link_id, participant_code, current_step, status, started_at, last_activity_at, completed_at
      FROM participant_sessions
      WHERE link_id = ?
      LIMIT 1
      `,
    )
    .get(link.id) as ParticipantSessionRow | undefined;

  if (link.status === LINK_STATUS.REVOKED) {
    return {
      state: "revoked" as const,
    };
  }

  if (link.status === LINK_STATUS.COMPLETED) {
    return {
      state: "completed" as const,
      session: session
        ? {
            id: session.id,
            participantCode: session.participant_code,
            currentStep: session.current_step,
            status: session.status,
            completedAt: session.completed_at,
          }
        : null,
    };
  }

  if (session && session.status === SESSION_STATUS.IN_PROGRESS) {
    return {
      state: "in_progress" as const,
      session: {
        id: session.id,
        participantCode: session.participant_code,
        currentStep: session.current_step,
        status: session.status,
      },
    };
  }

  return {
    state: "ready" as const,
  };
}

type StartPublicSessionInput = {
  participantCode: string;
  consentAccepted: boolean;
};

export function startPublicSession(
  db: Database.Database,
  token: string,
  input: StartPublicSessionInput,
) {
  const participantCode = input.participantCode.trim();

  if (!participantCode) {
    throw new Error("Participant ID обязателен");
  }

  if (!input.consentAccepted) {
    throw new Error("Необходимо принять информированное согласие");
  }

  const link = db
    .prepare(
      `
      SELECT id, token, status
      FROM participant_links
      WHERE token = ?
      `,
    )
    .get(token) as { id: number; token: string; status: string } | undefined;

  if (!link) {
    throw new Error("Ссылка не найдена");
  }

  if (link.status === LINK_STATUS.REVOKED) {
    throw new Error("Ссылка отозвана");
  }

  if (link.status === LINK_STATUS.COMPLETED) {
    throw new Error("Прохождение по ссылке уже завершено");
  }

  const existingSessionByLink = db
    .prepare(
      `
      SELECT id, participant_code, current_step, status
      FROM participant_sessions
      WHERE link_id = ?
      LIMIT 1
      `,
    )
    .get(link.id) as
    | {
        id: number;
        participant_code: string;
        current_step: number;
        status: string;
      }
    | undefined;

  if (existingSessionByLink) {
    if (existingSessionByLink.participant_code !== participantCode) {
      throw new Error(
        "Для этой ссылки уже начато прохождение с другим participant ID",
      );
    }

    return {
      sessionId: existingSessionByLink.id,
      participantCode: existingSessionByLink.participant_code,
      currentStep: existingSessionByLink.current_step,
      status: existingSessionByLink.status,
      resumed: true,
    };
  }

  const existingParticipantCode = db
    .prepare(
      `
      SELECT id
      FROM participant_sessions
      WHERE participant_code = ?
      LIMIT 1
      `,
    )
    .get(participantCode);

  if (existingParticipantCode) {
    throw new Error("Такой participant ID уже существует");
  }

  const createdAt = nowIso();

  const transaction = db.transaction(() => {
    const insertResult = db
      .prepare(
        `
        INSERT INTO participant_sessions (
          link_id,
          participant_code,
          consent_accepted,
          current_step,
          status,
          started_at,
          last_activity_at,
          completed_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
        `,
      )
      .run(
        link.id,
        participantCode,
        1,
        1,
        SESSION_STATUS.IN_PROGRESS,
        createdAt,
        createdAt,
      );

    db.prepare(
      `
      UPDATE participant_links
      SET status = ?, started_at = ?
      WHERE id = ?
      `,
    ).run(LINK_STATUS.IN_PROGRESS, createdAt, link.id);

    return {
      sessionId: Number(insertResult.lastInsertRowid),
      participantCode,
      currentStep: 1,
      status: SESSION_STATUS.IN_PROGRESS,
      resumed: false,
    };
  });

  return transaction();
}

export function getPublicSessionProgress(db: Database.Database, token: string) {
  const link = db
    .prepare(
      `
      SELECT id, token, status
      FROM participant_links
      WHERE token = ?
      `,
    )
    .get(token) as { id: number; token: string; status: string } | undefined;

  if (!link) {
    return {
      state: "not_found" as const,
    };
  }

  if (link.status === LINK_STATUS.REVOKED) {
    return {
      state: "revoked" as const,
    };
  }

  const session = db
    .prepare(
      `
      SELECT id, participant_code, current_step, status, completed_at
      FROM participant_sessions
      WHERE link_id = ?
      LIMIT 1
      `,
    )
    .get(link.id) as
    | {
        id: number;
        participant_code: string;
        current_step: number;
        status: string;
        completed_at: string | null;
      }
    | undefined;

  if (!session) {
    return {
      state: "not_started" as const,
    };
  }

  if (
    session.status === SESSION_STATUS.COMPLETED ||
    link.status === LINK_STATUS.COMPLETED
  ) {
    return {
      state: "completed" as const,
      session: {
        id: session.id,
        participantCode: session.participant_code,
        currentStep: session.current_step,
        status: session.status,
        completedAt: session.completed_at,
      },
    };
  }

  return {
    state: "in_progress" as const,
    session: {
      id: session.id,
      participantCode: session.participant_code,
      currentStep: session.current_step,
      status: session.status,
    },
  };
}
