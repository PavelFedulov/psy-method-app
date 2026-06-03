import { initCoreDb } from "../db/migrations/init-core-db";

initCoreDb()
  .then(() => {
    console.log("PostgreSQL DB initialized");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
