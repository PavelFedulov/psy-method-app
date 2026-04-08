import type Database from "better-sqlite3";
import ExcelJS from "exceljs";
import { stringify } from "csv-stringify/sync";
import { formatDurationMmSs } from "../../utils/format-duration";

type ExportRow = {
  session_id: number;
  participant_code: string;
  session_status: string;
  session_started_at: string;
  session_completed_at: string | null;
  link_id: number;
  link_token: string;
  link_status: string;
  step_id: number;
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
  step_created_at: string;
};

type ExportInput = {
  sessionIds?: number[];
  exportAll?: boolean;
};

type FlatExportRow = {
  sessionId: number;
  participantCode: string;
  sessionStatus: string;
  sessionStartedAt: string;
  sessionCompletedAt: string | null;
  linkId: number;
  linkToken: string;
  linkStatus: string;
  stepId: number;
  stepNumber: number;
  stimulusType: string;
  stimulusLabel: string;
  adjustablePartLabel: string;
  referenceValue: number;
  finalValue: number;
  deviation: number;
  clicksMore: number;
  clicksLess: number;
  clicksTotal: number;
  timeSpentSeconds: number;
  timeSpentFormatted: string;
  stepCreatedAt: string;
};

function normalizeSessionIds(sessionIds?: number[]): number[] {
  if (!sessionIds) {
    return [];
  }

  return sessionIds
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0);
}

function resolveSessionIds(
  db: Database.Database,
  input: ExportInput,
): number[] {
  if (input.exportAll) {
    const rows = db
      .prepare(
        `
        SELECT id
        FROM participant_sessions
        ORDER BY id ASC
        `,
      )
      .all() as Array<{ id: number }>;

    return rows.map((row) => row.id);
  }

  const ids = normalizeSessionIds(input.sessionIds);

  if (ids.length === 0) {
    throw new Error("Нужно передать sessionIds или exportAll=true");
  }

  return ids;
}

function mapSessionStatus(status: string): string {
  switch (status) {
    case "completed":
      return "завершено";
    case "in_progress":
      return "в процессе";
    default:
      return status;
  }
}

function mapLinkStatus(status: string): string {
  switch (status) {
    case "new":
      return "новая";
    case "in_progress":
      return "в процессе";
    case "completed":
      return "завершена";
    case "revoked":
      return "отозвана";
    default:
      return status;
  }
}

function buildExportRows(
  db: Database.Database,
  input: ExportInput,
): FlatExportRow[] {
  const sessionIds = resolveSessionIds(db, input);

  if (sessionIds.length === 0) {
    return [];
  }

  const placeholders = sessionIds.map(() => "?").join(",");

  const rows = db
    .prepare(
      `
      SELECT
        s.id AS session_id,
        s.participant_code,
        s.status AS session_status,
        s.started_at AS session_started_at,
        s.completed_at AS session_completed_at,
        l.id AS link_id,
        l.token AS link_token,
        l.status AS link_status,
        st.id AS step_id,
        st.step_number,
        st.stimulus_type,
        st.stimulus_label,
        st.adjustable_part_label,
        st.reference_value,
        st.final_value,
        st.deviation,
        st.clicks_more,
        st.clicks_less,
        st.clicks_total,
        st.time_spent_seconds,
        st.created_at AS step_created_at
      FROM participant_sessions s
      JOIN participant_links l ON l.id = s.link_id
      JOIN session_steps st ON st.session_id = s.id
      WHERE s.id IN (${placeholders})
      ORDER BY s.id ASC, st.step_number ASC
      `,
    )
    .all(...sessionIds) as ExportRow[];

  return rows.map((row) => ({
    sessionId: row.session_id,
    participantCode: row.participant_code,
    sessionStatus: mapSessionStatus(row.session_status),
    sessionStartedAt: row.session_started_at,
    sessionCompletedAt: row.session_completed_at,
    linkId: row.link_id,
    linkToken: row.link_token,
    linkStatus: mapLinkStatus(row.link_status),
    stepId: row.step_id,
    stepNumber: row.step_number,
    stimulusType: row.stimulus_type,
    stimulusLabel: row.stimulus_label,
    adjustablePartLabel: row.adjustable_part_label,
    referenceValue: row.reference_value,
    finalValue: row.final_value,
    deviation: row.deviation,
    clicksMore: row.clicks_more,
    clicksLess: row.clicks_less,
    clicksTotal: row.clicks_total,
    timeSpentSeconds: row.time_spent_seconds,
    timeSpentFormatted: formatDurationMmSs(row.time_spent_seconds),
    stepCreatedAt: row.step_created_at,
  }));
}

