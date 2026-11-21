import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzleServerless } from "drizzle-orm/neon-serverless";
import { neon, neonConfig, Pool } from "@neondatabase/serverless";
import * as schema from "./schema";

neonConfig.webSocketConstructor = globalThis.WebSocket;

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

function createTransactionClient(pool: Pool) {
  return drizzleServerless(pool, { schema });
}

export type Transaction = Parameters<
  Parameters<ReturnType<typeof createTransactionClient>["transaction"]>[0]
>[0];

export async function withTransaction<T>(
  callback: (tx: Transaction) => Promise<T>
): Promise<T> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const client = createTransactionClient(pool);

  try {
    return await client.transaction(callback);
  } finally {
    await pool.end();
  }
}
