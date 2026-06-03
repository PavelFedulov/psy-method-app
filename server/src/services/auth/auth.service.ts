import { query } from "../../db/postgres";
import { nowIso } from "../../utils/now";
import {
  generateSessionToken,
  hashSessionToken,
} from "../../utils/session-token";
import { verifyPassword } from "../../utils/password";

type SuperAdminRow = {
  id: number;
  username: string;
  password_hash: string;
};

type AdminRow = {
  id: number;
  username: string;
  password_hash: string;
  is_active: boolean;
};

function getExpiryIso(days: number): string {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt.toISOString();
}

export async function loginSuperAdmin(username: string, password: string) {
  const result = await query<SuperAdminRow>(
      `
      SELECT id, username, password_hash
      FROM super_admins
      WHERE username = $1
      `,
    [username],
  );

  const row = result.rows[0];

  if (!row) {
    throw new Error("Неверный логин или пароль");
  }

  const isValid = await verifyPassword(password, row.password_hash);

  if (!isValid) {
    throw new Error("Неверный логин или пароль");
  }

  const rawToken = generateSessionToken();
  const tokenHash = hashSessionToken(rawToken);

  await query(
      `
      INSERT INTO super_admin_sessions (super_admin_id, session_token_hash, created_at, expires_at)
      VALUES ($1, $2, $3, $4)
      `,
    [row.id, tokenHash, nowIso(), getExpiryIso(7)],
  );

  return {
    token: rawToken,
    superAdmin: {
      id: row.id,
      username: row.username,
    },
  };
}

export async function loginAdmin(username: string, password: string) {
  const result = await query<AdminRow>(
      `
      SELECT id, username, password_hash, is_active
      FROM admins
      WHERE username = $1
      `,
    [username],
  );

  const row = result.rows[0];

  if (!row || !row.is_active) {
    throw new Error("Неверный логин или пароль");
  }

  const isValid = await verifyPassword(password, row.password_hash);

  if (!isValid) {
    throw new Error("Неверный логин или пароль");
  }

  const rawToken = generateSessionToken();
  const tokenHash = hashSessionToken(rawToken);

  await query(
      `
      INSERT INTO admin_sessions (admin_id, session_token_hash, created_at, expires_at)
      VALUES ($1, $2, $3, $4)
      `,
    [row.id, tokenHash, nowIso(), getExpiryIso(7)],
  );

  return {
    token: rawToken,
    admin: {
      id: row.id,
      username: row.username,
    },
  };
}

export async function logoutSuperAdmin(rawToken: string) {
  const tokenHash = hashSessionToken(rawToken);

  await query(
      `
      DELETE FROM super_admin_sessions
      WHERE session_token_hash = $1
      `,
    [tokenHash],
  );
}

export async function logoutAdmin(rawToken: string) {
  const tokenHash = hashSessionToken(rawToken);

  await query(
      `
      DELETE FROM admin_sessions
      WHERE session_token_hash = $1
      `,
    [tokenHash],
  );
}

export async function getSuperAdminBySessionToken(rawToken: string) {
  const tokenHash = hashSessionToken(rawToken);

  const result = await query<{ id: number; username: string }>(
      `
      SELECT sa.id, sa.username
      FROM super_admin_sessions sas
      JOIN super_admins sa ON sa.id = sas.super_admin_id
      WHERE sas.session_token_hash = $1
        AND sas.expires_at > $2
      `,
    [tokenHash, nowIso()],
  );

  return result.rows[0];
}

export async function getAdminBySessionToken(rawToken: string) {
  const tokenHash = hashSessionToken(rawToken);

  const result = await query<{ id: number; username: string }>(
      `
      SELECT a.id, a.username
      FROM admin_sessions s
      JOIN admins a ON a.id = s.admin_id
      WHERE s.session_token_hash = $1
        AND s.expires_at > $2
        AND a.is_active = TRUE
      `,
    [tokenHash, nowIso()],
  );

  return result.rows[0];
}
