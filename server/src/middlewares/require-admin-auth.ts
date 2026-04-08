import type { NextFunction, Request, Response } from "express";

export function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const adminId = req.cookies.adminId;

  if (!adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}
