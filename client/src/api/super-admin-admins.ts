import { http } from "./http";

export type ResearchAdmin = {
  id: number;
  username: string;
  isActive: boolean;
  createdAt: string;
};

export type GetResearchAdminsResponse = {
  admins: ResearchAdmin[];
};

export type CreateResearchAdminRequest = {
  username: string;
  password: string;
};

export type CreateResearchAdminResponse = {
  admin: ResearchAdmin;
};

export function getResearchAdmins() {
  return http<GetResearchAdminsResponse>("/api/super-admin/admins");
}

export function createResearchAdmin(payload: CreateResearchAdminRequest) {
  return http<CreateResearchAdminResponse>("/api/super-admin/admins", {
    method: "POST",
    json: payload,
  });
}

export function updateResearchAdminStatus(adminId: number, isActive: boolean) {
  return http<{ admin: ResearchAdmin }>(`/api/super-admin/admins/${adminId}`, {
    method: "PATCH",
    json: { isActive },
  });
}

export function deleteResearchAdmin(adminId: number) {
  return http<{ ok: true }>(`/api/super-admin/admins/${adminId}`, {
    method: "DELETE",
  });
}
