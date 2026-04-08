import { coreDb } from "../../db/core/core-db";
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
  is_active: number;
  db_file_name: string;
};

function getExpiryIso(days: number): string {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt.toISOString();
}

export async function loginSuperAdmin(username: string, password: string) {
  const row = coreDb
    .prepare(
      `
      SELECT id, username, password_hash
      FROM super_admins
      WHERE username = ?
      `,
    )
    .get(username) as SuperAdminRow | undefined;

  if (!row) {
    throw new Error("Неверный логин или пароль");
  }

  const isValid = await verifyPassword(password, row.password_hash);

  if (!isValid) {
    throw new Error("Неверный логин или пароль");
  }

  const rawToken = generateSessionToken();
  const tokenHash = hashSessionToken(rawToken);

  coreDb
    .prepare(
      `
      INSERT INTO super_admin_sessions (super_admin_id, session_token_hash, created_at, expires_at)
      VALUES (?, ?, ?, ?)
      `,
    )
    .run(row.id, tokenHash, nowIso(), getExpiryIso(7));

  return {
    token: rawToken,
    superAdmin: {
      id: row.id,
      username: row.username,
    },
  };
}

export async function loginAdmin(username: string, password: string) {
  const row = coreDb
    .prepare(
      `
      SELECT id, username, password_hash, is_active, db_file_name
      FROM admins
      WHERE username = ?
      `,
    )
    .get(username) as AdminRow | undefined;

  if (!row || !row.is_active) {
    throw new Error("Неверный логин или пароль");
  }

  const isValid = await verifyPassword(password, row.password_hash);

  if (!isValid) {
    throw new Error("Неверный логин или пароль");
  }

  const rawToken = generateSessionToken();
  const tokenHash = hashSessionToken(rawToken);

  coreDb
    .prepare(
      `
      INSERT INTO admin_sessions (admin_id, session_token_hash, created_at, expires_at)
      VALUES (?, ?, ?, ?)
      `,
    )
    .run(row.id, tokenHash, nowIso(), getExpiryIso(7));

  return {
    token: rawToken,
    admin: {
      id: row.id,
      username: row.username,
      dbFileName: row.db_file_name,
    },
  };
}

export function logoutSuperAdmin(rawToken: string) {
  const tokenHash = hashSessionToken(rawToken);

  coreDb
    .prepare(
      `
      DELETE FROM super_admin_sessions
      WHERE session_token_hash = ?
      `,
    )
    .run(tokenHash);
}

export function logoutAdmin(rawToken: string) {
  const tokenHash = hashSessionToken(rawToken);

  coreDb
    .prepare(
      `
      DELETE FROM admin_sessions
      WHERE session_token_hash = ?
      `,
    )
    .run(tokenHash);
}

export function getSuperAdminBySessionToken(rawToken: string) {
  const tokenHash = hashSessionToken(rawToken);

  return coreDb
    .prepare(
      `
      SELECT sa.id, sa.username
      FROM super_admin_sessions sas
      JOIN super_admins sa ON sa.id = sas.super_admin_id
      WHERE sas.session_token_hash = ?
        AND sas.expires_at > ?
      `,
    )
    .get(tokenHash, nowIso()) as { id: number; username: string } | undefined;
}

export function getAdminBySessionToken(rawToken: string) {
  const tokenHash = hashSessionToken(rawToken);

  return coreDb
    .prepare(
      `
      SELECT a.id, a.username, a.db_file_name AS dbFileName
      FROM admin_sessions s
      JOIN admins a ON a.id = s.admin_id
      WHERE s.session_token_hash = ?
        AND s.expires_at > ?
        AND a.is_active = 1
      `,
    )
    .get(tokenHash, nowIso()) as
    | { id: number; username: string; dbFileName: string }
    | undefined;
}
