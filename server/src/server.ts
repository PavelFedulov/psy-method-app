import fs from "fs";
import { createApp } from "./app";
import { env } from "./config/env";
import { initCoreDb } from "./db/migrations/init-core-db";

function ensureDirectories() {
  if (!fs.existsSync(env.adminDbDir)) {
    fs.mkdirSync(env.adminDbDir, { recursive: true });
  }
}

function bootstrap() {
  ensureDirectories();
  initCoreDb();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server started on http://localhost:${env.port}`);
  });
}

bootstrap();
