import type { NextFunction, Request, Response } from "express";
import { COOKIE_NAMES } from "../constants/app.constants";
import { getSuperAdminBySessionToken } from "../services/auth/auth.service";

export function requireSuperAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies[COOKIE_NAMES.SUPER_ADMIN_SESSION];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const superAdmin = getSuperAdminBySessionToken(token);

  if (!superAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.superAdmin = superAdmin;
  next();
}
