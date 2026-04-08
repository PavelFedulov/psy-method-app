import type { NextFunction, Request, Response } from "express";
import { COOKIE_NAMES } from "../constants/app.constants";
import { getAdminBySessionToken } from "../services/auth/auth.service";

export function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies[COOKIE_NAMES.ADMIN_SESSION];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const admin = getAdminBySessionToken(token);

  if (!admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.admin = admin;
  next();
}
