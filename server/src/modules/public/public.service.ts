import type { PoolClient } from "pg";
import { z } from "zod";
import { query, transaction } from "../../db/postgres";
import {
  LINK_STATUS,
  SESSION_STATUS,
  TOTAL_STEPS,
} from "../../constants/app.constants";
import { getStimulusByStep } from "../../constants/stimuli";
import { nowIso } from "../../utils/now";

type ParticipantLinkRow = {
  id: number;
  admin_id: number;
  token: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  revoked_at: string | null;
};

type ParticipantSessionRow = {
  id: number;
  admin_id: number;
  link_id: number;
  participant_code: string;
  age: number;
  gender: string;
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

async function getLinkByToken(token: string, client?: PoolClient) {
  const sql = `
    SELECT id, admin_id, token, status, started_at, completed_at, revoked_at
    FROM participant_links
    WHERE token = $1
    `;
  const params = [token];
  const result = client
    ? await client.query<ParticipantLinkRow>(sql, params)
    : await query<ParticipantLinkRow>(sql, params);

  return result.rows[0];
}

async function getSessionByLinkId(linkId: number, client?: PoolClient) {
  const sql = `
    SELECT
      id,
      admin_id,
      link_id,
      participant_code,
      age,
      gender,
      current_step,
      status,
      started_at,
      last_activity_at,
      completed_at
    FROM participant_sessions
    WHERE link_id = $1
    LIMIT 1
    `;
  const params = [linkId];
  const result = client
    ? await client.query<ParticipantSessionRow>(sql, params)
    : await query<ParticipantSessionRow>(sql, params);

  return result.rows[0];
}

export async function getPublicLinkState(token: string) {
  const link = await getLinkByToken(token);

  if (!link) {
    return {
      state: "not_found" as const,
    };
  }

  const session = await getSessionByLinkId(link.id);

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
  age: number;
  gender: "male" | "female";
  consentAccepted: boolean;
};

export async function startPublicSession(
  token: string,
  input: StartPublicSessionInput,
) {
  const participantCode = String(input.participantCode ?? "").trim();
  const age = Number(input.age);
  const gender = String(input.gender ?? "").trim();

  if (!participantCode) {
    throw new Error("Participant ID обязателен");
  }

  if (!Number.isInteger(age) || age < 18) {
    throw new Error("Возраст должен быть не меньше 18 лет");
  }

  if (!["male", "female"].includes(gender)) {
    throw new Error("Нужно выбрать пол");
  }

  if (!input.consentAccepted) {
    throw new Error("Необходимо принять информированное согласие");
  }

  return transaction(async (client) => {
    const link = await getLinkByToken(token, client);

    if (!link) {
      throw new Error("Ссылка не найдена");
    }

    if (link.status === LINK_STATUS.REVOKED) {
      throw new Error("Ссылка отозвана");
    }

    if (link.status === LINK_STATUS.COMPLETED) {
      throw new Error("Прохождение по ссылке уже завершено");
    }

    const existingSessionByLink = await getSessionByLinkId(link.id, client);

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

    const existingParticipantCode = await client.query<{ id: number }>(
      `
      SELECT id
      FROM participant_sessions
      WHERE participant_code = $1
      LIMIT 1
      `,
      [participantCode],
    );

    if (existingParticipantCode.rows[0]) {
      throw new Error("Такой participant ID уже существует");
    }

    const createdAt = nowIso();

    const insertResult = await client.query<{ id: number }>(
      `
      INSERT INTO participant_sessions (
        admin_id,
        link_id,
        participant_code,
        age,
        gender,
        consent_accepted,
        current_step,
        status,
        started_at,
        last_activity_at,
        completed_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, 1, $7, $8, $8, NULL)
      RETURNING id
      `,
      [
        link.admin_id,
        link.id,
        participantCode,
        age,
        gender,
        true,
        SESSION_STATUS.IN_PROGRESS,
        createdAt,
      ],
    );

    await client.query(
      `
      UPDATE participant_links
      SET status = $1, started_at = $2
      WHERE id = $3
      `,
      [LINK_STATUS.IN_PROGRESS, createdAt, link.id],
    );

    return {
      sessionId: insertResult.rows[0].id,
      participantCode,
      currentStep: 1,
      status: SESSION_STATUS.IN_PROGRESS,
      resumed: false,
    };
  });
}

export async function getPublicSessionProgress(token: string) {
  const link = await getLinkByToken(token);

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

  const session = await getSessionByLinkId(link.id);

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

export async function getPublicStep(
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

  const link = await getLinkByToken(token);

  if (!link) {
    throw new Error("Ссылка не найдена");
  }

  if (link.status === LINK_STATUS.REVOKED) {
    throw new Error("Ссылка отозвана");
  }

  const session = await getSessionByLinkId(link.id);

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

export async function submitPublicStep(
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

  return transaction(async (client) => {
    const link = await getLinkByToken(token, client);

    if (!link) {
      throw new Error("Ссылка не найдена");
    }

    if (link.status === LINK_STATUS.REVOKED) {
      throw new Error("Ссылка отозвана");
    }

    if (link.status === LINK_STATUS.COMPLETED) {
      throw new Error("Прохождение уже завершено");
    }

    const session = await getSessionByLinkId(link.id, client);

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

    const existingStep = await client.query<{ id: number }>(
      `
      SELECT id
      FROM session_steps
      WHERE session_id = $1 AND step_number = $2
      LIMIT 1
      `,
      [session.id, requestedStepNumber],
    );

    if (existingStep.rows[0]) {
      throw new Error("Этот шаг уже сохранен");
    }

    const clicksTotal = parsed.clicksMore + parsed.clicksLess;
    const deviation = Math.abs(parsed.finalValue - stimulus.referenceValue);
    const createdAt = nowIso();
    const isFinalStep = requestedStepNumber === TOTAL_STEPS;

    await client.query(
      `
      INSERT INTO session_steps (
        admin_id,
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `,
      [
        session.admin_id,
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
      ],
    );

    if (isFinalStep) {
      await client.query(
        `
        UPDATE participant_sessions
        SET current_step = $1, status = $2, last_activity_at = $3, completed_at = $3
        WHERE id = $4
        `,
        [TOTAL_STEPS, SESSION_STATUS.COMPLETED, createdAt, session.id],
      );

      await client.query(
        `
        UPDATE participant_links
        SET status = $1, completed_at = $2
        WHERE id = $3
        `,
        [LINK_STATUS.COMPLETED, createdAt, link.id],
      );

      return {
        savedStepNumber: requestedStepNumber,
        completed: true,
        nextStep: null,
      };
    }

    const nextStep = requestedStepNumber + 1;

    await client.query(
      `
      UPDATE participant_sessions
      SET current_step = $1, last_activity_at = $2
      WHERE id = $3
      `,
      [nextStep, createdAt, session.id],
    );

    return {
      savedStepNumber: requestedStepNumber,
      completed: false,
      nextStep,
    };
  });
}
