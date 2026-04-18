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

export function getAdminSessions() {
  return http<AdminSessionsListResponse>("/api/admin/sessions");
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
