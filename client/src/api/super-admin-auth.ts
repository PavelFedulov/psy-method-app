import { http } from './http';

export type SuperAdminMeResponse = {
  authenticated: boolean;
  superAdmin: {
    id: number;
    username: string;
  } | null;
};

export type SuperAdminLoginRequest = {
  username: string;
  password: string;
};

export type SuperAdminLoginResponse = {
  superAdmin: {
    id: number;
    username: string;
  };
};

export function getSuperAdminMe() {
  return http<SuperAdminMeResponse>('/api/super-admin/auth/me');
}

export function loginSuperAdmin(payload: SuperAdminLoginRequest) {
  return http<SuperAdminLoginResponse>('/api/super-admin/auth/login', {
    method: 'POST',
    json: payload,
  });
}

export function logoutSuperAdmin() {
  return http<{ ok: true }>('/api/super-admin/auth/logout', {
    method: 'POST',
  });
}