export function exportSessionsToCsv(db: Database.Database, input: ExportInput) {
  const rows = buildExportRows(db, input);

  const csv = stringify(rows, {
    header: true,
    columns: [
      { key: "sessionId", header: "ID прохождения" },
      { key: "participantCode", header: "Participant ID" },
      { key: "sessionStatus", header: "Статус прохождения" },
      { key: "sessionStartedAt", header: "Начало прохождения" },
      { key: "sessionCompletedAt", header: "Завершение прохождения" },
      { key: "linkId", header: "ID ссылки" },
      { key: "linkToken", header: "Токен ссылки" },
      { key: "linkStatus", header: "Статус ссылки" },
      { key: "stepId", header: "ID шага" },
      { key: "stepNumber", header: "Номер шага" },
      { key: "stimulusType", header: "Код стимула" },
      { key: "stimulusLabel", header: "Название стимула" },
      { key: "adjustablePartLabel", header: "Изменяемая часть фигуры" },
      { key: "referenceValue", header: "Эталонное значение" },
      { key: "finalValue", header: "Итоговое значение" },
      { key: "deviation", header: "Отклонение от эталона" },
      { key: "clicksMore", header: 'Нажатий "больше"' },
      { key: "clicksLess", header: 'Нажатий "меньше"' },
      { key: "clicksTotal", header: "Общее количество нажатий" },
      { key: "timeSpentSeconds", header: "Время на шаге (сек)" },
      { key: "timeSpentFormatted", header: "Время на шаге (мм:сс)" },
      { key: "stepCreatedAt", header: "Время сохранения шага" },
    ],
  });

  return Buffer.from(csv, "utf-8");
}

export async function exportSessionsToXlsx(
  db: Database.Database,
  input: ExportInput,
) {
  const rows = buildExportRows(db, input);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Результаты");

  worksheet.columns = [
    { header: "ID прохождения", key: "sessionId", width: 16 },
    { header: "Participant ID", key: "participantCode", width: 18 },
    { header: "Статус прохождения", key: "sessionStatus", width: 20 },
    { header: "Начало прохождения", key: "sessionStartedAt", width: 24 },
    { header: "Завершение прохождения", key: "sessionCompletedAt", width: 24 },
    { header: "ID ссылки", key: "linkId", width: 12 },
    { header: "Токен ссылки", key: "linkToken", width: 42 },
    { header: "Статус ссылки", key: "linkStatus", width: 18 },
    { header: "ID шага", key: "stepId", width: 12 },
    { header: "Номер шага", key: "stepNumber", width: 14 },
    { header: "Код стимула", key: "stimulusType", width: 20 },
    { header: "Название стимула", key: "stimulusLabel", width: 28 },
    {
      header: "Изменяемая часть фигуры",
      key: "adjustablePartLabel",
      width: 30,
    },
    { header: "Эталонное значение", key: "referenceValue", width: 18 },
    { header: "Итоговое значение", key: "finalValue", width: 18 },
    { header: "Отклонение от эталона", key: "deviation", width: 20 },
    { header: 'Нажатий "больше"', key: "clicksMore", width: 18 },
    { header: 'Нажатий "меньше"', key: "clicksLess", width: 18 },
    { header: "Общее количество нажатий", key: "clicksTotal", width: 24 },
    { header: "Время на шаге (сек)", key: "timeSpentSeconds", width: 18 },
    { header: "Время на шаге (мм:сс)", key: "timeSpentFormatted", width: 20 },
    { header: "Время сохранения шага", key: "stepCreatedAt", width: 24 },
  ];

  rows.forEach((row) => {
    worksheet.addRow(row);
  });

  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
