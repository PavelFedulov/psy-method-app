export const APP_NAME = "psy-method-server";
export const TOTAL_STEPS = 10;

export const SESSION_STATUS = {
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export const LINK_STATUS = {
  NEW: "new",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  REVOKED: "revoked",
} as const;

export const COOKIE_NAMES = {
  ADMIN_SESSION: "admin_session",
  SUPER_ADMIN_SESSION: "super_admin_session",
} as const;
