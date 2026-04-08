import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env";
import publicRoutes from "./modules/public/public.routes";
import adminAuthRoutes from "./modules/admin-auth/admin-auth.routes";
import adminLinksRoutes from "./modules/admin-links/admin-links.routes";
import adminSessionsRoutes from "./modules/admin-sessions/admin-sessions.routes";
import exportRoutes from "./modules/export/export.routes";
import superAdminRoutes from "./modules/super-admin/super-admin.routes";
import { notFoundHandler } from "./middlewares/not-found";
import { errorHandler } from "./middlewares/error-handler";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(cookieParser(env.cookieSecret));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/public", publicRoutes);
  app.use("/api/admin/auth", adminAuthRoutes);
  app.use("/api/admin/links", adminLinksRoutes);
  app.use("/api/admin/sessions", adminSessionsRoutes);
  app.use("/api/admin/export", exportRoutes);
  app.use("/api/super-admin", superAdminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
