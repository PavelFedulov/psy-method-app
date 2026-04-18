import { http } from "./http";

export type AdminLink = {
  id: number;
  token: string;
  status: "new" | "in_progress" | "completed" | "revoked" | string;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  revokedAt: string | null;
};

export type AdminLinksListResponse = {
  links: AdminLink[];
};

export type CreateAdminLinkResponse = {
  link: AdminLink;
};

export function getAdminLinks() {
  return http<AdminLinksListResponse>("/api/admin/links");
}

export function createAdminLink() {
  return http<CreateAdminLinkResponse>("/api/admin/links", {
    method: "POST",
  });
}

export function revokeAdminLink(linkId: number) {
  return http<{ ok: true }>(`/api/admin/links/${linkId}/revoke`, {
    method: "POST",
  });
}

export function deleteAdminLink(linkId: number) {
  return http<{ ok: true }>(`/api/admin/links/${linkId}`, {
    method: "DELETE",
  });
}
