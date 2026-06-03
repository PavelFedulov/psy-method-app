import { createApp } from "./app";
import { env } from "./config/env";
import { initCoreDb } from "./db/migrations/init-core-db";

async function bootstrap() {
  await initCoreDb();
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server started on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
