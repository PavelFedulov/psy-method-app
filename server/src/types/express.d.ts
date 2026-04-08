import "express";

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
    }
  }
}

export {};
