import type Database from "better-sqlite3";
import { z } from "zod";
import {
  LINK_STATUS,
  SESSION_STATUS,
  TOTAL_STEPS,
} from "../../constants/app.constants";
import { getStimulusByStep } from "../../constants/stimuli";
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

const submitStepSchema = z.object({
  finalValue: z.number().finite(),
  clicksMore: z.number().int().min(0),
  clicksLess: z.number().int().min(0),
  timeSpentSeconds: z.number().int().min(0),
});

function getLinkByToken(db: Database.Database, token: string) {
  return db
    .prepare(
      `
      SELECT id, token, status, started_at, completed_at, revoked_at
      FROM participant_links
      WHERE token = ?
      `,
    )
    .get(token) as ParticipantLinkRow | undefined;
}

function getSessionByLinkId(db: Database.Database, linkId: number) {
  return db
    .prepare(
      `
      SELECT id, link_id, participant_code, current_step, status, started_at, last_activity_at, completed_at
      FROM participant_sessions
      WHERE link_id = ?
      LIMIT 1
      `,
    )
    .get(linkId) as ParticipantSessionRow | undefined;
}

export function getPublicLinkState(db: Database.Database, token: string) {
  const link = getLinkByToken(db, token);

  if (!link) {
    return {
      state: "not_found" as const,
    };
  }

  const session = getSessionByLinkId(db, link.id);

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

  const link = getLinkByToken(db, token);

  if (!link) {
    throw new Error("Ссылка не найдена");
  }

  if (link.status === LINK_STATUS.REVOKED) {
    throw new Error("Ссылка отозвана");
  }

  if (link.status === LINK_STATUS.COMPLETED) {
    throw new Error("Прохождение по ссылке уже завершено");
  }

  const existingSessionByLink = getSessionByLinkId(db, link.id);

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
  const link = getLinkByToken(db, token);

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

  const session = getSessionByLinkId(db, link.id);

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

export function getPublicStep(
  db: Database.Database,
  token: string,
  requestedStepNumber: number,
) {
  if (
    !Number.isInteger(requestedStepNumber) ||
    requestedStepNumber < 1 ||
    requestedStepNumber > TOTAL_STEPS
  ) {
    throw new Error("Некорректный номер шага");
  }

  const link = getLinkByToken(db, token);

  if (!link) {
    throw new Error("Ссылка не найдена");
  }

  if (link.status === LINK_STATUS.REVOKED) {
    throw new Error("Ссылка отозвана");
  }

  const session = getSessionByLinkId(db, link.id);

  if (!session) {
    throw new Error("Сессия еще не начата");
  }

  if (
    session.status === SESSION_STATUS.COMPLETED ||
    link.status === LINK_STATUS.COMPLETED
  ) {
    throw new Error("Прохождение уже завершено");
  }

  if (requestedStepNumber !== session.current_step) {
    throw new Error(`Сейчас доступен только шаг ${session.current_step}`);
  }

  const stimulus = getStimulusByStep(requestedStepNumber);

  if (!stimulus) {
    throw new Error("Конфиг шага не найден");
  }

  return {
    stepNumber: requestedStepNumber,
    totalSteps: TOTAL_STEPS,
    participantCode: session.participant_code,
    stimulus: {
      stepNumber: stimulus.stepNumber,
      stimulusType: stimulus.stimulusType,
      stimulusLabel: stimulus.stimulusLabel,
      adjustablePartLabel: stimulus.adjustablePartLabel,
      referenceValue: stimulus.referenceValue,
      stepSize: stimulus.stepSize,
    },
  };
}

export function submitPublicStep(
  db: Database.Database,
  token: string,
  requestedStepNumber: number,
  input: unknown,
) {
  if (
    !Number.isInteger(requestedStepNumber) ||
    requestedStepNumber < 1 ||
    requestedStepNumber > TOTAL_STEPS
  ) {
    throw new Error("Некорректный номер шага");
  }

  const parsed = submitStepSchema.parse(input);

  const link = getLinkByToken(db, token);

  if (!link) {
    throw new Error("Ссылка не найдена");
  }

  if (link.status === LINK_STATUS.REVOKED) {
    throw new Error("Ссылка отозвана");
  }

  if (link.status === LINK_STATUS.COMPLETED) {
    throw new Error("Прохождение уже завершено");
  }

  const session = getSessionByLinkId(db, link.id);

  if (!session) {
    throw new Error("Сессия еще не начата");
  }

  if (session.status === SESSION_STATUS.COMPLETED) {
    throw new Error("Прохождение уже завершено");
  }

  if (requestedStepNumber !== session.current_step) {
    throw new Error(`Сейчас доступен только шаг ${session.current_step}`);
  }

  const stimulus = getStimulusByStep(requestedStepNumber);

  if (!stimulus) {
    throw new Error("Конфиг шага не найден");
  }

  const minAllowedValue = Math.max(1, stimulus.referenceValue - 20);

  const maxAllowedValue = stimulus.referenceValue + 20;

  if (
    parsed.finalValue < minAllowedValue ||
    parsed.finalValue > maxAllowedValue
  ) {
    throw new Error(
      `Значение должно быть в диапазоне от ${minAllowedValue} до ${maxAllowedValue}`,
    );
  }

  const existingStep = db
    .prepare(
      `
      SELECT id
      FROM session_steps
      WHERE session_id = ? AND step_number = ?
      LIMIT 1
      `,
    )
    .get(session.id, requestedStepNumber);

  if (existingStep) {
    throw new Error("Этот шаг уже сохранен");
  }

  const clicksTotal = parsed.clicksMore + parsed.clicksLess;
  const deviation = Math.abs(parsed.finalValue - stimulus.referenceValue);
  const createdAt = nowIso();
  const isFinalStep = requestedStepNumber === TOTAL_STEPS;

  const transaction = db.transaction(() => {
    db.prepare(
      `
      INSERT INTO session_steps (
        session_id,
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
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).run(
      session.id,
      requestedStepNumber,
      stimulus.stimulusType,
      stimulus.stimulusLabel,
      stimulus.adjustablePartLabel,
      stimulus.referenceValue,
      parsed.finalValue,
      deviation,
      parsed.clicksMore,
      parsed.clicksLess,
      clicksTotal,
      parsed.timeSpentSeconds,
      createdAt,
    );

    if (isFinalStep) {
      db.prepare(
        `
        UPDATE participant_sessions
        SET current_step = ?, status = ?, last_activity_at = ?, completed_at = ?
        WHERE id = ?
        `,
      ).run(
        TOTAL_STEPS,
        SESSION_STATUS.COMPLETED,
        createdAt,
        createdAt,
        session.id,
      );

      db.prepare(
        `
        UPDATE participant_links
        SET status = ?, completed_at = ?
        WHERE id = ?
        `,
      ).run(LINK_STATUS.COMPLETED, createdAt, link.id);

      return {
        savedStepNumber: requestedStepNumber,
        completed: true,
        nextStep: null,
      };
    }

    const nextStep = requestedStepNumber + 1;

    db.prepare(
      `
      UPDATE participant_sessions
      SET current_step = ?, last_activity_at = ?
      WHERE id = ?
      `,
    ).run(nextStep, createdAt, session.id);

    return {
      savedStepNumber: requestedStepNumber,
      completed: false,
      nextStep,
    };
  });

  return transaction();
}
