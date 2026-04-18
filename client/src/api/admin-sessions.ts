import { http } from "./http";

export type AdminSession = {
  id: number;
  participantCode: string;
  currentStep: number;
  status: "in_progress" | "completed" | string;
  startedAt: string;
  lastActivityAt: string;
  completedAt: string | null;
  linkId: number;
  linkStatus: "new" | "in_progress" | "completed" | "revoked" | string;
};

export type AdminSessionsListResponse = {
  sessions: AdminSession[];
};

export type AdminSessionDetailResponse = {
  session: {
    id: number;
    participantCode: string;
    currentStep: number;
    status: string;
    startedAt: string;
    lastActivityAt: string;
    completedAt: string | null;
    stepsCompleted: number;
    totalTimeSeconds: number;
    totalTimeFormatted: string;
    totalClicks: number;
  };
  link: {
    id: number;
    token: string;
    status: string;
    createdAt: string;
    startedAt: string | null;
    completedAt: string | null;
    revokedAt: string | null;
  };
  steps: Array<{
    id: number;
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
    createdAt: string;
  }>;
};

export function getAdminSessions() {
  return http<AdminSessionsListResponse>("/api/admin/sessions");
}

export function getAdminSessionDetail(sessionId: number) {
  return http<AdminSessionDetailResponse>(`/api/admin/sessions/${sessionId}`);
}

export function deleteAdminSession(sessionId: number) {
  return http<{ ok: true }>(`/api/admin/sessions/${sessionId}`, {
    method: "DELETE",
  });
}

export function bulkDeleteAdminSessions(sessionIds: number[]) {
  return http<{ ok: true; deletedCount: number }>(
    "/api/admin/sessions/bulk-delete",
    {
      method: "POST",
      json: { sessionIds },
    },
  );
}
