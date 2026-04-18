import { http } from "./http";

export type AdminMeResponse = {
  authenticated: boolean;
  admin: {
    id: number;
    username: string;
    dbFileName: string;
  } | null;
};

export type AdminLoginRequest = {
  username: string;
  password: string;
};

export type AdminLoginResponse = {
  admin: {
    id: number;
    username: string;
    dbFileName: string;
  };
};

export function getAdminMe() {
  return http<AdminMeResponse>("/api/admin/auth/me");
}

export function loginAdmin(payload: AdminLoginRequest) {
  return http<AdminLoginResponse>("/api/admin/auth/login", {
    method: "POST",
    json: payload,
  });
}

export function logoutAdmin() {
  return http<{ ok: true }>("/api/admin/auth/logout", {
    method: "POST",
  });
}
