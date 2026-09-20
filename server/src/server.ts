import { createApp } from "./app";
import { env } from "./config/env";
import { initCoreDb } from "./db/migrations/init-core-db";
import { ensureSuperAdmin } from "./services/bootstrap/super-admin-bootstrap.service";
import { pool } from "./db/postgres";

async function bootstrap() {
  await initCoreDb();
  const superAdminCreated = await ensureSuperAdmin();

  if (superAdminCreated) {
    console.log("Super admin created");
  }

  const app = createApp();

  const server = app.listen(env.port, "0.0.0.0", () => {
    console.log(`Server started on http://localhost:${env.port}`);
  });

  const shutdown = () => {
    // Do not let an unfinished request delay a deployment indefinitely.
    const timeout = setTimeout(() => process.exit(1), 25000);
    timeout.unref();
    server.close(() => {
      pool.end().finally(() => process.exit(0));
    });
  };

  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
