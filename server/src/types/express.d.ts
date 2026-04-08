import "express";
import type Database from "better-sqlite3";

declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: number;
        username: string;
        dbFileName: string;
      };
      superAdmin?: {
        id: number;
        username: string;
      };
      adminDb?: Database.Database;
    }
  }
}

export {};
