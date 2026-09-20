import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { env } from "../config/env";

const databaseUrl = new URL(env.databaseUrl);
if (env.isProduction) {
  // Neon is reached over the public network; verify its certificate and hostname.
  databaseUrl.searchParams.set("sslmode", "verify-full");
}

export const pool = new Pool({
  connectionString: databaseUrl.toString(),
  // Allow time for the first connection after Neon's scale-to-zero.
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 10000,
  max: 5,
});

// A suspended/restarted database can close an idle connection.
pool.on("error", () => {
  console.error("Unexpected error on idle PostgreSQL connection");
});

export async function query<T extends QueryResultRow>(
  sql: string,
  params: unknown[] = [],
) {
  const result = await pool.query<T>(sql, params);
  return result;
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
