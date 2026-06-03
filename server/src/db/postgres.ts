import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { env } from "../config/env";

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.isProduction ? { rejectUnauthorized: false } : undefined,
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
