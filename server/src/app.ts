import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";

import { env } from "./config/env";
import publicRoutes from "./modules/public/public.routes";
import adminAuthRoutes from "./modules/admin-auth/admin-auth.routes";
import adminLinksRoutes from "./modules/admin-links/admin-links.routes";
import adminSessionsRoutes from "./modules/admin-sessions/admin-sessions.routes";
import exportRoutes from "./modules/export/export.routes";
import superAdminRoutes from "./modules/super-admin/super-admin.routes";
import { notFoundHandler } from "./middlewares/not-found";
import { errorHandler } from "./middlewares/error-handler";
import { query } from "./db/postgres";

const clientDistPath = path.resolve(__dirname, "../../client/dist");
const clientIndexPath = path.join(clientDistPath, "index.html");

export function createApp() {
  if (env.isProduction && !fs.existsSync(clientIndexPath)) {
    throw new Error("Client build missing. Run npm run build before starting the server.");
  }
  const app = express();

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(cookieParser(env.cookieSecret));

  app.get("/api/health", async (_req, res) => {
    try {
      await query("SELECT 1");
      res.json({ ok: true });
    } catch {
      res.status(503).json({ ok: false });
    }
  });

  app.use("/api/public", publicRoutes);
  app.use("/api/admin/auth", adminAuthRoutes);
  app.use("/api/admin/links", adminLinksRoutes);
  app.use("/api/admin/sessions", adminSessionsRoutes);
  app.use("/api/admin/export", exportRoutes);
  app.use("/api/super-admin", superAdminRoutes);

  app.use("/api", notFoundHandler);

  if (fs.existsSync(clientIndexPath)) {
    app.use(express.static(clientDistPath));

    app.get(/.*/, (_req, res) => {
      res.sendFile(clientIndexPath);
    });
  } else {
    app.use(notFoundHandler);
  }

  app.use(errorHandler);

  return app;
}
