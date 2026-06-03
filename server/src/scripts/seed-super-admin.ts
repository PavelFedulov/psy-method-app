import { initCoreDb } from "../db/migrations/init-core-db";
import { ensureSuperAdmin } from "../services/bootstrap/super-admin-bootstrap.service";

async function run() {
  await initCoreDb();
  const created = await ensureSuperAdmin();

  if (!created) {
    console.log("Super admin already exists");
    return;
  }

  console.log("Super admin created");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
