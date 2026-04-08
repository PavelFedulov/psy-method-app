import type { NextFunction, Request, Response } from "express";

export function requireSuperAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const superAdminId = req.cookies.superAdminId;

  if (!superAdminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}
