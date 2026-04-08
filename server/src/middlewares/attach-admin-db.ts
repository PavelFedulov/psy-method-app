import type { NextFunction, Request, Response } from "express";
import { getAdminDbByFileName } from "../db/factories/admin-db-factory";

export function attachAdminDb(req: Request, res: Response, next: NextFunction) {
  if (!req.admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = getAdminDbByFileName(req.admin.dbFileName);
  req.adminDb = db;

  res.on("finish", () => {
    try {
      db.close();
    } catch (error) {
      console.error("Failed to close admin db", error);
    }
  });

  next();
}
