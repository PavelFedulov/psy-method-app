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
    sessionStatus: row.session_status,
    sessionStartedAt: row.session_started_at,
    sessionCompletedAt: row.session_completed_at,
    linkId: row.link_id,
    linkToken: row.link_token,
    linkStatus: row.link_status,
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
      { key: "sessionId", header: "sessionId" },
      { key: "participantCode", header: "participantCode" },
      { key: "sessionStatus", header: "sessionStatus" },
      { key: "sessionStartedAt", header: "sessionStartedAt" },
      { key: "sessionCompletedAt", header: "sessionCompletedAt" },
      { key: "linkId", header: "linkId" },
      { key: "linkToken", header: "linkToken" },
      { key: "linkStatus", header: "linkStatus" },
      { key: "stepId", header: "stepId" },
      { key: "stepNumber", header: "stepNumber" },
      { key: "stimulusType", header: "stimulusType" },
      { key: "stimulusLabel", header: "stimulusLabel" },
      { key: "adjustablePartLabel", header: "adjustablePartLabel" },
      { key: "referenceValue", header: "referenceValue" },
      { key: "finalValue", header: "finalValue" },
      { key: "deviation", header: "deviation" },
      { key: "clicksMore", header: "clicksMore" },
      { key: "clicksLess", header: "clicksLess" },
      { key: "clicksTotal", header: "clicksTotal" },
      { key: "timeSpentSeconds", header: "timeSpentSeconds" },
      { key: "timeSpentFormatted", header: "timeSpentFormatted" },
      { key: "stepCreatedAt", header: "stepCreatedAt" },
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
  const worksheet = workbook.addWorksheet("Results");

  worksheet.columns = [
    { header: "sessionId", key: "sessionId", width: 12 },
    { header: "participantCode", key: "participantCode", width: 18 },
    { header: "sessionStatus", key: "sessionStatus", width: 16 },
    { header: "sessionStartedAt", key: "sessionStartedAt", width: 28 },
    { header: "sessionCompletedAt", key: "sessionCompletedAt", width: 28 },
    { header: "linkId", key: "linkId", width: 10 },
    { header: "linkToken", key: "linkToken", width: 42 },
    { header: "linkStatus", key: "linkStatus", width: 14 },
    { header: "stepId", key: "stepId", width: 10 },
    { header: "stepNumber", key: "stepNumber", width: 12 },
    { header: "stimulusType", key: "stimulusType", width: 20 },
    { header: "stimulusLabel", key: "stimulusLabel", width: 28 },
    { header: "adjustablePartLabel", key: "adjustablePartLabel", width: 28 },
    { header: "referenceValue", key: "referenceValue", width: 16 },
    { header: "finalValue", key: "finalValue", width: 14 },
    { header: "deviation", key: "deviation", width: 12 },
    { header: "clicksMore", key: "clicksMore", width: 12 },
    { header: "clicksLess", key: "clicksLess", width: 12 },
    { header: "clicksTotal", key: "clicksTotal", width: 12 },
    { header: "timeSpentSeconds", key: "timeSpentSeconds", width: 18 },
    { header: "timeSpentFormatted", key: "timeSpentFormatted", width: 18 },
    { header: "stepCreatedAt", key: "stepCreatedAt", width: 28 },
  ];

  rows.forEach((row) => {
    worksheet.addRow(row);
  });

  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
